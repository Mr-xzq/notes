import minimist from "minimist";

export const parseArgs = () => minimist(process.argv.slice(2));

// npm: slash
// 将输入路径标准化为 Unix 风格的路径
// \\ --> /
// eg: D:\\path\\to\\file --> D:/path/to/file
export const slash = (inputPath) => {
  // 对于 windows 特殊的扩展长路径
  const isExtendedLengthPath = inputPath.startsWith("\\\\?\\");
  if (isExtendedLengthPath) {
    return inputPath;
  }

  return inputPath.replace(/\\/g, "/");
};
