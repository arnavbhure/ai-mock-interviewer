import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoMark from "@/public/Logo.png";
import { LOGIN_DESCRIPTION, LOGIN_HEADLINE } from "@/constants/auth.constants";

export function LoginHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/" aria-label="InterviewAI home" className="inline-flex items-center mb-8">
        <img
          alt="InterviewAI logo"
          src={logoMark}
          className="h-10 w-auto object-contain"
        />
      </Link>
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text sm:text-3xl">
        {LOGIN_HEADLINE}
      </h1>
      <p className="mt-3 text-base leading-7 text-text-secondary">
        {LOGIN_DESCRIPTION}
      </p>
    </motion.div>
  );
}
