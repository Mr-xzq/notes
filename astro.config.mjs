import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";

// https://astro.build/config
export default defineConfig({
  base: process.env.DEPLOY_BASE ?? '/',
  integrations: [
    starlight({
      plugins: [starlightImageZoom()],
      title: "Xzq Notes",
      social: {
        github: "https://github.com/Mr-xzq/notes",
      },
      logo: {
        // src: "./src/assets/hero-logo.svg",
        src: "/public/logo.svg",
      },
      favicon: "/logo.svg",
      sidebar: [
        {
          label: "基础",
          items: [
            { label: "事件循环", slug: "basic/event-loop" },
            {
              label: "浏览器的进程与线程",
              slug: "basic/browser-process-and-thread",
            },
            { label: "简述 JS 异步发展不同阶段", slug: "basic/async-history" },
            { label: "ES6 - Generator", slug: "basic/generator" },
            { label: "ES6 - Proxy", slug: "basic/proxy" },
            { label: "ES6 - Reflect", slug: "basic/reflect" },
            { label: "JS 位运算", slug: "basic/bit-operation" },
            { label: "JS 正则表达式", slug: "basic/regular-expression" },
            { label: "Object 常见 Api", slug: "basic/object-api" },
            {
              label: "遍历对象属性常用方法",
              slug: "basic/traverse-object-property",
            },
            {
              label: "转化为数字类型的常用方法",
              slug: "basic/convert2-number",
            },
            { label: "原型链", slug: "basic/prototype-chain" },
            { label: "继承", slug: "basic/inherit" },
            {
              label: "作用域(链),执行期上下文(栈),变量提升,闭包",
              slug: "basic/scope-chain",
            },
            { label: "深入 this", slug: "basic/this" },
            { label: "运算符优先级", slug: "basic/operator-priority" },
          ],
        },
        {
          label: "工程化",
          items: [
            {
              label: "如何统一代码规范",
              slug: "engineering/code-lint-and-format",
            },
          ],
        },
        {
          label: "TypeScript",
          items: [
            {
              label: "基础",
              slug: "ts-learn/basic",
            },
          ],
        },
        {
          label: "Vue",
          items: [
            { label: "深入理解响应式", slug: "vue-learn/reactive" },
            {
              label: "深入 render-mount-patch 流程",
              slug: "vue-learn/render-h-mount-patch",
            },
            { label: "深入异步更新", slug: "vue-learn/async-update" },
          ],
        },
      ],
      lastUpdated: true,
      editLink: {
        baseUrl: "https://github.com/Mr-xzq/notes/edit/master/docs/",
      },
      pagination: true,
    }),
  ],
});
