import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 900: "#0b0b0c", 700: "#13151a", 500: "#1f2430" } }
    }
  },
  plugins: []
} satisfies Config;
