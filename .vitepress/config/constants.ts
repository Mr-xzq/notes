const isProd = process.env.NODE_ENV === 'production'

// FIXME 部署之后设置自己的网址
const site = isProd ? 'https://windicss.org' : 'http://localhost:3000'

export const metaData = {
  title: 'xzq notes',
  description: 'xzq personal study summary notes.',
  site,
  // FIXME 图片记得也要换
  image: `${site}/assets/og-image.png`,
}
