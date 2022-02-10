import type { DefaultTheme } from '@/config'

// 侧边栏
export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/': [
    {
      text: '基础',
      children: [
        { text: '事件循环', link: '/basic/eventLoop' },
        { text: '浏览器的进程与线程', link: '/basic/browserProcessAndThread' },
        { text: '简述 JS 异步发展不同阶段', link: '/basic/asyncHistory' },
        { text: 'ES6 - Generator', link: '/basic/generator' },
        { text: 'ES6 - Proxy', link: '/basic/proxy' },
        { text: 'ES6 - Reflect', link: '/basic/reflect' },
        { text: 'JS 位运算', link: '/basic/bitOperation' },
        { text: 'JS 正则表达式', link: '/basic/regularExpression' },
        { text: 'Object 常见 Api', link: '/basic/objectApi' },
        { text: '遍历对象属性常用方法', link: '/basic/traverseObjectProperty' },
        { text: '转化为数字类型的常用方法', link: '/basic/convert2Number' },
      ]
    },
    {
      text: '工程化',
      children: [
        { text: '如何统一代码规范', link: '/engineering/codeLintAndFormat' },
      ],
    },
    {
      text: 'TypeScript',
      children: [
        { text: '基础', link: '/tsLearn/' },
      ],
    },
    {
      text: 'Vue',
      children: [
        { text: '深入理解响应式', link: '/vueLearn/reactive' },
        { text: '深入 render-mount-patch 流程', link: '/vueLearn/render_h_mount_patch' },
        { text: '深入异步更新', link: '/vueLearn/async_update' },
      ],
    },
  ],
}
