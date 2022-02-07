import type { DefaultTheme } from '@/config'

// 侧边栏
export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/': [
    {
      text: '基础',
      children: [
        { text: '事件循环', link: '/basic/eventLoop' },
        { text: '浏览器的进程与线程', link: '/basic/browserProcessAndThread' },
      ]
    },
    {
      text: '工程化',
      children: [
        { text: '介绍', link: '/engineering/' },
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
