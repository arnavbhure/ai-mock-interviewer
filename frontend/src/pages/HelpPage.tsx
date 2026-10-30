import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  HelpCircle,
  Search,
  Mic,
  Code2,
  Award,
  Settings,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  category: "interview" | "dsa" | "audio" | "scoring";
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "q1",
    category: "interview",
    question: "How does the AI Mock Interviewer work?",
    answer:
      "InterviewAI analyzes your uploaded resume and target job role using LangGraph and LangChain. It constructs a multi-round interview plan tailored specifically to your experience, asks conceptual and architectural questions via real-time speech, and conducts an integrated DSA live coding challenge.",
  },
  {
    id: "q2",
    category: "audio",
    question: "How do voice questions and speech recognition work?",
    answer:
      "The interviewer streams spoken questions in real-time. You can answer either by voice using the microphone (powered by Web Speech API) or switch to text mode to type your answer. Ensure you grant microphone permissions in Chrome, Edge, or Firefox.",
  },
  {
    id: "q3",
    category: "dsa",
    question: "What programming languages are supported in the DSA round?",
    answer:
      "We support C++ (GCC 15), Python (3.14), JavaScript (Node.js 24), and Java (OpenJDK 25). Each language comes with standard boilerplate templates. You can execute code against sample test cases using 'Run Code' or press Ctrl+Enter.",
  },
  {
    id: "q4",
    category: "dsa",
    question: "How does code submission and testing work?",
    answer:
      "When you click 'Submit Solution', your code is executed against a suite of hidden test cases in an isolated sandbox. Your algorithmic correctness, time complexity, and space complexity are calculated and factored into your final scorecard.",
  },
  {
    id: "q5",
    category: "scoring",
    question: "How are hiring recommendations calculated?",
    answer:
      "Evaluations use a 4-tier rubric: Strong Hire (8.5–10), Hire (7.0–8.4), Weak Hire (5.0–6.9), and No Hire (<5.0). Scores are computed by combining algorithmic optimality, conceptual depth, trade-off analysis, and communication clarity.",
  },
  {
    id: "q6",
    category: "audio",
    question: "What should I do if the AI voice audio is not playing?",
    answer:
      "Make sure your browser's audio permissions are enabled. You can click the 'Replay Question' audio button on the question card at any time. If using Bluetooth headphones, verify your default output device in your system settings.",
  },
  {
    id: "q7",
    category: "interview",
    question: "Can I skip a problem if I am stuck?",
    answer:
      "Yes! In the DSA coding round, you can click the 'Skip' button. The interviewer will log a partial attempt and advance you to the next question or interview round without freezing the session.",
  },
];

export function HelpPage() {
  const reduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("q1");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "interview", label: "Interview Flow", icon: Zap },
    { id: "dsa", label: "DSA & Code Editor", icon: Code2 },
    { id: "audio", label: "Voice & Speech", icon: Mic },
    { id: "scoring", label: "Scoring & Rubrics", icon: Award },
  ];

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 text-text">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[11px] font-semibold text-primary mb-2">
            <HelpCircle className="size-3" />
            <span>KNOWLEDGE BASE & GUIDES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">
            Help & Documentation
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Find answers on interview structure, coding test cases, speech settings, and scoring criteria.
          </p>
        </div>

        <Button asChild className="gap-2 shrink-0">
          <Link to="/dashboard/new">
            Start Practicing
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* ── Search Bar ── */}
      <div className="mt-8 relative max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions, keywords, or error messages..."
          className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-text placeholder:text-text-muted shadow-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all",
                isActive
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text",
              )}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── FAQ Accordion Section ── */}
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease }}
        className="mt-8 space-y-3"
      >
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-hover"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-text"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-text-muted transition-transform duration-200",
                      isExpanded && "rotate-180 text-primary",
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border/60 bg-background-secondary/20 px-5 py-4 text-xs leading-relaxed text-text-secondary">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface/50 p-10 text-center text-xs text-text-muted">
            No help topics match your search query. Try another keyword.
          </div>
        )}
      </motion.div>

      {/* ── Quick Tips Card ── */}
      <div className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.04] p-6 shadow-card">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary">
          <Zap className="size-4" />
          <h3>Pro Tips for Real-Time Practice</h3>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs leading-relaxed text-text">
          <div className="rounded-lg border border-primary/10 bg-surface p-4">
            <span className="font-semibold text-text block mb-1">Use Clear Architecture</span>
            <p className="text-text-secondary">
              When answering technical questions, state your assumptions, outline trade-offs, and describe edge cases.
            </p>
          </div>
          <div className="rounded-lg border border-primary/10 bg-surface p-4">
            <span className="font-semibold text-text block mb-1">Test with Edge Cases</span>
            <p className="text-text-secondary">
              Before clicking submit in the DSA round, consider zero elements, negative values, and large inputs.
            </p>
          </div>
          <div className="rounded-lg border border-primary/10 bg-surface p-4">
            <span className="font-semibold text-text block mb-1">Review Detailed Reports</span>
            <p className="text-text-secondary">
              Check the scorecard on the Reports page after each session to study specific model feedback and areas to refine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

