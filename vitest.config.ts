import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  test: {
    // https://docs.astro.build/en/guides/imports/#aliases
    // alias: [
    //   {
    //     find: "@",
    //     replacement: fileURLToPath(new URL("./src", import.meta.url)),
    //   },
    //   {
    //     find: "scripts",
    //     replacement: fileURLToPath(new URL("./scripts", import.meta.url)),
    //   },
    // ],
    include: ["test/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
