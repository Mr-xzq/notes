[xzq notes]: https://mr-xzq.github.io/notes/

# Xzq Notes Documentation

This is the documentation website for [xzq notes][].

## Development

```bash
// install dependencies
pnpm install
// run only dev server
pnpm dev
```

## Clear Cache

If you upgrade deps about astro, you may need to clear the cache:

```bash
rimraf .astro
rimraf node_modules
pnpm install
```

## Markdown

[Typora Markdown 语法](https://support.typora.io/zh/Markdown-Reference/)



在 md 中对于 link 的处理需要注意一些，参考语法：https://support.typora.io/Markdown-Reference/#links

如果你想在自己项目中的 md 跳转到自己项目中另外的 md，最好用相对路径，因为要考虑到 base 的情况

然后用想对路径之后，对于 astro，你需要考虑到打包的产物支不支持我们的相对路径，因为它会原生将 md 中的链接转换成 a 标签，href 就是链接地址

为了保持不同平台环境的兼容性，最好将 [build.format](https://docs.astro.build/zh-cn/reference/configuration-reference/#buildformat) 设置为 `file`，而不是维持默认的 `directory`



关于 astro 中的 build.format:

**类型**：`('file' | 'directory' | 'preserve')`
**默认值**：`'directory'`

控制每个页面的输出文件格式。这个值可能会由适配器帮你设置：

- `'file'`：Astro 将为每个路由生成一个 HTML 文件。（例如：`src/pages/about.astro` 和 `src/pages/about/index.astro` 都会打包成 `/about.html` 文件）
- `'directory'`：Astro 将生成一个目录，其中包含每个页面的嵌套的 `index.html` 文件。 (例如：`src/pages/about.astro` 和 `src/pages/about/index.astro` 都会打包成 `/about/index.html` 文件)
- `'preserve'`：Astro 将根据你的源文件夹中的文件生成 HTML 文件。 (例如：`src/pages/about.astro` 生成 `/about.html`，`src/pages/about/index.astro` 生成 `/about/index.html`)



也就是说如果是默认的 `directory`，你直接在 md 中写相对路径是引用不到你的文件的，比如：

```markdown
/basic/test1.md

声明一个引用链接
[toTest2一级标题]: './test2#test2一级标题'

引用一个引用链接
[跳转到 test2 的一级标题][toTest2一级标题]


/basic/test2.md

# test2一级标题
内容
```



这里的链接会被渲染成 `<a href="./test2#test2一级标题">跳转到 test2 的一级标题</a>`

但是我们目前部署到服务器的目录结构却是：`/basic/test1/index.html, /basic/test2/index.html`，那么你这里在

 `/basic/test1/index.html` 中写的 a 链接相对路径就是在 `/basic/test1/` 中，此时里面并没有 `test2.html` 文件，那么就会 404

## 部署

### 不同 base 的适配

github page 部署的项目会默认有一个项目站点：

`https://<username>.github.io/[repository]/`

文档：https://docs.github.com/zh/pages/getting-started-with-github-pages/what-is-github-pages#github-pages-%E7%AB%99%E7%82%B9%E7%9A%84%E7%B1%BB%E5%9E%8B

也就是说这里的 base 不是 `/` 跟目录，而是 `/[repository]/`, 对于 vercel，它的部署路径默认就是 `/`





### cleanUrls

https://vitepress.dev/zh/guide/routing#generating-clean-url

某些服务器或托管平台 (例如 Netlify、Vercel 或 GitHub Pages) 提供将 /foo 之类的 URL 映射到 /foo.html (如果存在) 的功能，而无需重定向：

Netlify 和 GitHub Pages 是默认支持的。

Vercel 需要在 vercel.json 中启用 cleanUrls 选项。

