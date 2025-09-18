import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reports: ["text", "html", "lcov"],
    },
    include: [
      "src/tests/**/*.test.ts",
      "src/tests/**/*.test.tsx",
      "src/tests/**/*.spec.ts",
      "src/tests/**/*.spec.tsx",
    ],
  },
});
