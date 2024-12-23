import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import path from "path";
import { fileURLToPath } from "url";
import { fs, vol } from "memfs";
import { globby } from "globby";
import {
  updateByPattern,
  getAstFromMd,
  getFirstTitleByMdAstTree,
  main,
} from "scripts/updateMdFrontmatter.mjs";

/**
 *
 * https://cn.vitest.dev/api/vi#mock-modules
 * https://cn.vitest.dev/guide/mocking.html#%E8%87%AA%E5%8A%A8%E6%A8%A1%E6%8B%9F%E7%AE%97%E6%B3%95-automocking-algorithm
 *
 * 如果你的代码导入了模拟模块，并且没有任何与此模块相关联的 __mocks__ 文件或 factory，
 * Vitest 将通过调用模块并模拟每个导出来的模拟模块本身。
 */
// __mocks__/fs.cjs
vi.mock("node:fs");
// __mocks__/globby.mjs
vi.mock("globby");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname, "test-files");

// https://cn.vitest.dev/api/#setup-and-teardown
// beforeEach 适用于不同的上下文，在当前上下文中的每个测试运行前调用，比如现在是所有测试运行前调���
// 如果在 describe 中使用，则是在 describe 中的每个测试运行前调用
beforeEach(async () => {
  vi.spyOn(process, "cwd").mockReturnValue(TEST_DIR);
  // 创建测试目录
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
});

afterEach(() => {
  vol.reset();
  vi.restoreAllMocks();
});

describe("updateByPattern", () => {
  it("应该能正确添加 frontmatter 标题", async () => {
    // 准备测试文件
    const testFile = path.join(TEST_DIR, "test1.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n这是内容");

    // 执行更新
    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    // 验证结果
    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("---\ntitle: 测试标题\n---");
  });

  it("应该能正确更新已存在的 frontmatter", async () => {
    const testFile = path.join(TEST_DIR, "test2.md");
    await fs.promises.writeFile(
      testFile,
      "---\ndate: 2024-01-01\n---\n\n# 新标题\n\n内容",
    );

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("title: 新标题");
    expect(content).toContain("date: 2024-01-01");
  });

  it("应该能正确移除 frontmatter", async () => {
    const testFile = path.join(TEST_DIR, "test3.md");
    await fs.promises.writeFile(
      testFile,
      "---\ntitle: 旧标题\n---\n\n# 实际标题\n\n内容",
    );

    await updateByPattern({
      type: "removeFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).not.toContain("---");
    expect(content).toContain("# 实际标题");
  });

  it("处理无效的 type 参数时应该提前退出", async () => {
    const testFile = path.join(TEST_DIR, "test4.md");
    await fs.promises.writeFile(testFile, "# 测试\n\n内容");

    const consoleSpy = vi.spyOn(console, "error");

    await updateByPattern({
      type: "无效类型",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it("当文件没有一级标题时不应修改内容", async () => {
    const testFile = path.join(TEST_DIR, "test5.md");
    const originalContent = "## 二级标题\n\n这是内容";
    await fs.promises.writeFile(testFile, originalContent);

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toBe(originalContent);
  });

  it("当文件路径模式没有匹配到文件时应正常处理", async () => {
    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/non-existent/*.md`,
      basePath: __dirname,
    });
  });

  it("处理文件读写错误时应该捕获异常", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    const mockFsReadFile = vi.spyOn(fs.promises, "readFile");
    mockFsReadFile.mockRejectedValueOnce(new Error("模拟读取错误"));

    const testFile = path.join(TEST_DIR, "test6.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it("当内容没有变化时不应该写入文件", async () => {
    const testFile = path.join(TEST_DIR, "test7.md");
    const content = "---\ntitle: 测试标题\n---\n\n# 测试标题\n\n内容";
    await fs.promises.writeFile(testFile, content);

    const writeSpy = vi.spyOn(fs.promises, "writeFile");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("应该使用默认选项正确运行", async () => {
    const testFile = path.join(TEST_DIR, "test8.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern();

    // 验证默认选项是否正确应用
    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("# 测试标题");
  });
});

describe("getFirstTitleByMdAstTree", () => {
  it("应该正确提取第一个一级标题", async () => {
    const content = "# 一级标题\n## 二级标题\n# 另一个一级标题";
    const ast = getAstFromMd(content);
    const title = await getFirstTitleByMdAstTree(ast);
    expect(title).toBe("一级标题");
  });

  it("当没有一级标题时应该返回 undefined", async () => {
    const content = "## 二级标题\n### 三级标题";
    const ast = getAstFromMd(content);
    const title = await getFirstTitleByMdAstTree(ast);
    expect(title).toBeUndefined();
  });
});

describe("命令行参数处理", () => {
  it("应该正确处理 base-path 为 test 的情况", async () => {
    const testFile = path.join(TEST_DIR, "test-cli.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("---\ntitle: 测试标题\n---");
  });

  it("应该正确处理 base-path 为 cwd 的情况", async () => {
    const testFile = path.join(TEST_DIR, "test-cli-cwd.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: process.cwd(),
    });

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("---\ntitle: 测试标题\n---");
  });

  it("使用不存在的目录路径时应该正常处理", async () => {
    // 验证程序正常执行，不会抛出错误
    // globby 对不存在的目录会返回空数组

    const consoleErrorSpy = vi.spyOn(console, "error");

    const nonExistentPath = path.join(TEST_DIR, "non-existent-dir");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: "*.md",
      basePath: nonExistentPath,
    });

    // 验证 globby 是否使用了正确解析的路径
    expect(await globby(nonExistentPath)).toEqual([]);

    // 验证没有错误输出（因为 globby 会返回空数组而不是抛出错误）
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

describe("命令行执行测试", () => {
  it("应该正确处理 addTitle 命令", async () => {
    const testFile = path.join(TEST_DIR, "test-cli-main.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    // 模拟命令行参数
    // const originalArgv = process.argv;
    // process.argv = [...originalArgv, "--type", "addTitle"];
    // do something...
    // process.argv = originalArgv;
    vi.spyOn(process, "argv", "get").mockReturnValue([
      "node",
      "script.js",
      "--type",
      "addTitle",
      "--scan-pattern",
      `${TEST_DIR}/*.md`,
      "--base-path",
      "test",
    ]);

    await main();

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("---\ntitle: 测试标题\n---");
  });

  it("应该正确处理 removeFrontmatter 命令", async () => {
    const testFile = path.join(TEST_DIR, "test-cli-remove.md");
    await fs.promises.writeFile(
      testFile,
      "---\ntitle: 旧标题\n---\n\n# 实际标题\n\n内容",
    );

    vi.spyOn(process, "argv", "get").mockReturnValue([
      "node",
      "script.js",
      "--type",
      "removeFrontmatter",
      "--scan-pattern",
      `${TEST_DIR}/*.md`,
      "--base-path",
      "test",
    ]);

    await main();

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).not.toContain("---");
    expect(content).toContain("# 实际标题");
  });

  it("使用无效的 type 参数时应该提前退出", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    vi.spyOn(process, "argv", "get").mockReturnValue([
      "node",
      "script.js",
      "--type",
      "invalidType",
      "--scan-pattern",
      `${TEST_DIR}/*.md`,
      "--base-path",
      "test",
    ]);

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("当前错误传参 type"),
    );
  });

  it("应该使用默认配置正确运行", async () => {
    const testFile = path.join(TEST_DIR, "test-cli-default.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await main();

    const content = await fs.promises.readFile(testFile, { encoding: "utf-8" });
    expect(content).toContain("# 测试标题");
  });
});
