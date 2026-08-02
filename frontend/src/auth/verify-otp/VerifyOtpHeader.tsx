import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoMark from "@/assets/Logo.png";
import {
  VERIFY_OTP_DESCRIPTION,
  VERIFY_OTP_HEADLINE,
} from "@/constants/auth.constants";

type VerifyOtpHeaderProps = {
  email: string;
};

export function VerifyOtpHeader({ email }: VerifyOtpHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to="/"
        aria-label="InterviewAI home"
        className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img alt="InterviewAI logo" className="h-12 w-auto object-contain" src={logoMark} />
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
        {VERIFY_OTP_HEADLINE}
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {VERIFY_OTP_DESCRIPTION}{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>
    </motion.div>
  );
}

