import type { DefaultTheme } from '@/config'

// 头部
export const nav: DefaultTheme.Config['nav'] = [
  {
    text: 'Guide',
    items: [
      { text: '基础', link: '/basic/eventLoop' },
      { text: '工程化', link: '/engineering/' },
      { text: 'TypeScript', link: '/tsLearn/' },
      { text: 'Vue', link: '/vueLearn/reactive' }
    ],
  },
  // 拆分栏目, 将文档划分到不同栏目中
  // {
  //   text: 'Plugins',
  //   items: [
  //     { text: 'Plugin Interfaces', link: '/plugins/interfaces' },
  //     { text: 'Transform API', link: '/plugins/transform' },
  //     这里重写的样式, separator 现在代表 分割线 (DropdownLink.vue, TreeLink.vue)
  //     { text: 'separator', link: 'separator' },
  //   ],
  // },
  // {
  //   text: 'Community',
  //   items: [
  //     { text: 'Discord', link: 'https://chat.windicss.org' },
  //   ],
  // },
]
