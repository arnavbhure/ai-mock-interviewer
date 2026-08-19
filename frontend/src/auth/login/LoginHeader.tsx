import { motion } from "framer-motion";
import { LOGIN_DESCRIPTION, LOGIN_HEADLINE } from "@/constants/auth.constants";

export function LoginHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
        {LOGIN_HEADLINE}
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {LOGIN_DESCRIPTION}
      </p>
    </motion.div>
  );
}
