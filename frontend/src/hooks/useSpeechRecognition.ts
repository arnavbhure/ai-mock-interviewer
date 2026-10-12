import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SpeechErrorCode,
  WebSpeechRecognition,
  WebSpeechRecognitionErrorEvent,
  WebSpeechRecognitionEvent,
} from "@/types/speechRecognition.types";

interface UseSpeechRecognitionOptions {
  /** Language for recognition. Defaults to "en-US". Can be set to "en-IN", etc. */
  lang?: string;
  /** Whether the recognition should be disabled (e.g. during submission or when input mode is text) */
  disabled?: boolean;
  /** Callback fired whenever a finalized sentence or phrase is recognized */
  onFinalResult?: (finalSegment: string) => void;
  /** Callback fired whenever interim recognition results update */
  onInterimResult?: (interimSegment: string) => void;
  /** Optional callback for error logging */
  onError?: (message: string, code: SpeechErrorCode) => void;
}

export function useSpeechRecognition({
  lang = "en-US",
  disabled = false,
  onFinalResult,
  onInterimResult,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const isSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<SpeechErrorCode | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const recognitionRef = useRef<WebSpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const lastFinalIndexRef = useRef(-1);

  // Store callbacks in refs to avoid restarting recognition on callback identity changes
  const onFinalResultRef = useRef(onFinalResult);
  onFinalResultRef.current = onFinalResult;

  const onInterimResultRef = useRef(onInterimResult);
  onInterimResultRef.current = onInterimResult;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // ─── Stop active session safely ──────────────────────────────
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopped; ignore
      }
    }
  }, []);

  // ─── Abort active session immediately ────────────────────────
  const abortListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort errors
      }
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
    setErrorCode(null);
  }, []);

  // ─── Start speech recognition ─────────────────────────────────
  const startListening = useCallback((): boolean => {
    if (!isSupported) {
      const msg = "Speech recognition is not supported in this browser. Please use Text Mode.";
      setError(msg);
      setErrorCode("not-supported");
      onErrorRef.current?.(msg, "not-supported");
      return false;
    }

    if (disabled) {
      return false;
    }

    // Stop existing instance if already listening to prevent duplicate sessions
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    resetError();
    lastFinalIndexRef.current = -1;
    setInterimTranscript("");

    try {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionConstructor) {
        throw new Error("SpeechRecognition API missing.");
      }

      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setError(null);
        setErrorCode(null);
      };

      recognition.onresult = (event: WebSpeechRecognitionEvent) => {
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptChunk = result?.[0]?.transcript ?? "";

          if (result.isFinal) {
            // Guard against duplicate appending of the same final result index
            if (i > lastFinalIndexRef.current) {
              lastFinalIndexRef.current = i;
              const trimmed = transcriptChunk.trim();
              if (trimmed) {
                onFinalResultRef.current?.(trimmed);
              }
            }
          } else {
            currentInterim += transcriptChunk;
          }
        }

        setInterimTranscript(currentInterim);
        onInterimResultRef.current?.(currentInterim);
      };

      recognition.onerror = (event: WebSpeechRecognitionErrorEvent) => {
        const rawCode = event.error || "unknown";
        const code = rawCode as SpeechErrorCode;

        // "aborted" happens when user or code stops recognition manually — not a user-facing error
        if (code === "aborted") {
          isListeningRef.current = false;
          setIsListening(false);
          return;
        }

        // "no-speech" happens during periods of silence — recoverable, keep previous transcript
        if (code === "no-speech") {
          isListeningRef.current = false;
          setIsListening(false);
          setInterimTranscript("");
          return;
        }

        let userMessage = "Speech recognition encountered an issue. You can retry or switch to Text Mode.";

        if (code === "not-allowed" || code === "service-not-allowed") {
          userMessage =
            "Microphone permission was denied. Please allow microphone access in your browser settings or switch to Text Mode.";
          setIsPermissionDenied(true);
        } else if (code === "audio-capture") {
          userMessage = "No microphone was detected. Please connect a microphone or use Text Mode.";
        } else if (code === "network") {
          userMessage =
            "Speech recognition connection failed. Note: Brave browser blocks Google speech services by default for privacy. Enable Google speech in Brave settings, switch to Chrome/Edge, or use Text Mode.";
        }

        setError(userMessage);
        setErrorCode(code);
        isListeningRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
        onErrorRef.current?.(userMessage, code);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to initialize microphone speech recognition.";
      setError(msg);
      setErrorCode("unknown");
      isListeningRef.current = false;
      setIsListening(false);
      onErrorRef.current?.(msg, "unknown");
      return false;
    }
  }, [isSupported, disabled, lang, resetError]);

  // ─── If disabled becomes true while listening, stop ───────────
  useEffect(() => {
    if (disabled && isListeningRef.current) {
      stopListening();
    }
  }, [disabled, stopListening]);

  // ─── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    interimTranscript,
    error,
    errorCode,
    isPermissionDenied,
    startListening,
    stopListening,
    abortListening,
    resetError,
  };
}
