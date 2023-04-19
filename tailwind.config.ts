import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
      screens: {
        xs: "500px",
        xxs: "400px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
} satisfies Config;
