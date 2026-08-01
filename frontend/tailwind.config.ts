import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
      borderRadius: {
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        modal: "var(--radius-modal)",
        badge: "var(--radius-badge)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        modal: "var(--shadow-modal)",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(.16,1,.3,1)",
      },
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "500": "500ms",
        fast: "150ms",
        DEFAULT: "250ms",
        slow: "500ms",
      },
    },
  },
} satisfies Config;
