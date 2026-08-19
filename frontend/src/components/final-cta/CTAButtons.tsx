import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTAButtons() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      <Link
        to="/register"
        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-[background-color,box-shadow] duration-200 ease-premium hover:bg-primary-bright hover:shadow-[0_2px_10px_rgba(77,130,255,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>Start Interview</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </Link>
    </div>
  );
}
