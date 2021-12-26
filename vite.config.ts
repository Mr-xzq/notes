import { resolve } from 'path'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import ViteRestart from 'vite-plugin-restart'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, '.vitepress/theme')}/`,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          windicss: ['windicss'],
        },
      },
    },
  },
  server: {
    proxy: {},
  },
  plugins: [
    Components({
      dirs: [
        '.vitepress/theme/components',
      ],
      extensions: ['vue', 'ts'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        // {prefix}-{collection}-{icon}
        // 自动导入的 icon 的前缀, 如果不设置, 则是  i, 那么在 template 中使用时需要  <i-xxx-xxx></i-xxx-xxx>
        IconsResolver({
          prefix: '',
        }),
      ],
      dts: true,
    }),
    Icons(),
    WindiCSS(),
    ViteRestart({
      restart: '.vitepress/config/*.*',
    }),
  ],
  optimizeDeps: {
    include: [
      'axios',
      '@vueuse/core',
      'windicss/utils/style',
      'windicss',
      'json5',
      'prismjs',
      'prismjs/components/prism-css',
      'codemirror',
      'codemirror/mode/javascript/javascript',
      'codemirror/mode/css/css',
    ],
  },
})
