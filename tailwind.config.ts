import type { Config } from "tailwindcss";

const helveticaStack = [
  '"Helvetica Neue"',
  "Helvetica",
  '"Inter"',
  '"Segoe UI"',
  "Arial",
  "sans-serif",
];

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#101010",
        card: "#141414",
        gold: {
          DEFAULT: "#C9A84C",
          bright: "#E8C875",
          dim: "rgba(201, 168, 76, 0.18)",
          hover: "rgba(201, 168, 76, 0.5)",
        },
        ink: {
          DEFAULT: "#ECEAE4",
          muted: "#8A8A82",
        },
      },
      fontFamily: {
        sans: helveticaStack,
        // Kept aliased to Helvetica Neue so existing `font-serif` usages
        // render with the requested investment-style typography.
        serif: helveticaStack,
        mono: helveticaStack,
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(201, 168, 76, 0.22), 0 8px 32px -12px rgba(201, 168, 76, 0.32)",
        flagship:
          "0 0 0 1px rgba(232, 200, 117, 0.4), 0 12px 40px -14px rgba(232, 200, 117, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
