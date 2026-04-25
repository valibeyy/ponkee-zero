import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          primary: "#E53935",
          ink: "#0a0a0a",
          paper: "#ffffff",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 10, 10, 0.06)",
        card: "0 22px 60px -34px rgba(10, 10, 10, 0.22), 0 10px 28px -18px rgba(10, 10, 10, 0.10)",
        glow: "0 0 0 1px rgba(229, 57, 53, 0.14), 0 26px 70px -28px rgba(229, 57, 53, 0.22)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(900px 420px at 12% -10%, rgba(229,57,53,0.16), transparent 55%), radial-gradient(700px 380px at 92% 0%, rgba(10,10,10,0.10), transparent 52%), radial-gradient(520px 320px at 50% 110%, rgba(10,10,10,0.04), transparent 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
