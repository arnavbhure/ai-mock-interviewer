import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  actionLabel,
  actionTo,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-medium text-text">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-base ease-premium hover:text-text"
        >
          {actionLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
