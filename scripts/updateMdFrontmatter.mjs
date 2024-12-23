import fs from "fs";
import { globby } from "globby";
import yaml from "js-yaml";
import { merge, omit } from "lodash-es";
import MagicString from "magic-string";
import path from "node:path";
import { fileURLToPath } from "node:url";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { CONTINUE, EXIT, visit } from "unist-util-visit";
import { parseArgs, slash } from "./utils.mjs";

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const getAstFromMd = (content) => {
  return unified().use(remarkParse).use(remarkFrontmatter).parse(content);
};

const getFirstTitleByMdAstTree = (astTree) => {
  return new Promise((resolve) => {
    let foundTitle = false;

    // 提取 md 中的 heading
    visit(astTree, "heading", (node) => {
      // 只获取第一个 heading
      if (node.depth === 1) {
        foundTitle = true;
        resolve(node.children.map((child) => child.value).join(""));
        return EXIT;
      } else {
        return CONTINUE;
      }
    });

    // 如果遍历完成后没有找到标题，返回 undefined
    if (!foundTitle) {
      resolve();
    }
  });
};

const addTitleToFrontmatter = async (content) => {
  const mdAst = getAstFromMd(content);

  // 提取第一个一级标题
  const firstTitle = await getFirstTitleByMdAstTree(mdAst);

  // 如果没有找到一级标题，返回原内容
  if (!firstTitle) return content;

  // 检查是否存在 frontmatter
  // 第一个节点一般是在顶部, fronmatter 一般也是在顶部
  const firstAstTreeChild = mdAst.children[0];
  let frontMatterContent = "";

  if (firstAstTreeChild && firstAstTreeChild.type === "yaml") {
    // 如果已有 frontmatter，解析并更新
    let existingFrontMatter = yaml.load(firstAstTreeChild.value) || {};
    existingFrontMatter.title = firstTitle;

    // 将 title 放在第一个
    existingFrontMatter = {
      title: existingFrontMatter.title,
      ...omit(existingFrontMatter, "title"),
    };

    frontMatterContent = `---\n${yaml.dump(existingFrontMatter)}---`;
  } else {
    // 如果没有 frontmatter，创建新的
    frontMatterContent = `---\ntitle: ${firstTitle}\n---\n`;
  }

  // 使用 MagicString 修改内容
  const magicString = new MagicString(content);

  // 替换或添加 frontmatter
  if (firstAstTreeChild && firstAstTreeChild.type === "yaml") {
    // 替换现有的 frontmatter
    const start = firstAstTreeChild.position.start.offset;
    const end = firstAstTreeChild.position.end.offset;
    magicString.overwrite(start, end, frontMatterContent);
  } else {
    // 在开头插入新的 frontmatter
    magicString.prepend(frontMatterContent);
  }

  return magicString.toString();
};

/**
 * 如果有 Fronmatter
 * 则移除 Fronmatter
 *
 * 如果没有 Fronmatter
 * 则不用管
 */
const removeFrontmatter = async (content) => {
  const mdAst = getAstFromMd(content);

  // 检查是否存在 frontmatter
  const firstAstTreeChild = mdAst.children[0];

  if (firstAstTreeChild && firstAstTreeChild.type === "yaml") {
    // 获取 frontmatter 的起始和结束位置
    const start = firstAstTreeChild.position.start.offset;
    const end = firstAstTreeChild.position.end.offset;

    // 使用 MagicString 修改内容
    const magicString = new MagicString(content);

    // 删除 frontmatter
    magicString.remove(start, end);
    // 移除前面的空白字符(\s --> \n \r \t ...)
    magicString.trimStart();

    return magicString.toString();
  } else {
    // 如果没有 frontmatter，返回原内容
    return content;
  }
};

const defaultUpdateByPatternOptions = {
  type: "addTitleToFrontmatter",
  pathPattern: "./example/*.md",
  basePath: process.cwd(),
};
const updateByPattern = async ({
  type = defaultUpdateByPatternOptions.type,
  pathPattern = defaultUpdateByPatternOptions.pathPattern,
  basePath = defaultUpdateByPatternOptions.basePath,
} = defaultUpdateByPatternOptions) => {
  pathPattern = slash(path.resolve(basePath, pathPattern));
  // globby 结合 memfs 和 vitest 的机制来测试
  const files = await globby(pathPattern);
  for (const filePath of files) {
    try {
      const content = await fs.promises.readFile(filePath, "utf8");

      let updatedContent;
      if (type === "addTitleToFrontmatter") {
        updatedContent = await addTitleToFrontmatter(content);
      } else if (type === "removeFrontmatter") {
        updatedContent = await removeFrontmatter(content);
      } else {
        console.error(
          `当前错误 type 为 ${type}, 正确的 type 参考为: { addTitleToFrontmatter |  removeFrontmatter }`,
        );
        break;
      }

      if (content === updatedContent) continue;

      await fs.promises.writeFile(filePath, updatedContent, "utf8");
      console.log(`Updated: ${filePath}`);
    } catch (err) {
      console.error(`Error updating ${filePath}:`, err);
    }
  }
};

/**
 * node ./scripts/updateMdFrontmatter.mjs --type addTitle --scan-pattern "./example/*.md" --base-path cwd
 * 等同于
 * updateByPattern({ type: "addTitleToFrontmatter", pathPattern: "./example/*.md", basePath: process.cwd() });
 *
 * node ./scripts/updateMdFrontmatter.mjs --type removeFrontmatter --scan-pattern "./example/*.md" --base-path test
 * 等同于
 * updateByPattern({ type: "removeFrontmatter", pathPattern: "./example/*.md", basePath: __dirname });
 */
const main = async () => {
  const type2UpdateMap = {
    addTitle: "addTitleToFrontmatter",
    removeFrontmatter: "removeFrontmatter",
  };

  const basePathMap = {
    cwd: process.cwd(),
    test: __dirname,
  };

  const defaultOptions = {
    type: "addTitle", // 'addTitle' | 'removeFrontmatter'
    "scan-pattern": "./example/*.md",
    "base-path": "cwd",
  };

  const argsObj = parseArgs();
  const options = merge(defaultOptions, argsObj);
  console.log("args-options:", options);

  if (!["addTitle", "removeFrontmatter"].includes(options.type)) {
    console.error(
      `当前错误传参 type 为 ${options.type}, 正确的 options.type 参考为: { addTitle |  removeFrontmatter }`,
    );
    return;
  }

  const inputOptions = {
    type: type2UpdateMap[options.type],
    pathPattern: options["scan-pattern"],
    basePath: basePathMap[options["base-path"]],
  };

  await updateByPattern(inputOptions);
};

main();

// 在文件末尾添加导出
export {
  addTitleToFrontmatter,
  removeFrontmatter,
  updateByPattern,
  getAstFromMd,
  getFirstTitleByMdAstTree,
};
