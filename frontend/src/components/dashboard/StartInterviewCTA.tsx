import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StartInterviewCTAProps {
  isValid: boolean;
  isSubmitting: boolean;
}

export function StartInterviewCTA({ isValid, isSubmitting }: StartInterviewCTAProps) {
  const enabled = isValid && !isSubmitting;

  return (
    <Button
      type="submit"
      size="lg"
      disabled={!enabled}
      className={cn(
        "group w-full sm:w-auto",
        enabled &&
          "bg-primary text-primary-foreground hover:bg-primary-bright hover:shadow-[0_4px_12px_rgba(79,70,229,0.28)]",
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Preparing Interview...
        </>
      ) : (
        <>
          Start Interview
          <ArrowRight
            className="h-4 w-4 transition-transform duration-base ease-premium group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </Button>
  );
}
