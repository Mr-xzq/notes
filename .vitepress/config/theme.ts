import type { DefaultTheme } from '@/config'
import { sidebar } from './sidebar'
import { nav } from './nav'

const themeConfig: DefaultTheme.Config = {
  // algolia: {
  //   appId: 'RYAT0G9BU3',
  //   apiKey: 'c0dfcf1e50c42717f0d536ac6fd11d78',
  //   indexName: 'windicss-next',
  // },
  // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
  repo: 'Mr-xzq/notes',
  // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
  // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
  repoLabel: 'GitHub',
  logo: '/assets/logo.svg',
  // 假如文档不是放在仓库的根目录下
  docsDir: '.',
  // 假如文档放在一个特定的分支下
  docsBranch: 'master',
  // 假如你的文档仓库和项目本身不在一个仓库
  docsRepo: 'Mr-xzq/notes',
  editLinks: true,
  // 默认为 "Edit this page"
  editLinkText: 'Edit this page',
  nav,
  sidebar,
  lastUpdated: 'Last Updated'
}

export default themeConfig
