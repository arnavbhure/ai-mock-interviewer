import { NAVBAR_SCROLL_OFFSET } from "@/components/navigation/navbar.constants";

/**
 * Smoothly scrolls to a page section, offset to account for the fixed navbar.
 * Respects the user's reduced-motion preference.
 * Returns `false` when the section does not exist on the current page.
 */
export function scrollToSection(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: hasReducedMotion ? "auto" : "smooth",
  });

  return true;
}