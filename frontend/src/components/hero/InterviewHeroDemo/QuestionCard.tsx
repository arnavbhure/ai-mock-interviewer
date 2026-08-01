import { MessageSquareText } from "lucide-react";

type QuestionCardProps = {
  question: string;
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="rounded-[26px] border border-border/70 bg-secondary/60 p-5 shadow-card">
      <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-primary">
        <MessageSquareText size={14} strokeWidth={1.75} />
        Technical Round
      </div>
      <p className="mt-4 text-lg leading-8 text-foreground">{question}</p>
    </div>
  );
}
