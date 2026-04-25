import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
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
          primary: "#3b82f6",
          accent: "#0d9488",
          ink: "#0f172a",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06)",
        card: "0 18px 50px -28px rgba(15, 23, 42, 0.18), 0 8px 24px -18px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 1px rgba(59, 130, 246, 0.12), 0 20px 60px -24px rgba(59, 130, 246, 0.25)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(900px 420px at 12% -10%, rgba(59,130,246,0.14), transparent 55%), radial-gradient(700px 380px at 92% 0%, rgba(13,148,136,0.12), transparent 50%), radial-gradient(520px 320px at 50% 110%, rgba(15,23,42,0.04), transparent 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
