import { FaGithub, FaLinkedinIn, FaTwitter,  FaInstagram } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/arnavbhure", icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/arnavbhure", icon: FaLinkedinIn },
  { label: "Twitter / X", href: "https://x.com/arnavbhure", icon: FaTwitter },
  { label: "Instagram", href: "https://instagram.com/_arnavbhure_", icon: FaInstagram },
];

export function FooterSocial() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map((item) => {
        const Icon = item.icon;

        return (
          <motion.a
            key={item.label}
            whileHover={reducedMotion ? undefined : { y: -1, scale: 1.04, rotate: -3 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            href={item.href}
            aria-label={item.label}
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-250 ease-premium hover:border-border-hover hover:text-foreground",
              )}
            >
              <Icon size={16} />
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}
