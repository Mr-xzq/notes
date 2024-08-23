// 将多个 / 替换为一个 /
export const removeDuplicateSlash = (str: string) => {
  return str.replace(/\/+/g, "/");
};
