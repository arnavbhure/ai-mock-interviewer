import { motion, type Variants } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";

const dots: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.18,
      repeat: Infinity,
    },
  },
};

const dot: Variants = {
  initial: {
    y: 0,
    opacity: 0.4,
  },
  animate: {
    y: [-2, -10, -2],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function LoadingPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-full border border-primary/20"
          />

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-white shadow-xl"
          >
            <BrainCircuit className="h-10 w-10 text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-2xl font-bold text-foreground"
        >
          Preparing your workspace
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.35 }}
          className="mt-2 max-w-sm text-center text-muted-foreground"
        >
          Verifying your session and setting up your InterviewAI dashboard.
        </motion.p>

        {/* Loading Dots */}

        <motion.div
          variants={dots}
          animate="animate"
          className="mt-8 flex gap-2"
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={dot}
              className="h-3 w-3 rounded-full bg-primary"
            />
          ))}
        </motion.div>

        {/* AI Badge */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-8 flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            AI initializing...
          </span>
        </motion.div>
      </div>
    </div>
  );
}
