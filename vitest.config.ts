import { defineConfig } from "vitest/config";

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
    coverage: {
      // https://cn.vitest.dev/config/#coverage-include
      include: ["scripts/**/*.?(c|m)[jt]s"],
    },
  },
});
