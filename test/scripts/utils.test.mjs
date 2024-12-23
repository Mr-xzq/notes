import { describe, it, expect, vi, afterEach } from "vitest";
import { parseArgs, slash } from "scripts/utils.mjs";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseArgs", () => {
  it("应该正确解析命令行参数", () => {
    vi.spyOn(process, "argv", "get").mockReturnValue([
      "node",
      "script.js",
      "--type",
      "test",
      "--path",
      "./some/path",
    ]);

    const args = parseArgs();
    expect(args).toEqual({
      _: [],
      type: "test",
      path: "./some/path",
    });
  });

  it("应该正确处理无参数的情况", () => {
    vi.spyOn(process, "argv", "get").mockReturnValue(["node", "script.js"]);

    const args = parseArgs();
    expect(args).toEqual({ _: [] });
  });
});

describe("slash", () => {
  it("应该将 Windows 路径转换为 Unix 风格路径", () => {
    expect(slash("C:\\Users\\test\\file.txt")).toBe("C:/Users/test/file.txt");
  });

  it("不应修改已经是 Unix 风格的路径", () => {
    const unixPath = "/home/user/file.txt";
    expect(slash(unixPath)).toBe(unixPath);
  });

  it("应该保持 Windows 扩展长路径不变", () => {
    const extendedPath = "\\\\?\\C:\\Very\\Long\\Path";
    expect(slash(extendedPath)).toBe(extendedPath);
  });

  it("应该正确处理混合斜杠的路径", () => {
    expect(slash("C:\\Users/test\\file.txt")).toBe("C:/Users/test/file.txt");
  });

  it("应该正确处理空路径", () => {
    expect(slash("")).toBe("");
  });

  it("应该正确处理 UNC 路径", () => {
    expect(slash("\\\\server\\share\\file.txt")).toBe(
      "//server/share/file.txt",
    );
  });
});
