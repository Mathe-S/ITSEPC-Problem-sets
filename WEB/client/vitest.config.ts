import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.spec.ts"],
    include: ["**/*.test.ts"],
  },
});
