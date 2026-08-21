import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type FeaturePlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeaturePlaceholderPage({ title, description, icon: Icon }: FeaturePlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 py-12 sm:px-6 lg:px-10">
      <div className="max-w-md">
        <span className="flex size-10 items-center justify-center text-text-muted">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-text">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/dashboard/new">
              Start a new interview
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}