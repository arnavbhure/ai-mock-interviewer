import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  "aria-describedby"?: string;
};

/**
 * Six individual numeric boxes.
 * - Auto-advances after typing a digit.
 * - Backspace moves to the previous box when the current one is empty.
 * - Paste distributes a full six-digit code.
 * - Accepts digits only.
 */
export function OtpInput({
  value,
  onChange,
  invalid = false,
  disabled = false,
  "aria-describedby": ariaDescribedBy,
}: OtpInputProps) {
  const reducedMotion = useReducedMotion();
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (value.length === OTP_LENGTH) {
      refs.current[OTP_LENGTH - 1]?.focus();
    }
  }, [value]);

  const setInputRef = useCallback((index: number) => (node: HTMLInputElement | null) => {
    refs.current[index] = node;
  }, []);

  const focusIndex = (index: number) => {
    const target = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    refs.current[target]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) {
      return;
    }

    const digits = value.split("");
    digits[index] = digit;
    const nextValue = digits.join("");

    onChange(nextValue);

    if (nextValue.length === OTP_LENGTH) {
      refs.current[OTP_LENGTH - 1]?.focus();
    } else {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const digits = value.split("");
      if (digits[index]) {
        digits[index] = "";
        onChange(digits.join(""));
      } else {
        focusIndex(index - 1);
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    onChange(pasted);

    const targetIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    refs.current[targetIndex]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {Array.from({ length: OTP_LENGTH }, (_, index) => {
        const digit = value[index] ?? "";

        return (
          <motion.input
            key={index}
            ref={setInputRef(index)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            aria-invalid={invalid || undefined}
            aria-describedby={ariaDescribedBy}
            value={digit}
            disabled={disabled}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            whileFocus={reducedMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "h-14 w-full rounded-input border bg-card text-center font-mono text-xl font-semibold text-foreground shadow-none transition-colors duration-250 ease-premium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-2xl",
              invalid
                ? "border-destructive/70 focus-visible:ring-destructive/60"
                : "border-input hover:border-[var(--border-hover)]",
            )}
          />
        );
      })}
    </div>
  );
}

