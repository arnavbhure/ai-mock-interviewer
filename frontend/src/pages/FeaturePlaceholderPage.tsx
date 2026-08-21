import type { LucideIcon } from "lucide-react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type FeaturePlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeaturePlaceholderPage({ title, description, icon: Icon }: FeaturePlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-10 text-center shadow-card">
        <span className="mx-auto flex size-12 items-center justify-center rounded-large bg-primary/10">
          <Icon className="size-6 text-primary" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-text">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/dashboard/new">
              <Play className="size-4 fill-current" aria-hidden="true" />
              Start a new interview
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}