import type { Config } from "tailwindcss";

// Semantic colors are driven by CSS variables defined in app/globals.css, so a
// single class set works in both light and dark mode. Values use the
// `rgb(var(--x) / <alpha-value>)` form so opacity modifiers (e.g. bg-brand/10)
// keep working.
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("--canvas"),
        surface: token("--surface"),
        elevated: token("--elevated"),
        foreground: token("--foreground"),
        muted: token("--muted"),
        faint: token("--faint"),
        line: token("--line"),
        brand: {
          DEFAULT: token("--brand"),
          dark: token("--brand-dark"),
          fg: token("--brand-fg"),
        },
        success: token("--success"),
        danger: token("--danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 4px 12px -2px rgb(15 23 42 / 0.10), 0 2px 6px -2px rgb(15 23 42 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
