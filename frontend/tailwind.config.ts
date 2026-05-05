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
        paper: "#F6F1E9",
        card: "#FDFAF5",
        "card-hover": "#EDE8DF",
        ink: "#2A2825",
        muted: "#7A7268",
        accent: "#7A9E7E",
        "accent-hover": "#5E8262",
      }
    }
  },
  plugins: []
};

export default config;
