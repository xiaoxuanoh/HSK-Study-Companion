import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",
        ink: "#1C1C1E",
        muted: "#6B7280",
        accent: "#3E5879"
      }
    }
  },
  plugins: []
};

export default config;
