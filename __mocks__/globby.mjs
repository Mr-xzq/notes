/**
 * globby 的 mock 实现
 * 使用 memfs 的文件系统和 glob 包来模拟 globby 的功能
 * 这样可以让 globby 在测试环境中使用内存文件系统而不是真实文件系统
 */

import { fs } from "memfs";
import { globby } from "globby";

// 创建一个返回 Promise 的 glob 包装函数
async function globbyMock(pattern, options = {}) {
  const matches = await globby(pattern, {
    ...options,
    fs: fs, // 使用 memfs 的文件系统
  });
  return matches;
}

export { globbyMock as globby };
