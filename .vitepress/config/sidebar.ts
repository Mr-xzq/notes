import type { DefaultTheme } from '@/config'

// 侧边栏
export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/': [
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
        { text: '深入 Vue 响应式', link: '/vueLearn/reactive' },
      ],
    },
  ],
}
