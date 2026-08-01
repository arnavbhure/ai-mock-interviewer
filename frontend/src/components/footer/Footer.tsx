import { motion, useReducedMotion } from "framer-motion";
import { FooterBottom } from "@/components/footer/FooterBottom";
import { FooterBrand } from "@/components/footer/FooterBrand";
import { FooterLinks } from "@/components/footer/FooterLinks";

const PRODUCT_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Roadmap", href: "/#roadmap" },
];

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/docs" },
  { label: "Interview Tips", href: "/tips" },
  { label: "Community", href: "/community" },
  { label: "Support", href: "/support" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.footer
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border bg-secondary/40 text-foreground"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="md:col-span-2 lg:col-span-2">
            <FooterBrand />
          </div>

          <FooterLinks title="Product" links={PRODUCT_LINKS} />
          <FooterLinks title="Resources" links={RESOURCE_LINKS} />
          <FooterLinks title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-12">
          <FooterBottom />
        </div>
      </div>
    </motion.footer>
  );
}
