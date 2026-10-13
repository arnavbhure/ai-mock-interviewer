/**
 * InterviewAudioPlayer — Low-latency PCM streaming audio player
 *
 * Handles raw PCM data streamed from backend TTS via Socket.IO.
 * Uses Web Audio API with a ScriptProcessorNode for progressive playback.
 *
 * Architecture:
 * - Single AudioContext managed across the session lifetime
 * - Chunks arrive via `enqueueChunk()`, buffered in order by index
 * - Startup buffer collects initial chunks before playback begins
 * - When streaming ends, remaining buffer drains then fires `onPlaybackComplete`
 * - Full cancellation/disposal support without memory leaks
 */

// ─── Types ────────────────────────────────────────────────────

export type AudioPlayerStatus =
  | "idle"
  | "buffering"
  | "playing"
  | "draining"
  | "error";

export interface AudioPlayerCallbacks {
  onStatusChange?: (status: AudioPlayerStatus) => void;
  onPlaybackComplete?: () => void;
  onError?: (message: string) => void;
  onAudioReadyToReplay?: (questionId: string) => void;
  onReplayStatusChange?: (isReplaying: boolean) => void;
}

interface StreamSession {
  questionId: string;
  sampleRate: number;
  channels: number;
  format: string;
  chunks: Map<number, Float32Array>;
  allChunks: Map<number, Float32Array>; // Preserved across playback for replay
  nextChunkToPlay: number;
  totalChunksReceived: number;
  streamEnded: boolean;
  totalChunksExpected: number | null;
}

// ─── Constants ────────────────────────────────────────────────

const STARTUP_BUFFER_CHUNKS = 3; // Wait for N chunks before starting playback
const SCRIPT_PROCESSOR_BUFFER_SIZE = 4096; // Frames per processing callback
const DEFAULT_SAMPLE_RATE = 24000;

// ─── Service Class ────────────────────────────────────────────

class InterviewAudioPlayer {
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private gainNode: GainNode | null = null;
  private session: StreamSession | null = null;
  private status: AudioPlayerStatus = "idle";
  private callbacks: AudioPlayerCallbacks = {};
  private playbackBuffer: Float32Array[] = [];
  private currentBufferOffset = 0;
  private isPlaying = false;
  private isDisposed = false;
  private contextResumed = false;

  // ── Replay State ─────────────────────────────────────────────
  private cachedAudioBuffers: Map<string, AudioBuffer> = new Map();
  private lastAudioBuffer: AudioBuffer | null = null;
  private lastQuestionId: string | null = null;
  private replaySource: AudioBufferSourceNode | null = null;
  private isReplaying = false;

  // ── Public API ──────────────────────────────────────────────

  /**
   * Initialize AudioContext. Should be called from a user-gesture handler
   * (e.g. "Start Interview" button click) to satisfy browser autoplay policy.
   */
  async initialize(): Promise<void> {
    if (this.audioContext && this.audioContext.state !== "closed") {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
        this.contextResumed = true;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: DEFAULT_SAMPLE_RATE });

