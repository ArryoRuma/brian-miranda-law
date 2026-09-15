import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Keep nested working copies from running their tests against this checkout.
    include: ["tests/**/*.test.ts"],
  },
});
