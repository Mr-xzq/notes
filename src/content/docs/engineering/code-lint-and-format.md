---
title: 手把手带你构建代码规范
---

[git hooks]: https://git-scm.com/docs/githooks
[npm scripts]: https://docs.npmjs.com/cli/v8/using-npm/scripts
[npm life-cycle-scripts]: https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts
[npm pre-post-scripts]: https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts
[husky]: https://typicode.github.io/husky/#/
[eslint]: https://eslint.bootcss.com/
[prettier]: https://prettier.io/
[prettier options]: https://prettier.io/docs/en/options.html
[prettier configureFile]: https://prettier.io/docs/en/configuration.html
[prettier + eslint]: https://prettier.io/docs/en/integrating-with-linters.html
[prettier + gitHook]: https://prettier.io/docs/en/precommit.html
[lint-staged]: https://github.com/okonet/lint-staged#readme
[commit-lint]: https://commitlint.js.org
[chalk]: https://github.com/chalk/chalk#readme
[commitizen]: https://github.com/commitizen/cz-cli
[vscode]: https://code.visualstudio.com/
[mrm]: https://mrm.js.org/
[mrm-lint-staged]: https://mrm.js.org/docs/mrm-task-lint-staged

# 手把手带你构建代码规范

## 代码规范构建

> 1. [husky]
> 2. [eslint]
> 3. [prettier]
> 4. [lint-staged]

### 整合 [eslint] + [prettier]

