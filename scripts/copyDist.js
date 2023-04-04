const fg = require('fast-glob')
const { copy } = require('fs-extra')

function toDest(file) {
  // .vitepress/dist/assets/tsLearn/basic/overload-01.png
  return file.replace(/^.vitepress\//, 'docs/')

}

fg.sync('.vitepress/dist/**').forEach((file) => {
  copy(file, toDest(file))
})
