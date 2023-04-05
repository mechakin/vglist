import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
} satisfies Config;
