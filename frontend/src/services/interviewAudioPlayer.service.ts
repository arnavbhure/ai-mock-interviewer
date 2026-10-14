/**
 * InterviewAudioPlayer — Low-latency PCM streaming audio player
 *
 * Handles raw PCM data streamed from backend TTS via Socket.IO.
 * Uses Web Audio API with timeline-scheduled AudioBufferSourceNodes
 * for crystal-clear, low-latency, glitch-free progressive playback.
 *
 * Architecture:
 * - Single AudioContext managed across the session lifetime with auto-recovery
 * - Seamless timeline chunk scheduling (no deprecated ScriptProcessor glitches)
 * - Watchdog safety timers preventing any hanging or frozen speaking states
 * - Ordered chunk reassembly into persistent AudioBuffer for instant replaying
 * - Automatic Web Audio autoplay resume upon user interaction
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
  allChunks: Map<number, Float32Array>; // Preserved for replay
  nextChunkToPlay: number;
  totalChunksReceived: number;
  streamEnded: boolean;
  totalChunksExpected: number | null;
}

// ─── Constants ────────────────────────────────────────────────

const DEFAULT_SAMPLE_RATE = 24000;

// ─── Service Class ────────────────────────────────────────────

class InterviewAudioPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private session: StreamSession | null = null;
  private status: AudioPlayerStatus = "idle";
  private callbacks: AudioPlayerCallbacks = {};
  private isPlaying = false;
  private isDisposed = false;

  // Progressive streaming timeline state
  private nextScheduleTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private lastScheduledSource: AudioBufferSourceNode | null = null;
  private streamWatchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private drainWatchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private inactivityWatchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private prebufferTimer: ReturnType<typeof setTimeout> | null = null;

  // Remainder byte accumulator to ensure 16-bit PCM word alignment across network chunks
  private remainderByte: number | null = null;

  // Replay State
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
    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
        if (import.meta.env.DEV) {
          console.log("[AudioPlayer] Context resumed successfully, state:", ctx.state);
        }
      } catch (err) {
        console.warn("[AudioPlayer] Context resume deferred:", err);
      }
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
  startStream(payload: {
    questionId: string;
    format: string;
    sampleRate: number;
    channels: number;
  }): void {
    // Cancel any existing playback or replay
    this.stopPlayback();
    this.stopReplay();
    this.ensureAudioContext();

    this.remainderByte = null;
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

    this.nextScheduleTime = 0;
    this.lastScheduledSource = null;
    this.setStatus("buffering");

    if (import.meta.env.DEV) {
      console.log(
        "[AudioPlayer] stream started for question:",
        payload.questionId,
        "sampleRate:",
        payload.sampleRate,
      );
    }

    // Safety Watchdog: If no chunks arrive within 5s, release lock
    this.clearWatchdogs();
    this.streamWatchdogTimer = setTimeout(() => {
      if (this.session && this.session.totalChunksReceived === 0) {
        console.warn("[AudioPlayer] Watchdog: No audio chunks arrived within 5s, releasing stream");
        this.onPlaybackFinished();
      }
    }, 5000);
  }

  /**
   * Called when backend emits `interview:audio:chunk`.
   * Accepts raw PCM data (Buffer/ArrayBuffer/Uint8Array) and its ordered index.
   */
  enqueueChunk(payload: {
    questionId: string;
    index: number;
    audio: any;
  }): void {
    if (!this.session) return;
    if (payload.questionId !== this.session.questionId) return;

    // Deduplicate
    if (this.session.allChunks.has(payload.index)) return;

    // Convert raw PCM bytes (16-bit signed LE) to Float32Array
    const float32 = this.pcm16ToFloat32(payload.audio);
    if (float32.length === 0) return;

    this.session.chunks.set(payload.index, float32);
    this.session.allChunks.set(payload.index, float32);
    this.session.totalChunksReceived++;

    // Clear start watchdog since chunks are flowing
    if (this.streamWatchdogTimer) {
      clearTimeout(this.streamWatchdogTimer);
      this.streamWatchdogTimer = null;
    }

    // Inactivity watchdog: if backend drops connection without sending interview:audio:end,
    // drain and finish after 3.5s of chunk silence
    if (this.inactivityWatchdogTimer) {
      clearTimeout(this.inactivityWatchdogTimer);
    }
    this.inactivityWatchdogTimer = setTimeout(() => {
      if (this.session && !this.session.streamEnded && this.session.totalChunksReceived > 0) {
        console.warn(
          "[AudioPlayer] Inactivity watchdog: No new chunks for 3.5s, ending stream automatically",
        );
        this.endStream({
          questionId: this.session.questionId,
          totalChunks: this.session.totalChunksReceived,
        });
      }
    }, 3500);

    // Schedule contiguous chunks onto Web Audio timeline
    this.scheduleContiguousChunks();
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

    // Schedule any remaining contiguous chunks (forcing start if prebuffer was pending)
    this.scheduleContiguousChunks(true);

    // If any gaps or packet loss left chunks unplayed, schedule them now in ascending order
    if (this.session.chunks.size > 0) {
      const remainingIndices = Array.from(this.session.chunks.keys()).sort((a, b) => a - b);
      for (const idx of remainingIndices) {
        const chunkFloat32 = this.session.chunks.get(idx)!;
        this.session.chunks.delete(idx);
        this.scheduleSingleChunk(chunkFloat32);
      }
    }

    // If zero chunks were received, complete immediately
    if (this.session.totalChunksReceived === 0) {
      this.onPlaybackFinished();
      return;
    }

    this.setStatus("draining");

    // Calculate when the scheduled timeline finishes
    const ctx = this.audioContext;
    const now = ctx ? ctx.currentTime : 0;
    const remainingSec = Math.max(0, this.nextScheduleTime - now);

    this.clearWatchdogs();

    // Attach hardware completion callback to the final scheduled audio chunk
    if (this.lastScheduledSource) {
      const targetSource = this.lastScheduledSource;
      targetSource.onended = () => {
        const idx = this.activeSources.indexOf(targetSource);
        if (idx !== -1) this.activeSources.splice(idx, 1);
        if (this.session && this.session.streamEnded) {
          if (import.meta.env.DEV) {
            console.log("[AudioPlayer] Hardware playback ended for final chunk");
          }
          this.onPlaybackFinished();
        }
      };
    }

    // Safety watchdog: ensure playback finish fires even if onended is delayed or throttled
    this.drainWatchdogTimer = setTimeout(() => {
      this.onPlaybackFinished();
    }, Math.max(300, Math.ceil((remainingSec + 0.35) * 1000)));
  }

  /**
   * Called on `interview:audio:error` from backend.
   */
  handleStreamError(payload: { questionId: string; message: string }): void {
    if (this.session && payload.questionId && payload.questionId !== this.session.questionId) {
      return;
    }

    console.error("[AudioPlayer] stream error:", payload.message);
    this.stopPlayback();
    this.setStatus("error");
    this.callbacks.onError?.(payload.message);
  }

  /**
   * Cancel current streaming playback immediately.
   */
  stopPlayback(): void {
    this.clearWatchdogs();
    this.remainderByte = null;
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Already stopped
      }
    }
    this.activeSources = [];
    this.lastScheduledSource = null;
    this.nextScheduleTime = 0;
    this.session = null;
    this.isPlaying = false;
    this.setStatus("idle");
  }

  /**
   * Replay the full recorded question audio.
   * Can be called after all audio chunks have streamed.
   */
  async replayAudio(questionId?: string): Promise<boolean> {
    const ctx = this.ensureAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
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
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode || ctx.destination);

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

      const now = ctx.currentTime;
      // Gentle micro-fade in to prevent DAC click on replay
      if (this.gainNode) {
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(1.0, now + 0.005);
      }

      source.start(now);
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
        this.replaySource.disconnect();
      } catch {
        // Already stopped
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

  private ensureAudioContext(): AudioContext | null {
    if (this.audioContext && this.audioContext.state !== "closed") {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume().catch(() => {});
      }
      return this.audioContext;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;

      // Allow browser to pick native output hardware sample rate (e.g. 44.1kHz or 48kHz)
      // Web Audio AudioBufferSourceNode natively resamples the 24kHz buffer to hardware rate
      try {
        this.audioContext = new AudioCtx();
      } catch {
        this.audioContext = new AudioCtx({ sampleRate: DEFAULT_SAMPLE_RATE });
      }

      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.audioContext.destination);

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume().catch(() => {});
      }
      this.isDisposed = false;

      if (import.meta.env.DEV) {
        console.log(
          "[AudioPlayer] Context created, sampleRate:",
          this.audioContext.sampleRate,
          "state:",
          this.audioContext.state,
        );
      }
      return this.audioContext;
    } catch (err) {
      console.error("[AudioPlayer] Failed to create AudioContext:", err);
      return null;
    }
  }

  private setStatus(newStatus: AudioPlayerStatus): void {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.callbacks.onStatusChange?.(newStatus);
  }

  private clearWatchdogs(): void {
    if (this.streamWatchdogTimer) {
      clearTimeout(this.streamWatchdogTimer);
      this.streamWatchdogTimer = null;
    }
    if (this.drainWatchdogTimer) {
      clearTimeout(this.drainWatchdogTimer);
      this.drainWatchdogTimer = null;
    }
    if (this.inactivityWatchdogTimer) {
      clearTimeout(this.inactivityWatchdogTimer);
      this.inactivityWatchdogTimer = null;
    }
    if (this.prebufferTimer) {
      clearTimeout(this.prebufferTimer);
      this.prebufferTimer = null;
    }
  }

  /**
   * Convert incoming PCM 16-bit signed LE bytes to Float32Array.
   * Handles ArrayBuffer, Uint8Array, Node Buffer, and JSON-serialized Buffer objects.
   * Carries over trailing odd bytes across chunk boundaries to strictly maintain
   * 16-bit sample alignment.
   */
  private pcm16ToFloat32(raw: any): Float32Array {
    if (!raw) return new Float32Array(0);

    let inputBytes: Uint8Array;
    if (raw instanceof Uint8Array) {
      inputBytes = raw;
    } else if (raw instanceof ArrayBuffer) {
      inputBytes = new Uint8Array(raw);
    } else if (raw.buffer instanceof ArrayBuffer) {
      inputBytes = new Uint8Array(raw.buffer, raw.byteOffset || 0, raw.byteLength || raw.length);
    } else if (Array.isArray(raw)) {
      inputBytes = new Uint8Array(raw);
    } else if (raw.data && (Array.isArray(raw.data) || raw.data instanceof Uint8Array)) {
      inputBytes = new Uint8Array(raw.data);
    } else if (raw.data && raw.data instanceof ArrayBuffer) {
      inputBytes = new Uint8Array(raw.data);
    } else {
      inputBytes = new Uint8Array(0);
    }

    if (inputBytes.length === 0) return new Float32Array(0);

    // Prepend remainder byte from previous chunk if present
    let bytes: Uint8Array;
    if (this.remainderByte !== null) {
      bytes = new Uint8Array(inputBytes.length + 1);
      bytes[0] = this.remainderByte;
      bytes.set(inputBytes, 1);
      this.remainderByte = null;
    } else {
      bytes = inputBytes;
    }

    // If an odd byte remains, save it for the next chunk
    if (bytes.length % 2 !== 0) {
      this.remainderByte = bytes[bytes.length - 1];
      bytes = bytes.subarray(0, bytes.length - 1);
    }

    const numSamples = bytes.length / 2;
    if (numSamples === 0) return new Float32Array(0);

    const float32 = new Float32Array(numSamples);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    for (let i = 0; i < numSamples; i++) {
      const int16 = view.getInt16(i * 2, true); // little-endian
      float32[i] = int16 / 32768;
    }

    return float32;
  }

  /**
   * Schedule a single Float32Array PCM chunk onto Web Audio timeline.
   */
  private scheduleSingleChunk(chunkFloat32: Float32Array): void {
    if (!this.session) return;
    const ctx = this.ensureAudioContext();
    if (!ctx || !this.gainNode) return;

    const buffer = ctx.createBuffer(
      this.session.channels || 1,
      chunkFloat32.length,
      this.session.sampleRate,
    );
    buffer.copyToChannel(chunkFloat32, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);

    const isFirstChunk = !this.isPlaying;
    const now = ctx.currentTime;

    let startTime: number;
    if (isFirstChunk) {
      // Lookahead of 35ms gives the browser audio thread time to start without drop-out
      startTime = now + 0.035;
      this.nextScheduleTime = startTime;

      // Apply a smooth 4ms micro-fadein at start to eliminate any zero-crossing DAC pop
      this.gainNode.gain.cancelScheduledValues(startTime);
      this.gainNode.gain.setValueAtTime(0, startTime);
      this.gainNode.gain.linearRampToValueAtTime(1.0, startTime + 0.004);
    } else {
      // Seamlessly concatenate; if network underrun occurred, recover cleanly
      startTime = Math.max(now + 0.005, this.nextScheduleTime);
    }

    source.start(startTime);
    this.nextScheduleTime = startTime + buffer.duration;
    this.activeSources.push(source);
    this.lastScheduledSource = source;

    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) {
        this.activeSources.splice(idx, 1);
      }
    };

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.setStatus("playing");
    }
  }

  /**
   * Schedule available contiguous chunks onto Web Audio timeline.
   * If not yet playing, pre-buffers ~120ms of contiguous audio to absorb network jitter.
   */
  private scheduleContiguousChunks(forceStart = false): void {
    if (!this.session) return;

    if (!this.isPlaying && !forceStart && !this.session.streamEnded) {
      // Calculate how many samples of contiguous audio we have ready
      let availableSamples = 0;
      let checkIdx = this.session.nextChunkToPlay;
      while (this.session.chunks.has(checkIdx)) {
        availableSamples += this.session.chunks.get(checkIdx)!.length;
        checkIdx++;
      }

      const availableDuration = availableSamples / this.session.sampleRate;
      const PREBUFFER_TARGET_SEC = 0.12; // 120ms pre-buffer

      if (availableDuration < PREBUFFER_TARGET_SEC) {
        // Set a fallback timer so we don't wait indefinitely if fewer chunks arrive
        if (!this.prebufferTimer) {
          this.prebufferTimer = setTimeout(() => {
            this.prebufferTimer = null;
            this.scheduleContiguousChunks(true);
          }, 200);
        }
        return;
      }
    }

    if (this.prebufferTimer) {
      clearTimeout(this.prebufferTimer);
      this.prebufferTimer = null;
    }

    while (this.session.chunks.has(this.session.nextChunkToPlay)) {
      const chunkFloat32 = this.session.chunks.get(this.session.nextChunkToPlay)!;
      this.session.chunks.delete(this.session.nextChunkToPlay);
      this.session.nextChunkToPlay++;
      this.scheduleSingleChunk(chunkFloat32);
    }
  }

  /**
   * Called when all scheduled audio has finished playing.
   */
  private onPlaybackFinished(): void {
    this.clearWatchdogs();
    this.remainderByte = null;
    this.activeSources = [];
    this.lastScheduledSource = null;
    this.nextScheduleTime = 0;
    this.session = null;
    this.isPlaying = false;
    this.setStatus("idle");
    this.callbacks.onPlaybackComplete?.();

    if (import.meta.env.DEV) {
      console.log("[AudioPlayer] playback finished, transitioned to idle");
    }
  }

  /**
   * Concatenate all received chunks in ordered sequence into a single AudioBuffer.
   * This provides instant, glitch-free replaying via AudioBufferSourceNode.
   */
  private assembleCompleteAudioBuffer(): void {
    if (!this.session || this.session.allChunks.size === 0) {
      return;
    }
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const indices = Array.from(this.session.allChunks.keys()).sort((a, b) => a - b);
    let totalSamples = 0;
    for (const idx of indices) {
      totalSamples += this.session.allChunks.get(idx)!.length;
    }

    if (totalSamples === 0) return;

    try {
      const buffer = ctx.createBuffer(
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
}

// ─── Singleton Export ─────────────────────────────────────────

export const interviewAudioPlayer = new InterviewAudioPlayer();
export default interviewAudioPlayer;
