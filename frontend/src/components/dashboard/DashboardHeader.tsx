import { useReducedMotion } from "framer-motion";
import TextType from "@/components/TextType/TextType";
import { ShinyText } from "@/components/ShinyText/ShinyText";
import { TextLoop } from "@/components/TextLoop/TextLoop";

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
    <header className="flex flex-col">
      <ShinyText
        text="AI-powered interview practice"
        speed={5}
        disabled={Boolean(reduced)}
        className="text-[11px] font-medium tracking-[0.16em] uppercase"
      />
      {reduced ? (
        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-text sm:text-[2rem]">
          {greetingText}
        </h1>
      ) : (
        <TextType
          as="h1"
          text={greetingText}
          typingSpeed={48}
          pauseDuration={2200}
          deletingSpeed={28}
          showCursor
          cursorCharacter="|"
          loop={false}
          startOnVisible
          className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-text sm:text-[2rem]"
        />
      )}
      <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
        Review how you are performing, then start your next session.
      </p>
      <TextLoop
        text="Interview practice  ·  Technical skills  ·  Communication  ·  Confidence"
        shape="linear"
        speed={40}
        fontSize={12}
        fontWeight={500}
        letterSpacing={0.4}
        uppercase={false}
        pauseOnHover
        className="mt-8 opacity-50"
      />
    </header>
  );
}
