import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

type FooterLinksProps = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export function FooterLinks({ title, links }: FooterLinksProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <motion.div whileHover={reducedMotion ? undefined : { x: 2 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <Link
                to={link.href}
                className="inline-flex text-sm text-muted-foreground transition-colors duration-250 ease-premium hover:text-foreground"
              >
                {link.label}
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}
