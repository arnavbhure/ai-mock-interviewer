export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Login", href: "/login", active: true },
  { label: "Sign Up", href: "/register" },
];

export type MarketingNavLink = {
  label: string;
  id: string;
};

/**
 * Center navigation links for the marketing site.
 * The ids mirror the section ids already rendered on the `/` page.
 */
export const MARKETING_NAV_LINKS: MarketingNavLink[] = [
  { label: "Product", id: "interview-modes" },
  { label: "How It Works", id: "interview-experience" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

/** Extra vertical offset applied when smooth-scrolling so the fixed navbar never covers a section. */
export const NAVBAR_SCROLL_OFFSET = 88;

