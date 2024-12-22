/**
 * 我们也可以使用 `import`, 但那样的话, 需要明确定义每个导出
 *
 * 使用 memfs 包来模拟文件系统。memfs 是一个内存文件系统的实现，常用于测试环境。
 * 从 memfs 中解构出 fs 对象。
 * 将这个模拟的文件系统对象导出，这样在测试中就可以使用这个假的文件系统，而不是真实的文件系统。
 *
 * 如果想使用 ES 模块的 import 语法，就需要明确定义所有要导出的内容，
 * 而使用 CommonJS 的 require 和 module.exports 则更简单直接。
 * 这是一个典型的 mock 文件，通常放在 __mocks__ 目录下，用于在测试中替换真实的 fs 模块。
 */

const { fs } = require("memfs");

module.exports = fs;
