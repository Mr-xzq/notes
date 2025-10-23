/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
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
      provider: "v8",
      // https://cn.vitest.dev/config/#coverage-include
      include: ["scripts/**/*.?(c|m)[jt]s"],
    },
  },
});
