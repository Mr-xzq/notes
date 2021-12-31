import type { DefaultTheme } from '@/config'

// 侧边栏
export const sidebar: DefaultTheme.Config['sidebar'] = {
  // 拆分栏目
  // '/plugins': [
  //   {
  //     text: 'Base',
  //     children: [
  //       { text: 'Plugin Interfaces', link: '/plugins/interfaces' },
  //     ],
  //   },
  //   {
  //     text: 'Official',
  //     children: [
  //       { text: 'Aspect Ratio', link: '/plugins/official/aspect-ratio' },
  //     ],
  //   },
  //   {
  //     text: 'Community',
  //     children: [
  //       { text: 'Animations', link: '/plugins/community/animations' },
  //     ],
  //   },
  // ],
  '/': [
    {
      text: '工程化',
      children: [
        { text: '介绍', link: '/engineering/' },
        { text: '代码规范', link: '/engineering/codeLintAndFormat' },
      ],
    },
    {
      text: 'TypeScript',
      children: [
        { text: '基础', link: '/tsLearn/' },
      ],
    },
  ],
}
