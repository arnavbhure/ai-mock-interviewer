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

