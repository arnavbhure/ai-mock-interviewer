import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  LogOut,
  Sliders,
  Sparkles,
  Volume2,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";

function formatDate(isoDate?: string): string {
  if (!isoDate) return "Recently created";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Recently created";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return isoDate;
  }
}

export function SettingsPage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const [copiedId, setCopiedId] = useState(false);
  const [preferredDifficulty, setPreferredDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [transcriptEnabled, setTranscriptEnabled] = useState(true);

  const name = user?.name?.trim() || "Candidate";
  const email = user?.email || "candidate@interviewai.dev";
  const isVerified = user?.is_verified ?? true;
  const createdAtFormatted = formatDate(user?.created_at);
  const userId = user?.id || "usr_live_account";

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSignOut = () => {
    clearUser();
    navigate("/login");
  };

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      {/* ── Page Header ── */}
      <motion.header
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[11px] font-semibold text-primary mb-2">
          <Sliders className="h-3 w-3" />
          <span>ACCOUNT & PREFERENCES</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">
          Settings
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-text-secondary">
          Manage your authenticated profile details, interview preferences, and account security.
        </p>
      </motion.header>

      <div className="space-y-8">
        {/* ── 1. Profile Section ── */}
        <motion.section
          initial={enter}
          animate={shown}
          transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.05 }}
          className="rounded-card border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-5 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary shadow-sm">
                {initials || <User className="size-6" />}
              </div>
              <div>
                <h2 className="text-base font-semibold text-text">{name}</h2>
                <p className="text-xs text-text-muted">{email}</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <CheckCircle2 className="size-3.5" />
                  <span>Verified Account</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                  <AlertCircle className="size-3.5" />
                  <span>Unverified</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full rounded-input border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-text opacity-90 cursor-not-allowed"
                />
                <User className="pointer-events-none absolute right-3.5 top-3 size-4 text-text-muted" />
              </div>
              <span className="mt-1 block text-[11px] text-text-muted">
                Synced from authentication account
              </span>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-input border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-text opacity-90 cursor-not-allowed"
                />
                <Mail className="pointer-events-none absolute right-3.5 top-3 size-4 text-text-muted" />
              </div>
              <span className="mt-1 block text-[11px] text-text-muted">
                Verified login email
              </span>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Member Since
              </label>
              <div className="flex items-center gap-2 rounded-input border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-text">
                <Calendar className="size-4 text-primary" />
                <span>{createdAtFormatted}</span>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Authentication Status
              </label>
              <div className="flex items-center gap-2 rounded-input border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-text">
                <ShieldCheck className="size-4 text-success" />
                <span className="text-xs font-medium">Session Authenticated</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── 2. Practice & Interview Preferences ── */}
        <motion.section
          initial={enter}
          animate={shown}
          transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.1 }}
          className="rounded-card border border-border bg-surface p-6 shadow-card"
        >
          <div className="border-b border-border pb-4">
            <h2 className="text-base font-semibold text-text">Interview Preferences</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Customize your default simulation settings for technical and coding rounds.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {/* Preferred Difficulty */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Default Practice Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setPreferredDifficulty(diff)}
                    className={`flex items-center justify-center rounded-button border py-2.5 text-xs font-semibold capitalize transition-all ${
                      preferredDifficulty === diff
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary"
                        : "border-border bg-surface hover:bg-surface-elevated text-text-secondary"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle: Audio narration */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-surface-elevated">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Volume2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">AI Spoken Audio</p>
                  <p className="text-xs text-text-muted">
                    Play synthesized speech visualization cues during live questions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAudioEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  audioEnabled ? "bg-primary" : "bg-border"
                }`}
                aria-label="Toggle audio feedback"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    audioEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Spoken Transcript Display */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-surface-elevated">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Live Transcript Overlay</p>
                  <p className="text-xs text-text-muted">
                    Always render question and candidate spoken transcripts under the orb
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTranscriptEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  transcriptEnabled ? "bg-primary" : "bg-border"
                }`}
                aria-label="Toggle live transcript display"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    transcriptEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* ── 3. Account & Security ── */}
        <motion.section
          initial={enter}
          animate={shown}
          transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.15 }}
          className="rounded-card border border-border bg-surface p-6 shadow-card"
        >
          <div className="border-b border-border pb-4">
            <h2 className="text-base font-semibold text-text">Account Security</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Review your account identifiers and manage your active session.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-border p-3.5 bg-surface-elevated gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Account Identifier
                </p>
                <p className="font-mono text-xs font-medium text-text mt-0.5">
                  {userId}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="h-8 gap-1.5 text-xs text-text-secondary hover:text-text"
              >
                {copiedId ? (
                  <>
                    <Check className="size-3.5 text-success" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </Button>
            </div>

            {/* Logout Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-4 gap-3">
              <div>
                <p className="text-sm font-medium text-text">Sign Out</p>
                <p className="text-xs text-text-muted">
                  End your current practice session and return to the login screen.
                </p>
              </div>

              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                className="h-9 gap-1.5 font-medium px-4"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
