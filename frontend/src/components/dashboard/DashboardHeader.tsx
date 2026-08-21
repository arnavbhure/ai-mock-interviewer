import { useReducedMotion } from "framer-motion";
import TextType from "@/components/TextType/TextType";
import { ShinyText } from "@/components/ShinyText/ShinyText";

type DashboardHeaderProps = {
  name: string;
};

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const reduced = useReducedMotion();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingText = `${greeting}, ${name}`;

  return (
    <div className="flex flex-col gap-1">
      <ShinyText
        text="AI-powered interview practice"
        speed={4}
        className="text-[11px] font-medium uppercase tracking-[0.18em]"
      />
      {reduced ? (
        <h1 className="text-heading-2 text-text">{greetingText}</h1>
      ) : (
        <TextType
          as="h1"
          text={greetingText}
          typingSpeed={50}
          pauseDuration={2200}
          deletingSpeed={28}
          showCursor
          cursorCharacter="|"
          loop={false}
          startOnVisible
          className="text-heading-2 text-text"
        />
      )}
      <p className="text-body-lg text-text-secondary">Ready for your next interview?</p>
      <p className="text-body-sm text-text-muted">
        Continue practicing or start a new interview tailored to your target role.
      </p>
    </div>
  );
}