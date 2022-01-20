import { HeadConfig } from 'vitepress'
import { metaData } from './constants'

// vite-press 文档暂时不全, 这里可以参考 vue-press 文档：https://vuepress.vuejs.org/zh/config/#head
// 类比: html 中的 head 标签, 会插入到每个页面中
const head: HeadConfig[] = [
  ['meta', { name: 'author', content: 'Xzq' }],
  // 设置别人搜索的关键字(网站的关键字)
  ['meta', { name: 'keywords', content: '学习笔记, notes, 个人技术博客, javascript, js, es, css, tailwindcss, vitejs, vite, vue, vue3' }],
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }],

  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#0ea5e9' }],

  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:site', content: metaData.site }],
  ['meta', { name: 'twitter:title', value: metaData.title }],
  ['meta', { name: 'twitter:description', value: metaData.description }],
  ['meta', { name: 'twitter:image', content: metaData.image }],

  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'zh-CN' }],
  ['meta', { property: 'og:site', content: metaData.site }],
  ['meta', { property: 'og:site_name', content: metaData.title }],
  ['meta', { property: 'og:title', content: metaData.title }],
  ['meta', { property: 'og:image', content: metaData.image }],
  ['meta', { property: 'og:description', content: metaData.description }],

  ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
  ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@200;400;500;600&display=swap', rel: 'stylesheet' }],
]

export default head