具体如何操作请看 [eslint 和 prettier 整合这一章节](#eslint和prettier整合)。

### 集成 [husky]

> 这里需要注意的是：`husky`本身并不提供`gitHooks`的功能，他只是将`git`本身的`hook`的配置给抽象出来变得简单了罢了。

#### [git hooks] 是什么?

`git`本身是提供`hook`的，在对应的`./.git/hooks`下有对应的文件的`.sample`文件。

![image-20210824105406171](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824105406171.png)

![image-20210824105453292](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824105453292.png)

这个`.sample`文件都是一些脚本，这些钩子原生都是不生效的，我们可以根据`.sample`文件进行配置对应的`gitHooks`，然后将后缀名`.sample`去掉，这样就能生效。

这些脚本只要是可执行脚本就行，一般是`shell`，`python`或者`perl`等。

当然对于我们前端来说一般是写`shell`比较方便，只要脚本的文件名符合对应钩子即可。

对了，`.git`文件夹在项目下对于`windows`用户来说默认是看不见的，它是隐藏文件夹，我们需要进行如下的配置：

![image-20210824105941527](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824105941527.png)

#### [git hook][git hooks] 的作用域

对于任何`git`仓库来说钩子都是本地的，而且它不会随着`git clone`一起复制到新的仓库。

在开发团队中维护钩子是比较复杂的，因为`.git/hooks`目录不随你的项目一起拷贝，也不受版本控制影响。

一个简单的解决办法是把你的钩子存在项目的实际目录中（`.git`外），这样你就可以像其他文件一样进行版本控制。

这里也能大概看出来，对于一个团队协同多人开发的项目来说，直接用`gitHooks`很麻烦。

#### 常见 [git hook][git hooks]

> `gitHooks`有很多，比如`applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change"`等
>
> 具体细节去看`git`官网查看：https://git-scm.com/docs/githooks
>
> 这里我们只介绍两个：`pre-commit`，`commit-msg`

**1. pre-commit**

1. 这个钩子由 `git commit`调用，可以通过 `--no-verify(-n)` 选项绕过;

2. 它不接受任何参数，并且在获取建议的提交日志消息并进行提交之前被调用;

3. 该钩子对应的脚本以非零状态（`node异常退出是process.exit(1)`）退出会导致 `git commit` 命令在创建提交之前中止;

4. 默认的 `pre-commit` 钩子在启用时，会捕获带有尾随空格的行的引入，并在找到这样的行时中止提交;

5. 所有 `git commit` 钩子都使用环境变量 `GIT_EDITOR`调用对应的编辑器来提交（如果该命令不会打开编辑器来修改提交消息）;

6. 当启用`hooks.allownonascii`配置选项`unset`或设置为`false`时，默认的`pre-commit`挂钩将阻止使用非`ASCII`文件名;

**2. commit-msg**

1. 这个钩子由 `git commit` 和 `git merge` 调用，可以通过 `--no-verify(-n)` 选项绕过;

2. 它接受一个参数，即保存建议提交日志消息的文件的名称（在husky中作为环境变量`$1`，早期版本是`GIT_PARAMS`或者`HUSKY_GIT_PARAMS`，这些变量一般情况只有在脚本中才能访问到，比如：`node demo.js --param1 $1`）。而且类似这种都是局部变量，只能在`commit-msg`钩子生命周期的脚本中能获取;

   在`git-2.31.0-windows.1`版本下，这个文件名称为：`COMMIT_EDITMSG`，这个文件在`.git`文件夹下，存放的是我们的`commit msg`;

3. 以非零状态退出会导致命令中止（`node异常退出是process.exit(1)`）;

4. 该钩子允许就地编辑消息文件，并可用于将消息规范化为某种项目标准格式（意思就是可以在这个过程中编辑`commit msg`，一般来说就是修改提交日志消息的文件）。

5. 它还可用于在检查消息文件后拒绝提交;

6. 默认的 `commit-msg` 钩子在启用时会检测重复的 `Signed-off-by` 预告片，如果找到则中止提交;

#### 配置 [husky]

> 由上文可以知道，如果我们自己去手动配置 [git hooks] 很麻烦
>
> 1. 每次配置都需要去`.git`文件夹下去手动写对应的`hooks`的脚本（命名要匹配对应的钩子）
> 2. `.git`文件夹并不随着代码库一起同步
>
> 如果要强行将`.git`文件夹让其和代码库一起同步的话会带来很多风险。
>
> 因为我们知道，`.git`中存放的是`git config`配置文件，里面有很多`git`相关的配置信息，比如`username`，`email`等重要信息。
>
> `git config --local --list`读取的就是项目本地的`git`配置文件，它的优先级很高，`--global, --system`的优先级都要高，因此生效的一般都是`--local`。
>
> 如果你让他跟随项目文件夹一起同步的话，那么他就特别容易泄露出去。可能会造成机密信息的泄露，或者造成这个文件被篡改等的风险。
>
> 以上种种痛点如何解决呢，这里我们就引入的`husky`来协助我们配置 [git hooks]

这里我们选择的版本是`husky: ^7.0.1`。

**方法1（快捷方法）：**

```bash
npx husky-init
```

这个（从远端调用的）命令主要做了如下 4 件事情：

1. 先执行了`husky install`，然后`husky install`也集成了一些操作，比如先`git config --local core.hookspath .husky `，设置`githooks`识别路径。然后创建了`.husky`文件夹。在早期的`git`版本中, 不支持修改`gitHooks`识别路径, 默认只能是 `.git/hooks`文件夹。

2. 修改`package.json`，在其中的`devDependencies`加上`husky`对应的版本。

   ![image-20210824142904930](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824142904930.png)

3. 然后设置`package.json`中的`scripts`，`npm set-script prepare "husky install"`，这里要注意的是`npm set-script`只要在新版的`npm@7.x`中才有的命令。

   ![image-20210824142821580](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824142821580.png)

   这个`prepare`是什么呢，其实它是对应的`npm`的钩子。这里的效果就是你在执行`npm`命令（一般指`npm install`）之前会有一个准备工作，就是执行`husky install`，确保其他人也能保持正确的`husky`配置。关于`npm`钩子，在[npm钩子](#2.2.5 npm 钩子)中有具体描述。

4. 然后新建一个钩子`npx husky add .husky/pre-commit "npm test"`

   ![image-20210824145704817](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824145704817-16301433091881.png)

上述 4 步就是`npx husky-init`所完成的操作。

然后我们只需要安装在`devDependencies`中添加好的`husky`版本即可

```bash
npm install
```

**方法2（手动安装配置）：**

具体细节在 `方法1` 中都有具体描述，这里就描述一下步骤即可

```bash
# 1. 安装husky依赖
npm install husky --save-dev
# 2. 新建.husky文件夹, 设置core.hookspath
npx husky install
# 3. 设置package.json中的scripts脚本 prepare: "husky install"
npm set-script prepare "husky install"
# 4. 在.husky中新增钩子, pre-commit
npx husky add .husky/pre-commit "npm test"
```

#### `npm` 钩子

> `npm` 钩子只不过是一种特殊的 [npm scripts] --- [npm life-cycle-scripts]，[npm pre-post-scripts]
>
> 因此这里可以看作 `npm` 钩子有两种类型：
>
> 1. `npm` 生命周期钩子;
> 2. `prexxx/postxxx` 钩子。其中 `prepare` 属于生命周期（`life-cycle`）钩子中的一种。

**`prepare`的触发时机：**

1. 在打包之前的任何时间运行，即在 `npm publish` 和 `npm pack` 期间

2. 在包装打包（`packed`）之前运行

3. 在包发布（`published`）之前运行

4. 在本地 `npm install` 上运行，不带任何参数

5. 在 `prepublish` 之后运行，但在 `prepublishOnly` 之前运行

6. 注意：如果一个通过 `git` 安装的包，包含一个 `prepare` 脚本，它的 `dependencies` 和 `devDependencies` 将被安装，并且在包被打包（ `packaged` ）和安装（ `installed` ）之前准备脚本将被运行。

7. 从 `npm@7` 开始，这些脚本在后台运行。 要查看输出，请运行：`--foreground-scripts`。

**对于`prexxx/postxxx`钩子：**

To create "pre" or "post" scripts for any scripts defined in the `"scripts"` section of the `package.json`, simply create another script _with a matching name_ and add "pre" or "post" to the beginning of them.

```json
{
  "scripts": {
    "precompress": "{{ executes BEFORE the `compress` script }}",
    "compress": "{{ run command to compress files }}",
    "postcompress": "{{ executes AFTER `compress` script }}"
  }
}
```

In this example `npm run compress` would execute these scripts as described.

具体细节请看`npm`官网：https://docs.npmjs.com/cli/v7/using-npm/scripts

#### 测试

我们先将改一下`.husky`下的`pre-commit`脚本

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 这里要注意，这个 node 的执行路径是与 .git 和 .husky 同级的, 因此这里 node path 时, 这个 path 也是相对于这个 node 执行路径, 而不是按照文件路径
node ./scripts/test.js --name xzq --age 18
```

然后与`.husky`同级新建一个`scripts/test.js`

```js
const args = require("minimist")(process.argv.slice(2));
console.log("args", args);
```

然后我们执行提交命令`git commit -m 'test'`， 就会有触发钩子，然后执行`test.js`文件。如果有如下的输出，说明`pre-commit`钩子配置成功。

![image-20210824151547556](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824151547556.png)

**这里要注意的是：**

只有你手动在`git bash`或者`powershell`之类的终端工具上手动`git commit`，才能清晰的看到输出。

如果你通过[vscode]或者`sourcetree`之类的`git`工具进行提交，对应的钩子也能触发，但是可能看不清楚一些输出。

#### [husky] 环境变量

> 有的是局部变量，有的是全局变量，比如`$1`，只存在`commit-msg`钩子触发生命周期之内。

- `HUSKY`，如果它为`"0"`，等同于`--no-verify(-n)`跳过钩子。在早期版本这个变量名值为`HUSKY_SKIP_HOOKS`

- `$1`，这个值只有在`commit-msg`时期生效，它应该是局部变量，它的值是保存`commit msg`文件的名称。这个值在`husky@7.x`才有，在早期版本也可能是`HUSKY_GIT_PARAMS`或者`GIT_PARAMS`。这个值一般需要传给校验 msg 的文件用。比如`npx commitlint -E HUSKY_GIT_PARAMS`，现在就是`npx commitlint -E $1`。

- `HUSKY_DEBUG`，如果它的值为`"1"`，在控制台就会输出一些详细信息，比如触发了哪些钩子之类的。

#### 这个环境变量怎么用？

> 我这边测试只在`git bash`生效了，不知道怎么在`powershell`，`node`和`cmd`中用。

比如要配置`HUSKY=1`的值，那么直接在`git bash`下输入:

![image-20210824164207319](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824164207319.png)

然后它就会跳过校验。

比如配置`HUSKY_DEBUG=0`:

![image-20210824164331730](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824164331730.png)

### 校验 commit-msg

> 配置好`husky`之后，我们这里只需要配置`gitHooks`即可。
>
> 这里其实可以应用工具 [commit-lint] 来校验`commit-msg`，但是为了能够让大家看的更清楚。这里我们用自己写的`scripts/verifyCommitMsg.js`来看一下原理。
>
> 对应的`gitHooks`为：`commit-msg`

#### 新建 commit-msg 钩子

首先输入对应的命令：

```bash
npx husky add .husky/commit-msg 'node ./scripts/verifyCommitMsg.js --gitCommitInfoPath "$1"'
```

这样就会在`.husky`下产生新的`githook: commit-msg`

![image-20210824152639875](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824152639875.png)

并且里面会有如下的内容：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 这里的 $1 就是存放 commit-msg 的文件名, 用引号将其包裹起来, 是怕有些终端不识别 $ 这种特殊符号
export FORCE_COLOR=1 && node ./scripts/verifyCommitMsg.js --gitCommitInfoPath "$1"
```

<!--
  要跳转的锚点一般指的是 html 中元素的 id, 对于 标题元素, md 会自动解析给其加上对应的 id
  这个 id 必须是唯一值, 不然无法跳转
-->

这个`$1`其实`gitHooks`在`commit-msg`期间传给`husky`的参数，然后由`husky`包装一下，作为环境变量放入进来。细节在[常见 hook 中的 commit-msg 中有讲解](#常见-git-hook)。

这里的`export FORCE_COLOR=1`是为了设置一下临时的环境变量`FORCE_COLOR：1`，因为在`husky`中默认不支持 [chalk]\(可以美化终端字体的颜色的工具)，因此我们这里要强制开启一下，`FORCE_COLOR`有三种级别：1，2，3。级别由低到高支持的颜色越来越多，但兼容性就越来越低。

#### 新建测试文件

然后与`.husky`同级新建一个`scripts/verifyCommitMsg.js`

```js
const chalk = require("chalk");
// 除了上文的 export FORCE_COLOR = 1 外, 还能在 API 中直接设置, 但是这是全局的
// chalk.level = 3, level 的值和 FORCE_COLOR 相同

const args = require("minimist")(process.argv.slice(2));
const { gitCommitInfoPath } = args;
if (!gitCommitInfoPath) {
  // 输出空行
  console.log(chalk.red("not find valid commit info"));
  // process.exit 的参数可以是 0 - 255 之间的数字, 传 0 代表正常退出, 传 0 之外数字代表异常终止, 一般传 1
  process.exit(1);
}
// 读取存放 git-commit-msg 的文件, 获取 commit-msg 信息, 去除多余的空格
const commitMsg = require("fs")
  .readFileSync(gitCommitInfoPath, { encoding: "utf-8" })
  .trim(); // 这个后面有多余的空格, 因此要清除

// 校验 commit-msg 的规则
const commitRE =
  /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

// 如果不满足则抛出错误信息
if (!commitRE.test(commitMsg)) {
  console.log();
  console.log(chalk.red("haha"));
  console.log(
    `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
      "invalid commit message format.",
    )}\n\n${chalk.red(
      "  Proper commit message format is required for automated changelog generation. Examples:\n\n",
    )}    ${chalk.green("feat(compiler): add 'comments' option")}\n` +
      `    ${chalk.green(
        "fix(v-model): handle events on blur (close #28)",
      )}\n\n${chalk.red(
        "  See .github/commit-convention.md for more details.\n",
      )}`,
  );
  process.exit(1);
}
```

#### 测试

直接在终端输入`git commit -m 'hello world'`

![image-20210824154045619](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210824154045619.png)

其实这里我们也能看到，先触发的钩子是`pre-commit`，然后才是`commit-msg`

### 集成 [lint-staged] 到 [husky]

> 前面的文章讲述的都是对`commit-msg`进行的一些操作，那么如果我在`commit`时，对代码质量和格式进行操作，那又该怎么办呢？
>
> 这里大概的思路就是在 `githook: pre-commit`中添加对应的操作。
>
> 但是我们都知道，代码这个时候已经在`git staged(暂存区)`中，也就是代码改动已经`git add ./`到暂存区了，这个时候如果我们手动去更改，那又会造成代码的变动。
>
> 除非`git reset`退回，然后再更改，然后再`git add ./`，但是这样太麻烦。
>
> 那么我们有没有一种直接在`git staged(暂存区)`进行代码变动，而且不会触发反复的`diff`的工具呢？
>
> 这个时候我们可以选择`lint-staged`来干这件事。

在[lint-staged 官网][lint-staged]中有一句对[lint-staged]的描述：`Run linters against staged git files and don't let 💩 slip into your code base!`。对暂存的`git`文件运行`linters`，不要让`shi`💩一样的代码进入到你的仓库。

这里的`linters`特指各种校验代码，控制代码质量等的工具。

如何配置呢？这里有两种方案：

#### 手动配置

1. 首先安装依赖:

   ```bash
   npm install lint-staged
   ```

2. 然后在`package.json`中配置`lint-staged`触发时需要的操作:

   ```json
   {
      "lint-staged": {
        "*": [
          "prettier --write --cache --ignore-unknown"
        ]
       "*.{js,vue,html}": "eslint --cache --fix"
      }
   }
   ```

3. 最后在配置`lint-staged`触发时机，这里我们选择`.husky`中的`pre-commit`，也就是`gitHooks`中的`pre-commit`作为触发时机:

   ```bash
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"

   npx lint-staged
   ```

#### 快捷配置

> 注意：如果你当前已经安装了 `husky, lint-staged` 的情况下，记得先`uninstall`。

在我们已经安装了`eslint, prettier`的前提下，可以直接一步到位

参考：https://prettier.io/docs/en/precommit.html#option-1-lint-stagedhttpsgithubcomokonetlint-staged

```bash
npx mrm@2 lint-staged # mrm@2 指的是选择主版本为 2 的 mrm, 一般我们可以直接 npx mrm lint-staged
```

1. 这行命令会帮我们安装 `husky`，`lint-staged`;

2. 并且还会执行`npx husky add .husky/pre-commit 'npx lint-staged'`，也就是在[husky]中新建一个钩子（`pre-commit`）;

3. 并且还会在`package.json`中写入:

   ```json
   {
     "scripts": {
       "prepare": "husky install"
     },
     "lint-staged": {
       "*.js": "eslint --fix"
     }
   }
   ```

#### [mrm] 是什么

> 命令行工具可帮助您保持开源项目的配置（`package.json、.gitignore、.eslintrc` 等）同步。

##### 优点

1. 除非您愿意，否则不会覆盖您的数据；

2. 最小的更改：保留原始文件格式或从 `EditorConfig` 读取样式；

3. 最小配置：尝试从项目本身或环境推断配置；

4. 包括 `ESLint、Prettier、lint-staged` 等流行工具的可定制任务；

5. 用于处理 `JSON、YAML、INI、Markdown` 和换行符文本文件的自定义任务和工具；

6. 通过 `npm` 共享任务并将它们分组到预设中；

也就是说你可以用 `mrm`来共享别人的一些工具配置的最佳实践，或者如果你自己有最佳实践也可以传上去，然后通过`mrm`来同步，不管是老项目配置的升级或者新项目配置的一键配置都挺方便的。

##### 示例

如果你想快速开始一个项目，使用单个命令安装基本 `JavaScript` 项目所需的一切，并在不到一分钟的时间内开始工作：

```shell
git init && npx mrm package editorconfig gitignore eslint prettier lint-staged
```

如果你想配置`license, readme, contributing`文件，再次运行 [mrm] 以引导基本文档，并根据需要调整它们：

```shell
npx mrm license readme contributing
```

如果想运行一个非常老的项目，可以再次运行相同的命令以升级和迁移所有配置：

```shell
npx mrm package editorconfig gitignore eslint prettier lint-staged
```

##### 常见预设（`preset`）

- [ci](https://mrm.js.org/docs/mrm-task-ci)
- [codecov](https://mrm.js.org/docs/mrm-task-codecov)
- [contributing](https://mrm.js.org/docs/mrm-task-contributing)
- [dependabot](https://mrm.js.org/docs/mrm-task-dependabot)
- [editorconfig](https://mrm.js.org/docs/mrm-task-editorconfig)
- [eslint](https://mrm.js.org/docs/mrm-task-eslint)
- [gitignore](https://mrm.js.org/docs/mrm-task-gitignore)
- [jest](https://mrm.js.org/docs/mrm-task-jest)
- [license](https://mrm.js.org/docs/mrm-task-license)
- [lint-staged](https://mrm.js.org/docs/mrm-task-lint-staged)
- [package](https://mrm.js.org/docs/mrm-task-package)
- [prettier](https://mrm.js.org/docs/mrm-task-prettier)
- [readme](https://mrm.js.org/docs/mrm-task-readme)
- [semantic-release](https://mrm.js.org/docs/mrm-task-semantic-release)
- [styleguidist](https://mrm.js.org/docs/mrm-task-styleguidist)
- [stylelint](https://mrm.js.org/docs/mrm-task-stylelint)
- [travis](https://mrm.js.org/docs/mrm-task-travis)
- [typescript](https://mrm.js.org/docs/mrm-task-typescript)

[快捷配置](#快捷配置)中的预设采用的就是 [mrm-lint-staged]。

##### [mrm-lint-staged] 是什么

> **Note:** 现在仅支持 `Prettier, ESLint, Stylelint`；最新支持请参考：[mrm-lint-staged]

它能做什么：

- 在 `package.json` 中创建一个配置；
- 设置 `pre-commit Git hook`；
- 安装依赖项；

此任务将尝试从您的 `npm` 脚本推断扩展。

例如，如果你有 `lint` 脚本为 `js` 和 `ts` 文件运行 `ESLint`，该任务将添加 `lint-staged` 规则，为相同的扩展运行 `ESLint`。

如果您手动更改现有规则并再次运行任务，它将覆盖现有规则，但它会尝试保持您的自定义规则。

常见用法：

```shell
npm install -g mrm mrm-task-lint-staged

mrm lint-staged
```

常见配置项（`lint-staged-rules`）

可以查看 [Mrm docs](https://mrm.js.org/docs/getting-started) 和 [lint-staged docs](https://github.com/okonet/lint-staged/blob/master/readme) 来关注更多细节。

覆盖和自定义规则。 默认情况下，将尝试通过项目依赖项进行推断。

例如，自定义扩展：

```json
{
  "lintStagedRules": {
    "eslint": {
      "extensions": ["js", "jsx", "mjs"]
    }
  }
}
```

或自定义命令：

```json
{
  "lintStagedRules": {
    "eslint": {
      "command": "eslint --fix"
    }
  }
}
```

或者您可以禁用默认规则之一：

```json
{
  "lintStagedRules": {
    "prettier": {
      "enabled": false
    }
  }
}
```

或者添加自定义规则：

```json
{
  "lintStagedRules": {
    "jest": {
      "extensions": ["js"],

      "command": "jest --bail --findRelatedTests"
    }
  }
}
```

#### 执行多个命令

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```

### 集成[commitizen]简化提交步骤

> `commit msg`的书写是有规范的，但是如果每次提交我们都按照规范写，就很麻烦，这里就有一个工具来帮我们构建规范的`commit msg`，那就是`commitizen`。
>
> 这里我们选择局部安装，是为了确保不同成员使用的都是同一个版本。
>
> 确保在不同的电脑上能有相同的行为哦。因为我们的构建代码规范都是为了让团队的不同成员能够遵守相同的代码规范，如果采用全局安装的话，不能确保每个团队成员安装的都是同一个版本。

```bash
# 安装 commitizen 依赖
npm install --save-dev commitizen

# 安装适配器
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

最后在`package.json`中配置脚本即可：

```json
{
  "scripts": {
    "commit": "cz"
  }
}
```

这里需要注意的是，在`npm`的`scripts`中的脚本执行时会触发钩子的，比如你这里配置`commit`作为触发`cz`的脚本名称，那么他就会触发`scripts`名为`precommits`的`npm`钩子。当然，还会触发其他的生命周期钩子，这个就不细讲了。具体请看[npm钩子概述](#2.2.5 npm 钩子)。

然后你输入`npm run commit`就会触发你配置的适配器的效果。

![image-20210828163515787](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210828163515787.png)

这样的们提交信息也变得简单了，并且变得很规范。

## eslint和prettier整合

### 两者冲突的原因

[eslint]是用来控制代码质量的，它能处理诸如命名不规范，声明变量未使用等错误等代码质量相关的，这是它主要的作用。但是它也附带一些关于代码格式的校验功能。

[prettier]相比于[eslint]只有一个功能，那就是用来控制代码格式的（代码美观）。

当两者所要求的格式有冲突时，这个时候就会有问题。

### 解决方案

#### 方案-01

既然是两者要求的格式有所冲突，因此我们可以选择直接禁用掉[eslint]与[prettier]冲突相关的规则，如果我们只是靠手写，那太麻烦了。刚好有现成的`eslint-config-xxx`可以完成这个功能。

```bash
npm install -D eslint-config-prettier
```

然后将其配置入[eslint]配置文件中，比如`.eslintrc.js`，然后在`extends`继承其规则，要记住，`extends`中越在数组后面的规则，优先级越高。因此我们需要将要覆盖[eslint]规则的`rule`写到后面。

```js
module.exports = {
  extends: [
    "eslint:recommended",
    // 'eslint-config-prettier', 用来关闭一些 eslint 和 prettier 冲突的规则
    "prettier",
  ],
};
```

**如果要自定义规则：**

既然我们关闭了[eslint]中与[prettier]相冲突的代码格式化相关的规则，那么我们最好就不要在`rules`中再写代码格式化相关的规则，而是将代码格式化的功能直接写到[prettier]的配置文件中。

```js
// .eslintrc.js
module.exports = {
  extends: [
    "eslint:recommended",
    // 'eslint-config-prettier', 用来关闭一些 eslint 和 prettier 冲突的规则
    "prettier",
  ],
  rules: {
    // 不允许结尾分号
    semi: ["error", "never"],
    // 不允许单引号
    quotes: ["error", "single"],
  },
};

// .prettierrc.js
module.exports = {
  // 结尾分号
  semi: true,
  // 单引号
  singleQuote: false,
};
```

这样就会让[eslint]与[prettier]的规则有冲突。如果这里你设置了编辑器（比如[vscode]）的保存自动`eslint fix`和保存自动`prettier --write ./`（用[prettier]格式化代码），那么就会出现反复横跳的一幕。关于具体怎么集成[vscode]和[eslint]和[prettier]，后面细说。

#### 方案-02

既然两者要求的格式有冲突，那么我们可不可以将[prettier]的格式化功能集成到[eslint]中来覆盖[eslint]自己的与[prettier]相冲突的代码格式化功能呢？答案自然是可以的，这里需要下载`eslint-plugin-preiiter`插件。

```bash
npm install -D eslint-plugin-prettier
```

**优化写法：**

```js
module.exports = {
  plugins: [
    // 'eslint-plugin-prettier', 将prettier整合到eslint中, 作为eslint的一部分调用
    "prettier",
  ],
  extends: [
    // 这里也有可能出现eslint和prettier冲突的规则, 要记住放在后面, 因此需要配置一下
    "plugin:prettier/recommended",
  ],
};
```

其中`plugin:prettier/recommended`其实是精简写法，其实我们知道，`extends`其实是继承配置（可以理解为继承别的`.eslintrc.js`），继承的配置如下：

```js
module.exports = {
  extends: [
    // eslint-config-prettier, 禁用 eslint 和 prettier 冲突的规则
    "prettier",
  ],
  // plugins 可写可不写, 它只是用作标识, 只要你将对应的依赖安装了即可
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {},
      {
        // eslint-plugin-prettier 默认会去读取本地的 prettier 配置文件
        usePrettierrc: true,
      },
    ],
    // 下面两个规则如果按照 prettier/prettier 和 eslint 自带的, 可能会出现问题
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
  },
};
```

注意：`eslint-plugin-prettier`自己并不包含`eslint-config-prettier`，因此这里需要我们本地`npm install eslint-config-prettier -D`。

**如果要自定义一些规则：**

通过[eslint]可以给`eslint-plugin-prettier/prettier`传递一些选项：

```js
// 不建议的做法
// .eslintrc.js
module.exports = {
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
  },
};

// 建议的做法
// usePrettierrc 默认值为 true, 也就是默认会读取本地的 prettier 配置文件
// .prettierrc.js
module.exports = {
  singleQuote: true,
};
```

但是这里要注意的是，真实的`eslint`能够通过`usePrettierrc`识别到`.prettierrc`配置文件，比如：`npx eslint --fix ...`并不会出现`prettier/prettier`规则错误，但是`IDE`的`eslint`插件却不能，因此`IDE`会出现红色警告。具体可以参考：[IDE eslint 插件局限性](#eslint-插件和-eslint-plugin-prettier)。

#### 总结

这里采用**方案-01**

首先下载依赖

```bash
npm install -D eslint prettier eslint-config-prettier
```

然后对[eslint]配置文件`.eslintrc.js`进行配置

```js
module.exports = {
  extends: [
    "eslint-recommended",
    // eslint-config-prettier 关闭 eslint 中可能与 prettier 冲突的规则
    "prettier",
  ],
};
```

如果有代码格式校验上的自定义的规则（要确定这个规则是和[eslint]没有冲突的那部分）其实可以理解为单独是代码美观的规则，那么就在[prettier]配置文件`.prettierrc.js`中进行配置。如果没有额外的要求，可以不写这个文件，直接采用默认即可。

```js
module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
};
```

如果有[eslint]代码质量方面规则的控制，那么就还是在[eslint]配置文件`.eslintrc.js`的`rules`进行配置。

如果需要设置`eslint, prettier`忽略一些文件，可以配置对应的件，`.prettierignore`，`.eslintignore`，里面采用的是`glob`模式。

```
.husky
dist/*
node_modules/*
```

#### 注意点

1. 如果你本地`local`有了[prettier]配置文件`.prettierrc.js`，那么即使它内容为空。

   无论是你[vscode]的[prettier]插件，还是本地的其他依赖[prettier]的都会去读取这个配置文件。

   只不过这个时候采用默认配置。这个是会覆盖掉你[vscode]等之类的全局的[prettier]的配置。

2. 大家都知道，`.editorConfig`也是控制代码格式的，但是在[vscode]中本来是需要插件支持才能识别这个文件。

   但是现在还有一个问题就是，新版的[prettier]它可以读取`.editorConfig`，然后将它的内容解析到自己的配置中。

   这就导致了即使你没有写[prettier]的配置文件，如果你有了`.editorConfig`，那么也就相当于你有了[prettier]配置文件。

   比如：
   `.editorconfig`:

   ```
   [*]
   tab_width = 2
   ```

   等同于`.prettierrc.js`:

   ```js
   module.exports = {
     tabWidth: 2,
   };
   ```

   具体可以看[prettier读取配置优先级](#读取配置优先级)

3. `eslint-plugin-prettier`插件的默认读取`prettier`配置文件实际对于`eslint`是生效的，但是一些`IDE`继承的`eslint`插件不能很好的识别；

## 整合到 vscode

> 集成到[vscode]中，是通过安装插件的方式。

### [eslint] 插件

为什么要安装插件？

不安装插件时我们怎么`fix`代码？如果没有全局[eslint]，而是本地安装[eslint]的话。

```bash
# 默认情况下eslint只会格式化 .js 后缀的文件
npx eslint --fix xxx(path)
# 我们可以指定后缀, 处理src文件夹下 vue,js,html后缀的文件
npx eslint --fix --ext .vue,.js,.html xxx(path)
```

每次我们敲完代码都需要手动去在命令行敲出这行代码，而且，我们无法实时知道我们的代码有没有问题，除非：

```bash
# 手动查看
npx eslint xxx(path)
```

![image-20210823183024966](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210823183024966.png)

因此为了方便操作，我们可以将这些都交由[vscode]的插件来做：

![image-20210823181141640](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210823181141640.png)

这里我们用的版本时`v2.1.23`，这是采用的是新版的[eslint]插件，因此配置也发生改变了。

首先打开[vscode]配置文件`json`：

```json
{
  // v2.0.4之前
  "eslint.autoFixOnSave": true,
  // v2.0.4之后
  // 保存代码所进行的操作
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  // 配置你需要处理的文件类型, autoFix默认开启，只需输入字符串数组即可,
  "eslint.validate": ["javascript", "vue", "html", "javascriptreact"]
}
```

配置好了之后能该插件能配合编辑器实时让我们知道[eslint]的校验结果：

![image-20210823182854235](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210823182854235.png)

**需要注意的点就是：**

```json
// 默认情况 VSCode 插件 ESlint 的判断工作目录的配置是 "mode":"location", 也就是自动根据当前打开文件夹的去寻找 package.json, .eslintrc.js  .eslintignore, 也就是 ESlint 相关配置文件, 如果找不到就会 cannot find modules
// 当有多层文件夹时, 这里就需要配置 "auto", 他会自动根据 package.json, .eslintrc.js  .eslintignore所在的目录为工作目录
{
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ]
}
```

### [prettier] 插件

为什么要安装插件？

不安装插件时我们怎么`format`代码？如果没有全局[prettier]，而是本地安装[prettier]的话：

```bash
# 指定格式化代码
npx prettier --write xxx(path)
```

每次我们敲完代码都需要手动去在命令行敲出这行代码，而且，我们无法实时知道我们的代码的格式有没有问题，除非：

```bash
# 手动查看
npx prettier --check xxx(path)
```

![image-20210823183132963](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210823183132963.png)

因此为了方便操作，我们可以将这些都交由[vscode]的插件来做：

![image-20210823182643756](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210823182643756.png)

当前版本为`v8.1.0`

首先打开[vscode]配置文件`json`：

```json
{
  // 设置保存时自动格式化代码
  "editor.formatOnSave": true,
  // 设置vscode的默认格式化是esbenp.prettier-vscode---->也就是vscode插件prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**需要注意的是：**

如果本地没有`npm install preitter -D`，也没有类似于`.prettierrc.js`之类的配置文件的话，并且也没有全局的[prettier]的话，那么[vscode]插件`preitter`采用的是它自己捆绑的`preitter`的默认配置。

#### 读取配置优先级

> NOTE: If any local configuration file is present (i.e. `.prettierrc, .editorconfig `) the VS Code settings will **NOT** be used.

You can use VS Code settings to configure prettier. Settings will be read from (优先级从高到低):

1. [Prettier configuration file][prettier configureFile];
2. `.editorconfig`;
3. Visual Studio Code Settings (Ignored if any other configuration is present);

## 新增常见问题

#### Delete CR eslint(prettier/prettier)

**原因:**

罪魁祸首是`git`的一个配置属性：`core.autocrlf`。

由于历史原因，`windows`下和`linux`下的`文本文件的换行符不一致`。

```
Windows`在换行的时候，同时使用了`回车符CR(carriage-return character)`和`换行符LF(linefeed character)
```

而`Mac`和`linux`系统，仅仅使用了`换行符LF`

```
老版本的Mac系统使用的是回车符CR
```

| Windows | Linux/Mac | Old Mac(pre-OSX) |
| ------- | --------- | ---------------- |
| CRLF    | LF        | CR               |
| ‘\n\r’  | ‘\n’      | ‘\r’             |

因此，文本文件在不同系统下创建和使用时就会出现不兼容的问题。

项目仓库中默认是`Linux环境`下提交的代码，文件默认是以`LF结尾`的(工程化需要，统一标准)。

`windows`电脑`git clone`代码的时候，
如果我的`autocrlf(在windows下安装git，该选项默认为true)为true`，那么文件每行会被自动转成以`CRLF`结尾。

**解决方案:**

1. 如果是`windows`系统

   ```bash
   git config --global core.autocrlf false
   ```

   `git`全局配置之后，需要重新拉取代码。

2. 通过`Eslint`

   ```bash
   npx eslint --fix
   ```

3. 配置[prettier]规则

   ```json
   {
     "endOfLine": "auto"
   }
   ```

#### eslint 插件和 eslint-plugin-prettier

当我们将`prettier`具体规则写到单独的配置文件中，让`eslint-plugin-prettier`自动读取时，

对于`npx eslint --fix path`是会生效的。

但是这里有一个问题，对于一些`IDE`自带的辅助插件却不会生效，比如`VSCode, Webstorm`对应的`eslint`插件都无法读取到，因此依旧会出现红色的错误警告。

这不是我们配置的问题，而是插件的问题。

这里有一个折衷的解决办法，就是直接在`eslint`的`rules`中书写`prettier/prettier`规则：

```js
// 不建议的做法
// .eslintrc.js
module.exports = {
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
  },
};
```

这样`eslint`和那些`IDE`的`eslint`插件都能很好的识别，但是也有一个局限性：

在`eslint`中书写`prettier`的规则只能将一些简单的规则写进去，对于`prettier`的一些解析或者其他相关特殊的规则写进去是不会生效的，比如，当你将`prettier`集成到`eslint`中的`rules`时，可能会出现`Parsing error: Unexpected token prettier/prettier caused by "<!DOCTYPE html>" `，无法对`html`进行正常的解析，这时你需要书写：

```js
// .prettierrc
module.exports = {
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "html",
      },
    },
  ],
};
```

当你输入`npx eslint --fix index.html`时你会发现错误已经解决，因为`eslint-plugin-prettier`是会自动读取`prettier`配置文件的，但是你会发现由于`IDE`的`eslint`插件无法识别这种情况会导致`IDE`上依旧是红色警告。

![prettier parse error](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220731/09:46:38-prettier%20parse%20error.png)

参考：

https://blog.csdn.net/lty1010/article/details/124611184

https://prettier.io/docs/en/options.html#parser

但是如果你写在`eslint`的里面：

```js
// .eslintrc.js
module.exports = {
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        overrides: [
          {
            files: "*.html",
            options: {
              parser: "html",
            },
          },
        ],
      },
    ],
  },
};
```

你会发现`eslint-plugin-prettier`，也就是`eslint`根本无法识别这里的`overrides`。

`npx eslint --fix index.html`会报错，`IDE`的`eslint`插件同样会报错。

因此集成`eslint, prettier`方案推荐：[`eslint-config-prettier`](#方案-01)，不推荐[`eslint-plugin-prettier`](#方案-02)。

## 参考

[git hooks]

[npm scripts]

[npm life-cycle-scripts]

[npm pre-post-scripts]

[husky]

[eslint]

[prettier]

[prettier options]

[prettier configureFile]

[prettier + eslint]

[prettier + gitHook]

[lint-staged]

[commit-lint]

[chalk]

[commitizen]

[vscode]
