import { FinalCTAContent } from "@/components/final-cta/FinalCTAContent";

export function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden border-t border-border bg-background py-28 text-foreground sm:py-32 lg:py-[140px]"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <FinalCTAContent />
      </div>
    </section>
  );
}
