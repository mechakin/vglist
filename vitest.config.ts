import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    setupFiles: ["tests/trpc/__mocks__/clerk-client.ts"],
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});
