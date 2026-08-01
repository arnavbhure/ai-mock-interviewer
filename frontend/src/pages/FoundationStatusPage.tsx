import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PremiumNavbar } from "@/components/navigation/PremiumNavbar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    eyebrow: "Resume-aware",
    title: "Personalized from the first click",
    description:
      "Every interview starts from the candidate's resume, projects, and role intent so the experience feels specific instead of scripted.",
  },
  {
    eyebrow: "Adaptive",
    title: "Questioning that responds to performance",
    description:
      "The system adjusts follow-ups, difficulty, and evaluation depth based on answer quality and interview state.",
  },
  {
    eyebrow: "Premium UX",
    title: "Calm, focused, and accessible",
    description:
      "A refined interaction model keeps attention on interview flow while staying responsive, keyboard friendly, and theme aware.",
  },
];

const steps = [
  "Upload a resume and extract a structured candidate profile.",
  "Generate a tailored interview plan from role, experience, and difficulty.",
  "Conduct one question at a time with realistic follow-ups.",
  "Review a scored report with strengths, weaknesses, and a plan to improve.",
];

const faqItems = [
  {
    question: "Why does the navbar change shape on scroll?",
    answer:
      "The transition reinforces context: transparent and editorial at the top, then a floating navigation shell once the page starts moving.",
  },
  {
    question: "Does the mobile menu trap focus?",
    answer:
      "Yes. The sheet is built with Radix Dialog so it is keyboard navigable, focus trapped, and dismissible with Escape.",
  },
  {
    question: "Will it respect reduced motion settings?",
    answer:
      "Yes. Motion intensity is reduced when prefers-reduced-motion is active, while the layout and semantics remain intact.",
  },
];

export function FoundationStatusPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-250 ease-premium">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[18rem] h-[28rem] w-[28rem] rounded-full bg-info/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div id="top">
        <PremiumNavbar />
      </div>

      <section className="relative mx-auto grid w-full max-w-[1280px] gap-16 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center"
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles size={16} strokeWidth={1.75} className="text-primary" />
            Premium interview preparation for serious candidates
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.5rem]">
            Practice real technical interviews with an experience that feels handcrafted.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            InterviewAI turns a resume into a tailored mock interview, then guides the candidate
            through project discussion, technical depth, and behavioral evaluation with calm,
            high-signal motion.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <Button asChild className="h-12 gap-2 px-5 text-sm font-medium shadow-none">
                <a href="#demo">
                  Start Free Interview
                  <ArrowRight size={16} strokeWidth={1.75} />
                </a>
              </Button>
            </motion.div>

            <Button asChild variant="secondary" className="h-12 px-5 text-sm font-medium">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Resume-aware", "Questions adapt to the candidate's actual background."],
              ["Adaptive flow", "One question at a time with realistic follow-ups."],
              ["Actionable report", "Scores, weaknesses, and improvement guidance."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[18px] border border-border/70 bg-card/80 p-4 shadow-card backdrop-blur">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="flex items-center"
        >
          <div className="w-full rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-card backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Live interview shell
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Technical Round</h2>
              </div>

              <div className="rounded-full border border-border/70 bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                Question 7 of 25
              </div>
            </div>

            <div className="space-y-4 py-5">
              <div className="rounded-[22px] border border-border/70 bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Current prompt
                </p>
                <p className="mt-3 text-lg font-medium leading-8 text-foreground">
                  Explain how you would implement refresh token rotation in a production auth
                  flow.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-border/70 bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Timer
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">18:34</p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Round status
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">Focused</p>
                </div>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Evaluation signals
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Technical", "8.7"],
                    ["Depth", "7.9"],
                    ["Communication", "8.2"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[18px] border border-border/70 bg-card p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-5 text-sm text-muted-foreground">
              <span>Premium motion, accessible controls, and clear state.</span>
              <span>Designed for focused practice.</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Features</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            A navigation system should feel like part of the product, not a separate widget.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="rounded-[24px] border border-border/70 bg-card/90 p-6 shadow-card backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {card.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">{card.title}</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              A clean flow from resume upload to a useful post-interview report.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[22px] border border-border/70 bg-card/85 p-5 shadow-card backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Step {index + 1}
                  </p>
                </div>
                <p className="mt-4 text-base leading-7 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="rounded-[32px] border border-border/70 bg-gradient-to-br from-card via-card to-secondary/40 p-6 shadow-modal sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Demo</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                A premium interface for real interview practice, not a chat toy.
              </h2>
            </div>

            <Button asChild variant="secondary" className="h-12 px-5 text-sm font-medium">
              <a href="#pricing">Explore pricing</a>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              ["Resume discussion", "Dig into real project decisions, tradeoffs, and architecture."],
              ["Technical round", "Adapt the depth of questions to skill level and role."],
              ["Evaluation", "Convert each answer into scores and actionable feedback."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[24px] border border-border/70 bg-background/80 p-5 backdrop-blur">
                <div className="mb-8 flex items-center gap-2 text-primary">
                  <PlayCircle size={18} strokeWidth={1.75} />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em]">Live module</span>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Pricing</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Keep the first experience generous, focused, and easy to start.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            ["Starter", "Free", "1 interview, basic report, and theme-aware landing access."],
            ["Pro", "Coming soon", "Unlimited practice, advanced reports, and interview history."],
            ["Team", "Contact", "Multi-user workflow for placement cells and bootcamps."],
          ].map(([title, price, description]) => (
            <div key={title} className="rounded-[24px] border border-border/70 bg-card/85 p-6 shadow-card backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-[-0.03em] text-foreground">{price}</span>
              </div>
              <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Clear answers for the details that matter.
          </h2>
        </div>

        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <details key={item.question} className="group rounded-[24px] border border-border/70 bg-card/85 p-6 shadow-card backdrop-blur">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-foreground outline-none transition-colors duration-250 ease-premium marker:hidden group-open:text-primary">
                <span>{item.question}</span>
                <CheckCircle2 aria-hidden="true" className="shrink-0 text-primary transition-transform duration-250 ease-premium group-open:rotate-180" size={18} strokeWidth={1.75} />
              </summary>
              <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-[1280px] px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>InterviewAI is built to feel focused, premium, and calm.</p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span>Practice • Prepare • Perform</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
