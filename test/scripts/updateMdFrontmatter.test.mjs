import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import path from "path";
import { fileURLToPath } from "url";
import { fs, vol } from "memfs";
import {
  updateByPattern,
  getAstFromMd,
  getFirstTitleByMdAstTree,
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

describe("updateByPattern", () => {
  beforeEach(async () => {
    // 创建测试目录
    await fs.promises.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    vol.reset();
  });

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
    const content = await fs.promises.readFile(testFile, "utf8");
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

    const content = await fs.promises.readFile(testFile, "utf8");
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

    const content = await fs.promises.readFile(testFile, "utf8");
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
    consoleSpy.mockRestore();
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

    const content = await fs.promises.readFile(testFile, "utf8");
    expect(content).toBe(originalContent);
  });

  it("当文件路径模式没有匹配到文件时应正常处理", async () => {
    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/non-existent/*.md`,
      basePath: __dirname,
    });
    // 如果没有抛出错误就算通过
  });

  it("处理文件读写错误时应该捕获异常", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    const mockFs = vi.spyOn(fs.promises, "readFile");
    mockFs.mockRejectedValueOnce(new Error("模拟读取错误"));

    const testFile = path.join(TEST_DIR, "test6.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern({
      type: "addTitleToFrontmatter",
      pathPattern: `${TEST_DIR}/*.md`,
      basePath: __dirname,
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    mockFs.mockRestore();
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
    writeSpy.mockRestore();
  });

  it("应该使用默认选项正确运行", async () => {
    const testFile = path.join(TEST_DIR, "test8.md");
    await fs.promises.writeFile(testFile, "# 测试标题\n\n内容");

    await updateByPattern();

    // 验证默认选项是否正确应用
    const content = await fs.promises.readFile(testFile, "utf8");
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
