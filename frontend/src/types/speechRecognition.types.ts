/**
 * Native Web Speech API TypeScript definitions and state interfaces.
 */

export type CandidateInputMode = "voice" | "text";

export type SpeechErrorCode =
  | "not-allowed"
  | "no-speech"
  | "audio-capture"
  | "network"
  | "not-supported"
  | "aborted"
  | "service-not-allowed"
  | "unknown";

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  interimTranscript: string;
  error: string | null;
  errorCode: SpeechErrorCode | null;
  isPermissionDenied: boolean;
}

export interface WebSpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface WebSpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: WebSpeechRecognition, ev: Event) => void) | null;
  onend: ((this: WebSpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: WebSpeechRecognition, ev: WebSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: WebSpeechRecognition, ev: WebSpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => WebSpeechRecognition;
    webkitSpeechRecognition?: new () => WebSpeechRecognition;
  }
}