      // Create a gain node for volume control / muting
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.audioContext.destination);

      // Resume immediately (requires user gesture context)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      this.contextResumed = true;
      this.isDisposed = false;

      if (import.meta.env.DEV) {
        console.log(
          "[AudioPlayer] initialized, sampleRate:",
          this.audioContext.sampleRate,
          "state:",
          this.audioContext.state,
        );
      }
    } catch (err) {
      console.error("[AudioPlayer] failed to initialize AudioContext:", err);
      this.setStatus("error");
      this.callbacks.onError?.("Failed to initialize audio playback.");
    }
  }

  /**
   * Register lifecycle callbacks.
   */
  setCallbacks(callbacks: AudioPlayerCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Called when backend emits `interview:audio:start`.
   * Prepares a new streaming session.
   */
  /**
   * Called when backend emits `interview:audio:start`.
   * Prepares a new streaming session.
   */
  startStream(payload: {
    questionId: string;
    format: string;
    sampleRate: number;
    channels: number;
  }): void {
    // Cancel any existing playback or replay
    this.stopPlayback();
    this.stopReplay();

    this.lastQuestionId = payload.questionId;
    this.session = {
      questionId: payload.questionId,
      sampleRate: payload.sampleRate || DEFAULT_SAMPLE_RATE,
      channels: payload.channels || 1,
      format: payload.format || "pcm",
      chunks: new Map(),
      allChunks: new Map(),
      nextChunkToPlay: 0,
      totalChunksReceived: 0,
      streamEnded: false,
      totalChunksExpected: null,
    };

    this.setStatus("buffering");

    if (import.meta.env.DEV) {
      console.log(
        "[AudioPlayer] stream started for question:",
        payload.questionId,
        "sampleRate:",
        payload.sampleRate,
      );
    }
  }

  /**
   * Called when backend emits `interview:audio:chunk`.
   * Accepts raw PCM data (Buffer/ArrayBuffer) and its ordered index.
   */
  enqueueChunk(payload: {
    questionId: string;
    index: number;
    audio: ArrayBuffer | Buffer | Uint8Array;
  }): void {
    if (!this.session) return;
    if (payload.questionId !== this.session.questionId) return;

    // Deduplicate
    if (this.session.chunks.has(payload.index)) return;

    // Convert raw PCM bytes (16-bit signed LE) to Float32Array
    const float32 = this.pcm16ToFloat32(payload.audio);
    this.session.chunks.set(payload.index, float32);
    this.session.allChunks.set(payload.index, float32);
    this.session.totalChunksReceived++;

    // If we've accumulated enough startup buffer chunks, begin playback
    if (!this.isPlaying && this.session.totalChunksReceived >= STARTUP_BUFFER_CHUNKS) {
      this.beginPlayback();
    }

    // If already playing, flush any contiguous chunks into the playback buffer
    if (this.isPlaying) {
      this.flushChunksToPlaybackBuffer();
    }
  }

  /**
   * Called when backend emits `interview:audio:end`.
   * Marks the stream as finished; remaining chunks will drain.
   */
  endStream(payload: { questionId: string; totalChunks: number }): void {
    if (!this.session) return;
    if (payload.questionId !== this.session.questionId) return;

    this.session.streamEnded = true;
    this.session.totalChunksExpected = payload.totalChunks;

    if (import.meta.env.DEV) {
      console.log(
        "[AudioPlayer] stream ended, totalChunks:",
        payload.totalChunks,
        "received:",
        this.session.totalChunksReceived,
      );
    }

    // Assemble the complete AudioBuffer so user can replay the audio anytime
    this.assembleCompleteAudioBuffer();

    // If we never reached the startup threshold, start now with what we have
    if (!this.isPlaying && this.session.totalChunksReceived > 0) {
      this.beginPlayback();
    }

    this.flushChunksToPlaybackBuffer();
    this.setStatus("draining");
  }

  /**
   * Called on `interview:audio:error` from backend.
   */
  handleStreamError(payload: { questionId: string; message: string }): void {
    if (this.session && payload.questionId !== this.session.questionId) return;

    console.error("[AudioPlayer] stream error:", payload.message);
    this.stopPlayback();
    this.setStatus("error");
    this.callbacks.onError?.(payload.message);
  }

  /**
   * Cancel current streaming playback immediately.
   */
  stopPlayback(): void {
    this.teardownScriptProcessor();
    this.session = null;
    this.playbackBuffer = [];
    this.currentBufferOffset = 0;
    this.isPlaying = false;
    this.setStatus("idle");
  }

  /**
   * Replay the full recorded question audio.
   * Can be called after all audio chunks have streamed.
   */
  async replayAudio(questionId?: string): Promise<boolean> {
    if (!this.audioContext) {
      await this.initialize();
    }
    if (!this.audioContext) return false;

    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch {
        // ignore
      }
    }

    // Stop any existing stream playback or replay
    this.stopPlayback();
    this.stopReplay();

    const buffer =
      (questionId && this.cachedAudioBuffers.get(questionId)) ||
      this.lastAudioBuffer;

    if (!buffer) {
      if (import.meta.env.DEV) {
        console.warn(
          "[AudioPlayer] No audio buffer found for replay, target:",
          questionId,
        );
      }
      return false;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode || this.audioContext.destination);

      this.replaySource = source;
      this.isReplaying = true;
      this.callbacks.onReplayStatusChange?.(true);

      source.onended = () => {
        if (this.replaySource === source) {
          this.replaySource = null;
          this.isReplaying = false;
          this.callbacks.onReplayStatusChange?.(false);
          if (import.meta.env.DEV) {
            console.log("[AudioPlayer] Replay finished");
          }
        }
      };

      source.start(0);
      if (import.meta.env.DEV) {
        console.log("[AudioPlayer] Replay started");
      }
      return true;
    } catch (err) {
      console.error("[AudioPlayer] Replay failed:", err);
      this.isReplaying = false;
      this.callbacks.onReplayStatusChange?.(false);
      return false;
    }
  }

  /**
   * Stop any active audio replay.
   */
  stopReplay(): void {
    if (this.replaySource) {
      try {
        this.replaySource.stop();
      } catch {
        // already stopped
      }
      this.replaySource = null;
    }
    if (this.isReplaying) {
      this.isReplaying = false;
      this.callbacks.onReplayStatusChange?.(false);
    }
  }

  /**
   * Check whether audio is cached and ready to replay for a question.
   */
  hasAudioForQuestion(questionId?: string): boolean {
    if (questionId && this.cachedAudioBuffers.has(questionId)) {
      return true;
    }
    return this.lastAudioBuffer !== null;
  }

  /**
   * Check if audio is currently replaying.
   */
  isCurrentlyReplaying(): boolean {
    return this.isReplaying;
  }

  /**
   * Set volume (0.0 – 1.0). Use 0 for mute.
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Full disposal. Call on interview end / unmount.
   */
  async dispose(): Promise<void> {
    this.stopPlayback();
    this.stopReplay();
    this.cachedAudioBuffers.clear();
    this.lastAudioBuffer = null;
    this.lastQuestionId = null;
    if (this.audioContext && this.audioContext.state !== "closed") {
      try {
        await this.audioContext.close();
      } catch {
        // Already closed
      }
    }
    this.audioContext = null;
    this.gainNode = null;
    this.isDisposed = true;
    this.contextResumed = false;
    if (import.meta.env.DEV) {
      console.log("[AudioPlayer] disposed");
    }
  }

  /**
   * Get current status.
   */
  getStatus(): AudioPlayerStatus {
    return this.status;
  }

  /**
   * Check if AudioContext is ready.
   */
  isReady(): boolean {
    return (
      this.audioContext !== null &&
      this.audioContext.state === "running" &&
      !this.isDisposed
    );
  }

  // ── Private Implementation ──────────────────────────────────

  private setStatus(newStatus: AudioPlayerStatus): void {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.callbacks.onStatusChange?.(newStatus);
  }

  /**
   * Convert raw PCM 16-bit signed little-endian bytes to Float32Array.
   */
  private pcm16ToFloat32(raw: ArrayBuffer | Buffer | Uint8Array): Float32Array {
    const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
    const numSamples = Math.floor(bytes.length / 2);
    const float32 = new Float32Array(numSamples);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    for (let i = 0; i < numSamples; i++) {
      const int16 = view.getInt16(i * 2, true); // little-endian
      float32[i] = int16 / 32768;
    }

    return float32;
  }

  /**
   * Move contiguous chunks (by index) from the session map into the flat playback buffer.
   */
  private flushChunksToPlaybackBuffer(): void {
    if (!this.session) return;

    while (this.session.chunks.has(this.session.nextChunkToPlay)) {
      const chunk = this.session.chunks.get(this.session.nextChunkToPlay)!;
      this.playbackBuffer.push(chunk);
      this.session.chunks.delete(this.session.nextChunkToPlay);
      this.session.nextChunkToPlay++;
    }
  }

  /**
   * Begin ScriptProcessorNode-based playback.
   */
  private beginPlayback(): void {
    if (!this.audioContext || !this.gainNode || !this.session) return;

    // Ensure context is running
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => {});
    }

    this.flushChunksToPlaybackBuffer();

    // Create ScriptProcessorNode
    // (deprecated but widely supported; AudioWorklet alternative requires separate file)
    this.scriptProcessor = this.audioContext.createScriptProcessor(
      SCRIPT_PROCESSOR_BUFFER_SIZE,
      0, // no input channels
      this.session.channels || 1,
    );

    this.scriptProcessor.onaudioprocess = (event) => {
      const output = event.outputBuffer.getChannelData(0);
      let outputOffset = 0;

      while (outputOffset < output.length) {
        // Get current buffer segment
        if (this.playbackBuffer.length === 0) {
          // No data available — fill silence
          output.fill(0, outputOffset);
          break;
        }

        const currentChunk = this.playbackBuffer[0];
        const remainingInChunk = currentChunk.length - this.currentBufferOffset;
        const remainingInOutput = output.length - outputOffset;
        const toCopy = Math.min(remainingInChunk, remainingInOutput);

        output.set(
          currentChunk.subarray(
            this.currentBufferOffset,
            this.currentBufferOffset + toCopy,
          ),
          outputOffset,
        );

        outputOffset += toCopy;
        this.currentBufferOffset += toCopy;

        // Consumed entire chunk
        if (this.currentBufferOffset >= currentChunk.length) {
          this.playbackBuffer.shift();
          this.currentBufferOffset = 0;
        }
      }

      // Check if playback is complete
      if (
        this.session?.streamEnded &&
        this.playbackBuffer.length === 0 &&
        this.session.chunks.size === 0
      ) {
        // Schedule completion on next tick to avoid issues during audioprocess callback
        setTimeout(() => {
          this.onPlaybackFinished();
        }, 0);
      }
    };

    // Need to handle sample rate conversion if backend rate differs from AudioContext rate
    const sourceSampleRate = this.session.sampleRate;
    const contextSampleRate = this.audioContext.sampleRate;

    if (sourceSampleRate !== contextSampleRate && import.meta.env.DEV) {
      console.warn(
        `[AudioPlayer] Sample rate mismatch: source=${sourceSampleRate}, context=${contextSampleRate}. ` +
          `Audio may play at incorrect speed. Consider resampling.`,
      );
    }

    this.scriptProcessor.connect(this.gainNode);
    this.isPlaying = true;
    this.setStatus("playing");

    if (import.meta.env.DEV) {
      console.log("[AudioPlayer] playback started");
    }
  }

  /**
   * Called when all buffered audio has been played.
   */
  private onPlaybackFinished(): void {
    if (!this.isPlaying) return;

    if (import.meta.env.DEV) {
      console.log("[AudioPlayer] playback complete");
    }

    // Ensure audio buffer is assembled if it wasn't already
    this.assembleCompleteAudioBuffer();

    this.teardownScriptProcessor();
    this.isPlaying = false;
    this.setStatus("idle");
    this.callbacks.onPlaybackComplete?.();
  }

  /**
   * Concatenate all received chunks in ordered sequence into a single AudioBuffer.
   * This provides instant, glitch-free replaying via AudioBufferSourceNode.
   */
  private assembleCompleteAudioBuffer(): void {
    if (!this.session || !this.audioContext || this.session.allChunks.size === 0) {
      return;
    }

    const indices = Array.from(this.session.allChunks.keys()).sort((a, b) => a - b);
    let totalSamples = 0;
    for (const idx of indices) {
      totalSamples += this.session.allChunks.get(idx)!.length;
    }

    if (totalSamples === 0) return;

    try {
      const buffer = this.audioContext.createBuffer(
        this.session.channels || 1,
        totalSamples,
        this.session.sampleRate,
      );
      const channelData = buffer.getChannelData(0);
      let offset = 0;
      for (const idx of indices) {
        const chunk = this.session.allChunks.get(idx)!;
        channelData.set(chunk, offset);
        offset += chunk.length;
      }

      this.cachedAudioBuffers.set(this.session.questionId, buffer);
      this.lastAudioBuffer = buffer;
      this.lastQuestionId = this.session.questionId;
      this.callbacks.onAudioReadyToReplay?.(this.session.questionId);

      if (import.meta.env.DEV) {
        console.log(
          `[AudioPlayer] Assembled complete audio buffer for question "${this.session.questionId}": ` +
            `${totalSamples} samples (~${(totalSamples / this.session.sampleRate).toFixed(1)}s)`,
        );
      }
    } catch (err) {
      console.error("[AudioPlayer] Error creating complete AudioBuffer:", err);
    }
  }

  /**
   * Disconnect and clean up the ScriptProcessorNode.
   */
  private teardownScriptProcessor(): void {
    if (this.scriptProcessor) {
      this.scriptProcessor.onaudioprocess = null;
      try {
        this.scriptProcessor.disconnect();
      } catch {
        // Already disconnected
      }
      this.scriptProcessor = null;
    }
  }
}

// ─── Singleton Export ─────────────────────────────────────────

export const interviewAudioPlayer = new InterviewAudioPlayer();
export default interviewAudioPlayer;
