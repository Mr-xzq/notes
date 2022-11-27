# TypeScript 基础入门

## 介绍

### 什么是 TypeScript

`TypeScript`，也称为 `TS`，是 `JavaScript(JS)` 的超集（给 `JS` 加上了一些附加功能），其中最重要的就是`TS` 的类型系统，它提供一套全面的对语法定义、使用的约束，来强化 JS 代码的可读性和可维护性。

### TypeScript 特点

对比于 `javascript`最核心的不同就是：

1. 类型编程
2. 新的 `ES` 的标准的实现（预实现的 `ES` 提案），如装饰器、 可选链`?.` 、空值合并运算符`??`（和可选链一起在 [TypeScript3.7](https://link.juejin.cn/?target=https%3A%2F%2Fdevblogs.microsoft.com%2Ftypescript%2Fannouncing-typescript-3-7%2F) 中引入）、类的私有成员 `private` 等。除了部分极端不稳定的语法（说的就是你，装饰器）以外，大部分的 `TS` 实现实际上就是未来的 `ES` 语法。

关于 `TS` 的类型系统，首先要记住很重要的一点：类型系统只在编译时起作用，在编译为`js`之后，关于类型的定义会被擦除，因此不会出现在编译之后的`.js`文件中。

也就是说即使 `TS` 编译器在编译阶段检查出你的 `TS` 代码有各种的类型错误，只要你配置了对应的编译选项，它依旧可以编译为 `JS` 文件然后执行。比如在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    // 如果有任何类型检查的错误, 是否禁止编译出 js 文件
    // "noEmitOnError": false,
  }
}
```

### TypeScript 的类型系统（Coming Soon...）

参考：[Typescript 类型的本质是什么](https://juejin.cn/post/6997465633432535047#heading-7)

## 简单上手

### IDE 的选择

`TypeScript` 最大的优势之一便是增强了编辑器和 `IDE` 的功能，包括代码补全、接口提示、跳转到定义、重构等。主流的编辑器都支持 `TypeScript`，这里推荐使用 [Visual Studio Code](https://code.visualstudio.com/)。

它是一款开源，跨终端的轻量级编辑器，内置了对 `TypeScript` 的支持。另外它本身也是[用 TypeScript 编写的](https://github.com/Microsoft/vscode/)。

下载安装：https://code.visualstudio.com/

### 安装 TypeScript

通过前文我们知道，我们编写的 `.ts` 是不能直接运行的, 它是先通过 `typescript complier(tsc)`编译为 `.js`之后才能执行。

那么如何获取 `tsc` 呢？

作为 `npm` 用户，我们可以通过 `npm install -g typescript`，安装 `typescript` 官方提供的包，其中内置 `tsc`。

### 编写和运行 TS 文件

新建一个`helloWorld.ts`

```ts
const info = 'hello world!!!'
function printInfo(info: string) {
  console.log(info)
}
printInfo(info)

export {}
```

然后在 `commoand` 中输入`tsc xxx/xxx/helloWorld.ts`。默认情况下，会在源文件的相同目录下出现一个和其同名的`.js`文件，比如我们这里就出现了一个`helloWorld.js`文件。

```js
'use strict'
exports.__esModule = true
var info = 'hello world!!!'
function printInfo(info) {
  console.log(info)
}
printInfo(info)
```

然后我们直接运行这个`.js`文件即可，`node xxx/xxx/helloWorld.js`。

### 通过 ts-node 直接运行 ts 文件

这里我们通过在命令行输入`npm install -g ts-node`全局安装`ts-node`这个包，然后直接`ts-node xxx/xxx/helloWorld.ts`，就能看到运行 `.ts`之后的结果。

注意的是：`ts-node`这个库依赖`typescript`这个库。

到这里我们大概也看的出来，其实 `ts-node` 本质上就是先通过 `typescript`这个库提供的 `ts-compiler`将 `.ts` 编译成 `.js`，然后再通过 `node`来执行`js`。

如果使用的编辑器是 `vscode`，那么你可以安装 `Code Runner`插件，然后结合 `ts-node`，

![codeRunner](/assets/tsLearn/basic/codeRunner.png)

就可以直接点击按钮运行对应的 `ts`文件了。

如果你想忽略编译异常，直接运行，可以进行如下配置：

```json
{
  "ts-node": {
    // 只转译，忽略 tsc 的编译异常
    "transpileOnly": true
  }
}
```

关于 `ts-node` 更多信息可以参考 [ts-node 官方文档](https://typestrong.org/ts-node/docs/)。

## JavaScript 到 TypeScript 的迁移（Coming Soon...）

参考：[js-ts 迁移指南](https://github.com/zhongsp/TypeScript/blob/dev/zh/tutorials/migrating-from-javascript.md)

这里常见的有两个方案:
1. 逐步将 `.js` 文件重写为 `.ts` 文件；
2. 如果重写成本太高，那也可以通过编写类型声明文件，来对 `.js` 提供类型的支持；

## 基础类型

`JS` 中数据类型分为两种, 分别是：原始数据类型`(Primitive data types)` 和对象/引用`(Object types)` 数据类型。

其中原始数据类型总共有 `7` 种，分别是: `number, string, boolean, null, undefined` 和 `ES6` 新增的 `symbol` 和 `ES10` 新增的 `bigInt`。

### 包装类

除了`null, undefined, symbol, bigInt`之外，其余每一个原始基础类型都有一个对应的包装类。

| 原始类型 | 包装类(引用类型) |
| -------- | ---------------- |
| number   | Number           |
| string   | String           |
| boolean  | Boolean          |

理论上，对于原始类型来说，它是没有属性可以访问的。那么如下的代码你是否会产生疑惑：

```ts
let str1: string = '1'
typeof str1 // string
// 依旧可以访问方法或者属性
str1.replace('1', '')
str1.length
```

这是因为`js`底层对于原始类型的数据访问属性有一个包装类的机制，就是先将其转换为对应的包装类，然后访问对应的属性或者方法，然后再转换回来。

因此这里我们要区分包装类和原始类型，他们不是一个东西。

然后关于包装类的构造器有两个用法，一个是 `new xxx()`，一个是`xxx()`，两者一般都能够类型强转，但是结果不同，前者结果是引用值类型，后者是原始值类型。

在 [boolean](#boolean) 这一章节中讲解示范中有案例。

### boolean

`Boolean(xxx)`和`new Boolean(xxx)`结果类型是不同的。前者是原始值类型，后者是引用值类型。

```ts
let bool1: boolean = true
let bool2: Boolean = new Boolean(true)
// (编译警告)error info: bool3 变量声明的类型为 原始数据类型 boolean, 但是值却是引用值类型, Boolean
// let bool3: boolean = new Boolean(true);

// 但是这里要注意的是, Boolean 如果不用 new 来调用而是直接当作函数调用, 那么相当于类型强转, 结果为原始类型 boolean, 而不是 Boolean
let bool3: boolean = Boolean(1)
```

### number

和`JS`一样，`TS`里的所有数字都是浮点数或者大整数 。 这些浮点数的类型是`number`， 而大整数的类型则是 `bigint`。 除了支持十进制和十六进制字面量，`TS`还支持`ECMAScript 2015`中引入的二进制和八进制字面量。

数字还可以通过`_`分隔，这样方便开发者看清楚数字的进制。

```ts
let num1: number = 1
// ES6 语法：  16 进制表示 0x(X) 开头
let num2: number = 0xaf
// ES6 语法： 2 进制表示 0b(B) 开头
let num3: number = 0b01
// ES6 语法: 8 进制表示 0o(O) 开头
let num4: number = 0o17

let num5: number = 10_00_00_000 // 100000000
```

### string

和`JS`一样，可以使用双引号（`"`）或单引号（`'`）表示字符串。`ES6`语法中还引入了新的特性，就是模板字符串（\`\`），通过反引号括起来，然后其中通过 `${}`来引用变量。

```ts
let str1: string = '1'
let str2: string = '哈'
// 模板字符串
let str3: string = `string---${str1}; string---${str2}`
```

### null 和 undefined

在 `TS` 中, `null` 类型的值只有 `null` 一个, `undefined` 类型的值只有 `undefined` 一个。`null`和`undefined`是其他大多数类型的子类型，因此可以直接赋值给别的类型。

```ts
console.log('null-type', typeof null) // null
console.log('undefined-type', typeof undefined) // undefined
let null1: null = null
let undef1: undefined = undefined
// 在 ts 中 null 和 undefined 可以作为其他大多数类型的子类型
// 虽说 null 和 undefined 类型的值只有他们一个, 上面的条件, 因此他们可以相互赋值, null 赋值给 undefined, undefined 赋值给 null...
let undef2: undefined = null
let undef3: null = undefined
// 同时也能赋值给 number 或者 string...等类型
let nullNum1: number = null
let undefStr1: string = undefined
```

然而，当你指定了`--strictNullChecks`标记，或者在`tsconfig.json`中进行了配置：

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

`null`和`undefined`就只能赋值给`any`和它们各自的类型（有一个例外是`undefined`还可以赋值给`void`类型）。 这能避免很多常见的问题。

```ts
// error info: 不能将类型'null'分配给类型 'number'.
let num1: number = null
// error info: 不能将类型'undefined'分配给类型'string'.
let str1: string = undefined
// error info: 不能将类型'null'分配给类型'void'.
let void2: void = null

// success
let void1: void = undefined
```

> 注意：我们鼓励尽可能地使用`--strictNullChecks`，但在本文中我们假设这个标记是关闭的。

## 其他常用类型

### top type 和 bottom type

`top type` 和 `bottom type` 是指一些类型的特征。

`top type` 类型最典型的例子就是： `any, unknown`，表示其他大多数类型能赋值给它。

`bottom type`类型最典型的例子有：`any, never, null, undefined`，表示它能赋值给其他大多数类型。

这里看的出来，`any`既是`top type`，又是`bottom type`，它基本放弃了`TS`的类型检查。

### void

其他类型的值不能赋值给`void`类型的变量，但是`null`和`undefined`可以，所以`void`一般是代表的是空这个概念。比如函数没有返回值。

```ts
// 这里我们先声明一个 void 类型的变量
let voidDemo1: void
// success
let voidDemo2: void = voidDemo1
// error-info, 不能将类型 'void' 分配给类型 'null'
// let nullDemo1: null = voidDemo1;
// error-info, 不能将类型 'void' 分配给类型 'number'
// let numDemo1: number = voidDemo1;

// 没有返回值的函数
function func(): void {}
```

### any

一般来说，一个变量在声明的一种确切的类型之后，是不允许在赋值为其他别的类型。

```ts
let str1: string
// error info 不能将类型 'number' 分配给类型 'string'
// str1 = 1;
```

但是有时候，我们会想要为那些在定义阶段还不清楚类型的变量指定一个类型。

这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。

那么我们可以使用`any`类型来标记这些变量。

```ts
let any1: any
any1 = 1 // 此时是 number 类型
typeof any1
any1 = '2' // 此时是 string 类型
type of any1
any1 = true // 此时是 boolean 类型
typeof any1
```

当一个变量不赋值，也不声名类型的值，默认就会被看作 `any` 类型。

```ts
// let any2 = 1 , 这里由于类型推断, any2 会被看作 number 类型
let any2 // 这里不赋值, 也不声明类型, 那么就会被看作 any 类型
any2 = 1
any2 = '2'
any2 = true
```

对于一个 `any` 类型的变量，它的属性或者方法的返回值默认情况下都是 `any` 类型。

因此在编译阶段，你可以任意通过该变量来访问任意属性，这是自由的，但是同时这也是危险的。因为这样会大大提升导致编译为`js`之后的各种运行时错误的可能性。

```ts
let any3: any = {
  name: 'xzq'
}
// 这个代码编译时 ts 并不会检查出错误, 但是当我们最终运行时, 这里就会由于访问不存在的属性而报错。
any3.run().fly().speed
```

总结一下：

一个值只要是 `any` 类型，它的属性或者方法的返回值默认情况下也是`any`类型，它就会完全跳过 `TS` 的编译阶段的类型检查。

那么此时此刻，对于这个变量来说和`JS`就区别不大了，这样会丧失掉`TS`的种种优点，比如降低了代码的可维护性等。因此我们对于`any`类型，要善用，但是不能滥用。

### array

在 `TS`中声明一个数组有多种方式。

#### 类型 + []

```ts
let arrNum1: number[] = [1, 2]
// error, ts 会有编译警告, info: 类型 'string' 的参数不能赋给类型 'number' 的参数
// arrNum1.push('1')

// 定义联合类型的数组时, 可以用括号将 联合类型 括起来, 例如: (type1 | type2 | ...)[]
let arrNumAndStr1: (number | string)[] = [1, '2']
arrNumAndStr1.push('1')
arrNumAndStr1.push(1)
```

#### 数组泛型

关于泛型，在后面细讲，这里只简单用来描述一下数组。

```ts
let arrStr1: Array<String> = ['1', '2']
arrStr1.push('1')
```

#### 接口定义

关于接口，这里我们只要知道它的一个作用是可以描述一个对象的形状即可，具体细节可以参考 [接口章节](#接口)，这里只简单用来描述一下数组。

在 `JS` 中, 数组也是一种对象, 因此可以用接口来描述，

```ts
// 但是这样会有一个问题, 就是我们需要描述 原生 Array 的方法, 不然无法调用其他方法
interface ArrBool {
  [index: number]: boolean
}
let arrBool1: ArrBool = [true, false]
// error, 编译警告,  ArrBool 类型上不存在 push 方法
// arrBool1.push()
```

#### 类(伪)数组

类数组和真正的数组的核心区别就是，数组的原型对象是`Array.prototype`，因此它具备一系列真正数组的特征，比如具有`push, splice, shift, unshift...`等方法。

而类数组的原型对象却不是`Array.prototype`，但是为什么将其称之为类数组呢，因为类数组具有以下几个特征和真正的数组类似：

1. 具有`length`属性；
2. 按索引方式存储数据；

常见的类数组有：`arguments`，`NodeList`，`HTMLCollection`等。

在 `TS`中如何声明一个类数组类型的变量呢？

```ts
function func1() {
  // error info: 类型 'IArguments' 缺少类型 'any[]' 的以下属性: pop, push, concat, join 及其他 26 项。
  // 用真实数组类型去接收类数组肯定不可取的, 因为类数组上缺少真正数组的很多方法
  let args: any[] = arguments
}

// 这里定义一个接口来描述类数组, 该接口要满足三个条件, 具备 length 属性, 具备一个索引项, 具备一个名为 callee 的函数
interface fakeArr {
  [index: number]: any
  length: number
  callee: Function
}

function func2() {
  let args: fakeArr = arguments

  // 其实 ts 内部有定义好的描述 arguments 的类型
  let args1: IArguments = arguments
}
```

### tuple(元组)

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

既然本质上也是数组，那么就可以通过 `array`的方式来访问元素或者调用`array`的`api`来操作元组。比如通过下标访问对应元素。

```ts
let tuple1: [string, number] = ['1', 1]

// 通过下标访问元素
tuple1[0] // '1'
// 调用 splice 方法改变自己
tuple1.splice(0, 1, '2') // ['2', 1]

// error info: 不能将类型 '[string, string]' 分配给类型 '[string]'。 源具有 2 个元素，但目标仅允许 1 个。
// let tuple2: [string] = ['1', '1']

// error info: 不能将类型 'string' 分配给类型 'number', '1' ---> number
// error info: 不能将类型 'number' 分配给类型 'string', 1 ---> string
// let tuple3: [number, string] = ['1', 1]
```

上面的例子看出来了，元组（数组）中的值的顺序和个数都必须和我们声明的类型完全吻合。

#### 越界元素

一般情况下，元组中元素的个数不能和类型中所对应的类型的个数不匹配。如果不匹配就会出现编译错误：

```ts
// success
let tuple6: [string, number, boolean] = ['1', 2, true]

// error info: 不能将类型'[string, number]'分配给类型'[string, number, boolean]'。源具有 2 个元素，但目标需要 3 个。
let tuple7: [string, number, boolean] = ['1', 2]

// error info: 不能将类型'[string, number]'分配给类型'[string, number, boolean]'。源具有 2 个元素，但目标需要 3 个。
let tuple8: [string, number, boolean] = ['1', 2, true, false]
```

但是我们可以数组中能够改变自身的方法`(push, splice...)`来增加或者减少元组中的个数（即使修改后和定义时的类型不符合）。

当然，这些方法的参数必须要满足元组定义时的所有类型的联合类型。

```ts
let tuple5: [string, boolean] = ['1', true]

// 常规方式无法添加越界元素, 比如在定义的时候, 或者通过索引直接添加都不可以
// error info: 长度为 '2' 的元组类型 '[string, boolean]' 在索引 '3' 处没有元素
// tuple5[3] = ['1']
// tuple5 = ['1', true, '1']

// 可以添加越界元素, 添加越界的方式只能通过 push, splice 等方法来加进去, 并且元素类型要是元组中定义好的每个数据类型的联合类型
// 比如这里的  string | boolean
tuple5.push(false)
tuple5.splice(0, 0, 'splice')
// null 是所有类型的子类型, 所以满足条件
tuple5.push(null)
// console.log(tuple5)  // [ 'splice', '1', true, false ]
```

### function

#### 函数的定义方式

在 `JS`中，函数有两种定义方式：

1. 函数表达式
2. 函数声明

```js
// 函数声明
function demo1() {}
// 函数表达式
let demo2 = function () {}
```

#### 函数类型的声明方式

一个函数是有输入和输出的，那么在`TS`中定义一个函数的类型的时候，也需要分别定义输入和输出的类型。

```ts
// 对于函数声明而言:
function demo1(name: string): number {
  return 1
}

// 对于函数表达式而言：
let demo2 = function (name: string): number {
  return 1
}
```

那么我们如何先声明一个函数类型的变量，然后对应赋值呢？

```ts
// 这里需要和 es6 中的箭头函数区分开来, 在 ts 的函数类型声明中, () 代表参数 => 后面代表返回值类型
let demo3: (name: string) => number
demo3 = function (name: string): number {
  return 1
}
```

还可以用<a href="#描述函数和数组的形状">接口描述函数的类型</a>，因为在 `js` 中函数也是一种对象。

```ts
interface DemoFunc {
  // 前面的括号是参数类型和个数, : 之后的是返回值的类型
  (name: string): number
}

let demo4: DemoFunc
demo1 = function (name: string): number {
  return 4
}
```

#### 可选参数

默认情况下，一个函数所定义的参数都是必须要传的。

```ts
function demo3(name: string, age: number): any {}
// error info: 应有 2 个参数，但获得 1 个。未提供 "age" 的自变量
// demo3('xzq')
demo3('xzq', 18)
```

如果你在定义函数的时候，对应某些参数觉得不是非必须的，那么这里可以用可选参数。

```ts
function demo33(name: string, age?: number) {}
// 这里的 age 就是非必传的
demo33('xzq')
```

可选参数必须在所有必选参数的后面。

```ts
// error info: 必选参数不能位于可选参数后
function demo333(name?: string, age: number) {}
```

#### 参数默认值

`TS` 会将函数中默认值识别为可选参数，还可以绕开可选参数不得在必选参数之前的限制：

```ts
function demo4(name: string = 'xzq', age: number) {}
```

这里和`ES6`的解构赋值差不多，都是传入`undefined`，将触发该参数等于默认值，`null`则没有这个效果。

```ts
demo4(undefined, 18) // name: xzq; age: 18
demo4(null, 18) // name: null; age: 18
```

参考：[ES6 函数参数默认值](https://es6.ruanyifeng.com/#docs/function#%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%9A%84%E9%BB%98%E8%AE%A4%E5%80%BC)

#### 剩余参数

如果你想实现一个 `sum`函数，只限制传入的参数的类型：只能是数字，不限制传入参数的个数。功能是将所有数字求和，然后返回。

这里就需要应用到剩余参数的概念。

```ts
// 剩余参数的类型都是 number 类型
function sum(...rest: number[]): number {
  return rest.reduce((prev, curVal) => prev + curVal, 0)
}

// error info: 类型 'string' 的参数不能赋给类型 'number' 的参数
// sum(1, 2, 3, '4')
sum(1, 2, 3, 4)
```

参数列表中只能有一个剩余参数，并且剩余参数必须在参数列表的最后一个。

```ts
// error info rest 参数必须是参数列表中的最后一个参数
// function sumDemo1(...rest: any[], name?: string){}
// function sumDemo2(...rest: any[], name: string){}
// function sumDemo3(...rest1: any[], ...rest2: any[]){}
```

参考：[ES6 函数 rest 参数](https://es6.ruanyifeng.com/#docs/function#rest-%E5%8F%82%E6%95%B0)

#### 函数重载

一般来说，函数名相同，函数参数可以不同，就是重载，`JS` 中天然支持重载，因为 `JS` 中对函数入参没有限制。

但是在`TS`中却不行。

在未使用重载的形式下，定义一个 `reverse`函数，我们希望在定义的时候，能够让`TS`知道这个函数的返回值，这样在使用的时候，我们就能得到`TS`类型系统帮助。

比如`TS`能够通过该函数返回值的类型给出一些语法提示，降低我们编写代码错误的可能性。

下面的这个例子，`TS` 无法判断该函数的具体返回值是什么类型的, 只有运行之后才知道。

```ts
function reverse(source?: string | number): string | number | void {
  if (typeof source === 'string') {
    return source.split('').reverse().join('')
  } else if (typeof source === 'number') {
    return Number((source + '').split('').reverse().join(''))
  }
}
let reverseStr1 = reverse('123')
```

![overload-01](/assets/tsLearn/basic/overload-01.png)

这里我们无法得到`IDE`的提示，因为`TS`无法得知该返回值是具体的什么类型。

因此我们这里我们需要提供更多的信息去让`TS`去推断该函数的返回值类型是什么，请看下面的例子：

```ts
// error 此重载签名与其实现签名不兼容, 这里是因为传入参数是 void , 而在实现中没有对应的参数类型
// function reverse(souce: void): void
// 前面是函数的定义
function reverse(source: string): string
function reverse(source: number): number
// 最后这个是函数实现, 函数的实现要满足前面所有的定义
function reverse(source: string | number): string | number | void {
  if (typeof source === 'string') {
    return source.split('').reverse().join('')
  } else if (typeof source === 'number') {
    return Number((source + '').split('').reverse().join(''))
  }
}

// 注意, 这里调用函数的时候, 会从上往下匹配, 只要上面的匹配到了, 那么下面的就不会去匹配, 而是直接去到具体实现的函数了
// 因此书写函数重载的时候, 记得先写精确的, 然后再写模糊的
let reverseStr1 = reverse('123')
console.log(reverseStr1)
let reverseStr2 = reverse(123)
console.log(reverseStr2)
```
这里我们定义了每一种入参对应的返回值类型。

`TS`类型系统会根据我们调用该函数时的入参来进行匹配上述多种的定义，并从中找出一种最符合条件的定义。

![overload-02](/assets/tsLearn/basic/overload-02.png)

调用函数时，根据从上往下匹配重载声明的原则，这个函数的调用会命中`function reverse(source: string): string`这个声明，因此`TS`推断其返回值为`string`，因此这里会有语法提示。

#### TS 函数中的 this

关于`JS`中的`this`，可以参考 [this 详解](https://lxchuan12.gitee.io/js-this/)。

在`JS`中，`this`的值在函数被调用的时候才会指定。 这是个既强大又灵活的特点，但是你需要花点时间弄清楚函数调用的上下文是什么。

但众所周知，这不是一件很简单的事，尤其是在返回一个函数或将函数当做参数传递的时候。

```ts
let obj1 = {
  name: 'xzq',
  createRun() {
    return function () {
      // 这里的 this 是 window, 在严格模式下，this为 undefined 而不是 window
      // 而在 TS 中默认采用的就是严格模式
      // 因此在运行时会有 error 出现,  TypeError: Cannot read properties of undefined (reading 'name')
      console.log(this.name + ' run')
    }
  }
}

const run = obj1.createRun()
// 此时没有调用者(或者看作调用者为 wnidow)
run()
```

解决这个错误的方法有很多，这里我们采用 [箭头函数](https://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0) 的方式绑定上下文的`this`：

```ts
let obj2 = {
  name: 'xzq',
  createRun() {
    return () => {
      // 在之前版本的 TS 中, 这里会警告你犯了一个错误, 如果你给编译器设置了--noImplicitThis 标记
      // 它会指出 this.name 里的 this 的类型为 any
      // 现在不会了, 现在推断 this 为 obj2
      console.log(this.name + ' run')
    }
  }
}

const run = obj2.createRun()
run()
```

参考：[TS this 参数使用场景](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/functions.md#this%E5%8F%82%E6%95%B0)

当你将一个函数传递到某个库函数里在稍后被调用时，你可能也见到过回调函数里的`this`会报错。

因为当回调函数被调用时，它会被当成一个普通函数调用，`this`将为`undefined`。

下文采用的方案在函数的参数列表中定义一个`this`参数。这样就可以在解决这个问题。

首先，库函数的作者要指定`this`的类型：

```ts
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void
}
```

`this: void`意味着`addClickListener`期望`onclick`是一个函数且它不需要一个`this`类型。 然后，为调用代码里的`this`添加类型注解：

```ts
class Handler {
  info: string
  onClickBad(this: Handler, e: Event) {
    // oops, used this here. using this callback would crash at runtime
    this.info = e.message
  }
}
let h = new Handler()
uiElement.addClickListener(h.onClickBad) // error!
```

指定了`this`类型后，你显式声明`onClickBad`必须在`Handler`的实例上调用。 然后`TS`会检测到`addClickListener`要求函数带有`this: void`。 改变`this`类型来修复这个错误：

```ts
class Handler {
  info: string
  onClickGood(this: void, e: Event) {
    // can't use this here because it's of type void!
    console.log('clicked!')
  }
}
let h = new Handler()
uiElement.addClickListener(h.onClickGood)
```

因为`onClickGood`指定了`this`类型为`void`，因此传递`addClickListener`是合法的。 当然了，这也意味着不能使用`this.info`. 如果你两者都想要，你不得不使用箭头函数了：

```ts
class Handler {
  info: string
  onClickGood = (e: Event) => {
    this.info = e.message
  }
}
```

这是可行的因为箭头函数使用外层的`this`，所以你总是可以把它们传给期望`this: void`的函数。 缺点是每个`Handler`对象都会创建一个箭头函数。 另一方面，方法只会被创建一次，添加到`Handler`的原型链上。 它们在不同`Handler`对象间是共享的。

### object

`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`bigint`，`symbol`，`null`或`undefined`之外的类型。

```ts
// 这里用 number 来示范

// 这里再一次印证了包装类那一章节的知识点
// error info: 不能将类型'number'分配给类型'object'
let obj1: object = 1
// error info: 不能将类型'number'分配给类型'object'
let obj2: object = Number(1)

// success
let obj3: object = new Number(1)

// 众所周知, typeof null === 'object', 但这只是 js 的历史遗留问题, 和 ts 中对 object 类型的判断并不会有影响
// error info: 不能将类型'null'分配给类型'object'
let obj4: object = null
```

### unknown

参考：[理解 TypeScript 中 any 和 unknown](https://zhuanlan.zhihu.com/p/104296850)

当我们在写应用的时候可能会需要描述一个我们还不知道其类型的变量。在这些情况下，我们想要让编译器以及未来的用户知道这个变量可以是任意类型。这个时候我们会对它使用 `unknown` 类型。

```ts
let notSure: unknown = 4
notSure = 'maybe a string instead'

// OK, definitely a boolean
notSure = false
```

这里看起来它和`any`很类似，他们都属于[top type](#top-type-和-bottom-type)。

但他们也是有区别的，比如一个 `unknown` 类型的变量，如果不对其进行类型的收缩（比如通过 [as 进行断言](#类型断言)），他是不能进行任何操作的：

```ts
let obj: any = 'any'
// success
obj.length

let obj1: unknown = 'unknown'
// error info: 类型'unknown'上不存在属性'length'
obj1.length
// success
;(obj1 as string).length
```

类型收缩的常用方式：[TS 类型收缩参考](https://mp.weixin.qq.com/s/Fi7RINtu71NuXM3GUmbiQQ)

### never

`never`类型表示的是那些永不存在的值的类型。 例如：

1. 总是会抛出异常的函数的返回值类型；

   ```ts
   function error(message: string): never {
     throw new Error(message)
   }
   ```

2. 根本就不会有返回值的函数的返回值类型；

   ```ts
   // 会被推断为 never, 因为按照 ts 的推断, 是永远不会运行到 return 语句的
   function move1(direction: 'up' | 'down'): never {
     switch (direction) {
       case 'up':
         return 1
       case 'down':
         return -1
     }
     return '永远不应该到这里'
   }
   ```

`never`类型的特点：

1. `never` 是任何类型的子类型, 并且可以赋值给任何类型；

2. 没有类型是 `never` 的子类型或者可以赋值给 `never` (除了 `never` 本身)，即使`any`也不可以赋值给`never`；

3. 在一个没有返回值标注的函数表达式或箭头函数中，如果函数没有 `return` 语句，或者仅有表达式类型为 `never` 的 `return`语句，并且函数的终止点无法被执行到（按照控制流分析），则推导出的函数返回值类型是 `never`；

   ```ts
   // 这里必须是函数表达式, 且没有 return 语句
   // 比如下面这个
   function func1() {
     while (true) {}
   }
   let void1 = func1() // 这里的返回值类型是 void
   
   // 正确示范
   const infiniteLoop = function () {
     while (true) {}
   }
   // never 被推断为 never 类型
   let never1 = infiniteLoop()
   
   // never 是任何类型的子类型, 并且可以赋值给任何类型
   let null1: null = never1
   let undefined1: undefined = never1
   let boo1: boolean = never1
   
   // error info: 不能将类型'any'分配给类型'never'
   let any1: any
   never1 = any1
   ```

4. 在一个明确指定了 `never` 返回值类型的函数中, 所有 `return` 语句 (如果有) 表达式的值必须为 `never` 类型，且函数不应能执行到终止点；

关于`never`目前我自己也没弄太清楚，大概用法可以参考：[TypeScript 中的 never 类型具体有什么用？](https://www.zhihu.com/question/354601204)

将其中的一个例子列举出来，比如当你有一个 联合类型`(union type)`:

```ts
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar
```

在`switch` 当中判断 `type`，`TS` 是可以收窄类型的` (discriminated union)`：

```ts
function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val
      break
  }
}
```

注意在 `default` 里面我们把被收窄为 `never` 的 `val` 赋值给一个显式声明为 `never` 的变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事改了 `All` 的类型：

```ts
type All = Foo | Bar | Baz
```

然而他忘记了在 `handleValue` 里面加上针对 `Baz` 的处理逻辑，这个时候在 `default branch` 里面 `val` 会被收窄为 `Baz`，导致无法赋值给 `never`，产生一个编译错误。所以通过这个办法，你可以确保 `handleValue` 总是穷尽 `(exhaust)` 了所有 `All` 的可能类型。

## 高级类型

参考：[TypeScript 高级类型及用法](https://juejin.cn/post/6985296521495314445#heading-11)

### 联合类型

联合类型`(Union Types)`，表示一个值可以为多个类型中的一种。

```ts
// 联合类型使用 | 分隔每个类型
// 这里的意思是 unionType1 变量可以为 string 或者 number 类型中的一种
let unionType1: string | number = '1'
unionType1 = 2
```

#### 访问联合类型的属性或者方法

由于 `TS` 在编译期间无法准确判断一个联合类型的值在赋值之前是什么类型，那么我们访问联合类型的值的属性或者方法时，只能访问其公共属性或者方法。

```ts
function func1(param1: string | number) {
  // error  虽说 number 上有 toFixed 方法, 但是 'string' 上不存在方法 'toFixed'
  // param1.toFixed()

  // success
  // 这里访问他们的公共属性或者方法就没问题
  console.log(`公共属性或者方法: ${param1.toString()}`)
}
```

联合类型在被赋值的时候，会被`TS`类型推论为其中一种类型。

```ts
let unionType2: number | string
// 在未被赋值之前, 无法被推断为某一类型, 这时只能调用联合类型的公共属性或者方法
// error, 此时未被推断为某一明确的类型
// unionType2.toFixed()
unionType2.toString()
// 此时它为 number 类型
unionType2 = 1
unionType2.toFixed()
// 此时它为 string 类型
unionType2 = '1'
unionType2.split('')
// unionType2.toFixed() // error, 此时为 string 类型, string 类型上没有 toFixed 方法
```

### 索引类型查询操作符(keyof)

对于任何类型 `T`， `keyof T` 的结果为 `T` 上已知的 **公共实例属性名**（非静态，公共） 的联合（或者看作，字符串字面量类型），因为我们知道一个对象的 `key`，除了 `symbol` 之外，都是 `string` 类型。

```ts
interface person {
  name: string
  age: number
}

type PersonProps1 = keyof person
// 上下等同
type PersonProps2 = 'age' | 'name'

// 这里的 personProps 可以等同于字符 'name' | 'age'
let personProp1: PersonProps1 = 'age'
let personProp2: PersonProps2 = 'name'
```

这里还有一个需要关注的点，那就是**公共实例属性名** （非静态，公共）这个特征，这个一般指的是`class`中的`public`修饰的属性（属性默认也是`public`的），类是可以看作一个类型的，具体请看<a href="#类看作接口">类看作接口</a>。

```ts
class Father {
  // 静态部分
  public static money = 100

  // 实例部分
  public name: string
  public age?: number

  private clothes1: string

  protected clothes2: string

  // 静态部分
  constructor(name: string, age?: number, clothes1?: string, clothes2?: string) {
    this.name = name
    this.age = age
    this.clothes1 = clothes1
    this.clothes2 = clothes2
  }

  // 静态部分
  public static fly(): void {
    console.log('fly')
  }

  // 实例部分
  public run(): void {
    console.log('run')
  }
}

// Fahter 类等同的类型就是  FatherInterface

interface FatherInterface {
  // Father 类中非静态的和公共的属性
  name: string
  age?: number
  run(): void
  // error info: 属性'clothes1'在类型'Father'中是私有属性，但在类型'FatherInterface'中不是
  // clothes1: string
  // 属性'clothes2'在类型'Father'中受保护，但在类型'FatherInterface'中为公共属性
  // clothes2: string
}

type FatherProps1 = keyof FatherInterface

// FatherProps1 和 FatherProps2 等同

type FatherProps2 = keyof Father

let fatherProps1: FatherProps1 = 'age'
let fatherProps2: FatherProps2 = 'run'
```

然后可以参考下图：

![keyof-01](/assets/tsLearn/basic/keyof-01.png)

![keyof-02](/assets/tsLearn/basic/keyof-02.png)

这里我们就看得出来`keyof class`和`keyof interface`差不多是等价的。

### 字符串字面量类型

支持字符串字面量类型（`String literal types`），用以限定只有指定的字符串才被允许，使用起来和枚举类型很相似，但前者更轻量一些。

```ts
// 垂直位置
type VerticalAlignment = 'top' | 'middle' | 'bottom'
// 水平位置
type HorizontalAlignment = 'left' | 'center' | 'right'

function setVerticalAlignment(verticalAlignment: VerticalAlignment): void {}
function setHorizontalAlignment(horizontalAlignment: HorizontalAlignment): void {}
```

然后当我们调用方法时，可以看到参数只能是我们定义的字符串类型的中的一种：

![stringLiteralTypes](/assets/tsLearn/basic/stringLiteralTypes.png)

那么这里如果我们需要设置一个位置的综合怎么办呢，一个位置的具体描述应该是由垂直位置+水平位置的组合而成的：

```ts
type PositionAlignment = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

function setPositionAlignment(positionAlignment: PositionAlignment) {}
```

这里我们发现需要额外定义一个`PositionAlignment`的类型，但是定义起来略显繁琐。

下面我们要讲的模板文本类型可以很好的解决这个问题。

#### 模板文本类型

关于模板文本类型：[TypeScript4.1 新增模板字符串类型](https://blog.csdn.net/weixin_43459866/article/details/109989449)。

```ts
// 直接将之前定义的字符串字面量类型拿过来用
type PositionAlignment = `${VerticalAlignment}-${HorizontalAlignment}`

function setPositionAlignment(positionAlignment: PositionAlignment) {}
```

![templateStringType](/assets/tsLearn/basic/templateStringType.png)

### 类型别名

类型别名指的就是给类型起一个新的名字（映射关系）。

语法是：`type xxx = 映射的类型`。

```ts
type aliasString = string // 给 string 取了一个别名(也就是 aliasString 可以映射到 string)

let str1: aliasString = '1'

type aliasFunc = (name: string, age?: number) => string

// 其实这里我们会发现, 对于 ts 的类型限制在函数类型限制而言, 只能推断出函数的返回值要和我们定义的类型相符合
// 对于入参的判断其实无法在编译期间做到, 比如这里的赋值依旧不会报错
let func1: aliasFunc = function () {
  // 如果不写 return '', 那么会有编译期间警告
  // 不能将类型 '() => void' 分配给类型 'aliasFunc'。 不能将类型 'void' 分配给类型 'string'。
  // return ''

  return ''
}
// 但是我们可以发现, 这里的 func1 的类型依旧是 aliasFunc --- (name: string, age?: number) => string
// 比如下面这个, 如果我们不传满足类型限制的参数就会编译警告
// func1()
func1('xzq', 18)
```

类型别名经常用在 [联合类型](#联合类型) 中。如下面的例子：

```ts
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): string {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}
getName('x')
// 这里发现我们传入的参数返回值是 null, 依旧不会编译警告
// 这里有点疑惑
getName(() => null)
// error info: 类型 'number' 的参数不能赋给类型 'NameOrResolver' 的参数
// getName(1)

// 上面类型别名的写法和这个等同
// 记住, 在联合类型中使用时，函数类型标记必须用括号括起来
function getName1(n: string | (() => string)) {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}

getName1('x')
getName1(() => null)
// error info: 类型 'number' 的参数不能赋给类型 'string | (() => string)' 的参数
// getName1(1)
```

## 常用内置对象

`JS` 有许多内置对象(`built-in objects`)，它们可以直接在 `TS` 中当做定义好了的类型。

内置对象是指根据标准在全局作用域（`Global`）上存在的对象。这里的标准是指 `ECMAScript` 和其他环境（比如 `DOM`）的标准。

`ECMA` 提供的内置对象：`Boolean, Object, Symbol, Function, Error...` 等，这里要和原始类型的意思不同，和原始类型的包装类类似。

```ts
let bool1: Boolean = true
let obj1: Object = {}
let symbol1: Symbol = Symbol()
let func1: Function = function () {}

// DOM 和 BOM 的内置对象: Document, HTMLElement, Event...
let document1: Document = document
let htmlEle1: HTMLElement = document.querySelector('a')
```

`TS` 核心库的定义文件中定义了大多数浏览器环境需要用到的类型，并且是预置在 `TS` 中的。

比如 `String.fromCodePoint` 的内置定义:

```ts
interface StringConstructor {
  fromCodePoint(...codePoints: number[]): string
  raw(template: { raw: readonly string[] | ArrayLike<string> }, ...substitutions: any[]): string
}

// 这里我们在实际使用的时候就能得到类型的检查
// error info: 类型 'string' 的参数不能赋给类型 'number' 的参数
// 期望参数是一个 number: [], 数字类型的数组, 这里我们却给了一个字符串
String.fromCodePoint('1')
```

注意，`TS` 核心库的定义中不包含 `Node.js` 部分。

因此如果我们用 `TS` 写 `Node` 的时候, 可以 `npm install @types/node --save-dev`，从 `@types/node` 中下载第三方书写的声明文件来获取类型上的提示。

## 类型推论, 类型断言, 类型别名

### 类型推论

`TS`有一个类型推论机制，在当我们没有显式定义类型的时候，`TS`的类型系统会根据现有的条件推导出一个类型。

一个值在声明的时候就会被确定为一个类型（不管是被显式声明，或者被类型推论），后续的赋值并不会影响它的类型

```ts
// 这里 str1 虽然没有被明确的声明一个类型, 但是会根据赋的值 'xzq', 然后被推断为 string 类型
let str1 = 'xzq'
// 这里可以看作
// let str1: string = 'xzq'

// 这里 str2 没有被显式声明类型, 同时也没有赋予初始值 --- 也就是没有可用于被类型推论的信息, 因此这里会被看作 any 类型
let str2
// 这里可以看作
// let str2: any;
```

### 类型断言

类型断言(`Type Assertion`) 可以用来手动指定一个值的类型。

有两种语法：

1. 值 `as` 类型；

2. `<类型>`值: 一般不用；

   第二种用法一般不用的原因有两个:

   1. 由于在 `tsx` 中,` <Foo>`也代表一个 `ReactNode（组件）`, 因此这种用法在 `tsx` 中不能用；

   2. 在 `TS` 中 `<xxx>` 也可能代表泛型；

因此我们一般使用第一种语法来类型断言: 值 `as` 类型。

#### 将联合类型断言为一种类型

```ts
// 将联合类型断言为一种类型, 方便我们调用具体的方法
interface Cat {
  name: string
  // 在接口中描述一个对象的方法
  run(speed?: number): void
}

interface Fish {
  name: string
  swim(speed?: number): void
}

function isFish(animal: Cat | Fish): boolean | void {
  // 这里如果不用断言, 我们只能调用 Cat 和 Fish 的公用属性或者方法, 不然就会编译报错
  // error info: 类型 'Cat | Fish' 上不存在属性 'swim'。类型 'Cat' 上不存在属性 'swim'。
  // return typeof animal.swim === 'function'

  // 这里我们就可以运用类型断言
  // return typeof (animal as Fish).swim === 'function'

  // 但是需要注意的是, 类型断言只能骗过 ts 的编译时检查而已, 并不能影响编译为 js 之后具体的运行时

  // 当传入的参数为 Cat 类型时, 这里虽然骗过了 ts 的编译器, 但是在实际运行时会发现并没有 swim 方法
  // error info: TypeError: animal.swim is not a function
  ;(animal as Fish).swim()
}

let cat1: Cat = {
  name: '小猫-1号',
  run() {}
}

isFish(cat1)
```

#### 将一个父类断言为一个更具体的子类

```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  // 狗叫
  bark() {}
}

function isDog(animal: Animal): boolean | void {
  return typeof (animal as Dog).bark === 'function'
  // 这里我们还可以运用 instanceof, a.instanceof(b), 这里的效果是看 a 的原型链上是否存在 b
  // 虽然这里运行时是可以的, 但是在 ts 编译时会报错, (在 ts 中, instanceof 和 typeof 好像有特殊用处)
  // 因此这里还是得用 as
  // return animal.instanceof(Dog)
}
```

#### 将一个父类型断言为一个更为具体的子类型

```ts
interface Animal {}
// 扩展接口, 具体后面细讲
interface Dog extends Animal {
  bark(): void
}
function isDog(animal: Animal): boolean | void {
  // 对于 interface , 类型在 ts 编译之后就会擦除, 因此当作一个实体来调用方法是不行的, 因此就不能用 instanceof, 而只能用 as 来断言了
  return typeof (animal as Dog).bark === 'function'
}
```

其实结合后文的<a href="#类看作接口">类看作接口（类型）</a>，你会发现，将父类断言为子类和将父类型断言为子类型是差不多的概念，因为类实际上也能代表类型（`interface`）。

#### 将其他类型断言为 any

在理想情况下, `TS` 的类型系统会运行良好, 每个值的类型都是精确而且具体的。

```ts
// 当我们在引用一个对象或者一个变量上不存在的属性时就会报错
let a: number = 1
// error info: 类型 'number' 上不存在属性 'length'
a.length
// 其实上述情况我们也能理解, 因为 number 类型上确实不存在 length 属性, 但是还有一种情况

// 在 window 上添加一个属性 prop1, 这明显不是错误的, 但是 ts 的类型系统会给出编译警告
// error info：类型 'Window & typeof globalThis' 上不存在属性 'prop1'
window.prop1 = 'xxx'
// 因此我们可以将 window 断言为 any, 这样就可以骗过 ts 的编译期类型检查
;(window as any).prop1 = 'xxx'
console.log((window as any).prop1)
```

这里要特别注意, 将一个变量断言为 `any`类型, 只能作为我们解决 `TS` 中类型问题的最后办法，如果滥用 `as any`，那么就丧失了 `TS` 类型检查的意义了。

而我们要做的就是，在类型的严格性和开发的便利性之间掌握平衡。

#### 将 any 断言为一个更具体的类型

比如我们在用别人的方法或者第三方的库时, 发现他们的方法返回值是 `any`，我们直接去修改源码不太稳妥, 我们可以在拿到其返回值时将其断言为一个我们需要的类型。

```ts
interface Demo {
  name: string
}
let demo: Demo = {
  name: 'xzq'
}
// 这种写法和上面的等同
// let demo: { name: string } = {
//   name: 'xzq'
// }

let cache: { [prop: string]: any } = {
  demo: demo
}

function getCacheData(key: string): any {
  // 需要给 cache 的属性名声明类型, 不然 ts 编译也会出问题
  return cache[key]
}

getCacheData('demo')(
  // 这里返回值是 any 类型, 因此无法获得 ts 的类型系统的帮助
  // 将 any 断言为 Demo 类型, 这样就能有提示了, 同时也提高了代码的可维护性
  getCacheData('demo') as Demo
).name
```

#### 类型断言的限制

这里总结为 2 条（假设这里存在 A 类型和 B 类型）：

1. A 能兼容 B，那么 A 就能断言为 B，B 也能被断言为 A

2. B 能兼容 A，那么 B 就能断言为 A，A 也能被断言为 B

也就是 A 类型和 B 类型双方只要能够存在兼容关系，那么双方就能互相断言。

那么兼容到底是什么意思呢？这里我们定义两个兼容的类型作为示范。

这里有一个关键的概念：`TS` 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

```ts
interface Father {
  name: string
}

interface Son {
  name: string
  age: number
}
```

这里我们看的出来，他们定义的时候并没有继承关系，但是 `TS` 并不会管他们定义时候的关系, 只会根据其最终的结构来判断其关系, 因此这里会被看作：

```ts
interface Father {
  name: string
}

interface Son extends Father {
  age: number
}
```

这里就能看作 `Father`兼容`Son`：

```ts
let son: Son = {
  name: 'xzq',
  age: 18
}

let father: Father = {
  name: 'xzq'
}

// Son 类型的值能够赋值给 Father 类型
let fatherSon: Father = son
// 反之则不可以
// error info: 类型 'Father' 中缺少属性 'age', 但类型 'Son' 中需要该属性
let sonFather: Son = father
```

总结一下兼容的特征：

1. 类型的表示范围上有一方将另外一方包含进去，可以理解为继承，父类型兼容子类型，一般是抽象兼容具体；
3. B 类型有的属性或者方法 A 类型一定有, 但是 A 类型有的 B 类型不一定有, 那么就可以看作 B 类型兼容 A类型；
2. A 类型的值能够赋值给 B 类型，那么就能理解为 B 类型兼容 A 类型；

因为 `Father`兼容`Son`，因此他们能够互相断言。

```ts
let son: Son = {
  name: 'xzq',
  age: 18
}
let father: Father = {
  name: 'xzq'
}

;(son as Father).name
;(father as Son).name
```

这里关于断言的限制是很有必要的，因为毫无限制的断言是很危险的，会大大增加代码运行时出错的可能性。

所以最后总结一下：

1. 联合类型可以被断言为其中一个类型；

2. 父类可以被断言为子类（父类型可以被断言为子类型）；

3. 任何类型都可以被断言为 `any`；

4. `any` 可以被断言为任何类型；

5. 要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可 （前面 4 种分类的本质）；

#### 双重断言

`any`同时作为 [top type 和 bottom type](#top-type-和-bottom-type)，这意味着`any`和其他任意类型都相互兼容（能够赋值给其他大多数类型，其他大多数类型都能赋值给它）, 那么就意味着 `any` 可以与其他任意类型进行相互断言。

```ts
let num11: number = 1
// ;(num11 as string) // 直接断言为 string 是肯定不行的, 因为 number 类型和 string 类型并不兼容
// ;(num11 as any as string) // 这样就骗过了 ts 的类型系统, 但是一般不要这么用双重断言, 大概率运行时会报错
```

慎用！！！

#### 类型断言和类型转换的区别

类型断言只是在编译期间用来对付 `TS` 的类型系统的，在运行时都会被擦除，因此不能实际影响到运行时。

```ts
// function getBoolean(param: any): boolean {
//   return param as boolean
// }
// console.log(getBoolean(1)) // 结果为 1, 并不会变为真的 boolean 类型

function getBoolean(param: any): boolean {
  return Boolean(param)
}
console.log(getBoolean(1)) // 结果为 true, 实际上的类型转换
```

#### 类型断言和类型声明的区别

```ts
let father1: Father = {
  name: 'xzq'
}

let son1: Son = {
  name: 'xzq',
  age: 18
}

// 因为 Father 兼容 Son, 因此 Fahter 类型可以和 Son 类型相互断言

// Father 类型断言为 Son 类型
let son2 = father1 as Son
// 上面这种类型断言的写法等同于下面这种类型声明的写法(只有在 Father(声明的变量的类型) 兼容 Son 类型的时候才可以)
let father4: Father = son1

// Son 类型断言为 Father 类型
let father3 = son1 as Father
// 因为 Son 类型不兼容 Father, 因此不能把 Father 类型直接赋值给 Son 类型
// 这里就看得出来, 类型断言的条件比类型声明更加严格
// error info: 类型 'Father' 中缺少属性 'age'，但类型 'Son' 中需要该属性。
// let son3: Son = father1
```

这里就看的出来两者的区别：

1. 对于类型断言而言，A 类型兼容 B 类型 或者 B 类型兼容 A 类型，两种任意满足一个条件就能使得 A 类型和 B 类型相互断言；
2. 对于类型声明而言，只有 A 类型 兼容 B 类型，那么 B 类型才能被赋值给声明为 A 类型的变量；

因此类型声明的条件比类型断言更加严格；一般而言推荐使用类型声明，更加安全和更加优雅。

#### 类型断言和泛型

灵活定义一个函数的返回值类型, 然后根据需要获取确定的返回值类型, 除了用 `any` 作为返回值类型然后通过类型断言之外的方法外，还有泛型这种方式。

```ts
interface Animal1 {
  name: string
}

let animal: Animal1 = {
  name: 'xzq'
}

function getAnimal1<T>(animal: any): T {
  return animal
}

function getAnimal2(animal: any): any {
  return animal
}

getAnimal1<Animal1>(animal)
// 这两种写法效果相同
getAnimal2(animal) as Animal1
```

## 接口

在传统面向对象的语言中，接口（`interface`）是一种规范的定义，它定义了行为和动作的规范，在程序设计里面，接口起到一种限制和规范的作用。

接口定义了某一批类所需要遵守的规范，它不关心这些类的内部状态数据，也不关心这些类里方法的实现细节，它只规定这批类里必须提供某些方法，提供这些方法的类就可以满足实际需要。

总结一下：在传统面向对象的语言中，接口一般是对行为的抽象，具体实现交由类去实现（`implement`）。

而在 `TS`中，接口的概念在原有的基础上被拓展了：

1. 对行为进行抽象；
2. 通过接口 (`interface`) 来定义（描述）对象的形状（`Shape`） -- 类型；

### 描述对象的形状

`TS` 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做'鸭式辨型法'或'结构性子类型化'，这种思想是建立在 [鸭子类型（duck typing）](https://forrestsu.github.io/posts/go/duck-type/) 上的。

在这里，接口的其中一个作用就是为这些类型命名。

举一个简单的例子：

```ts
// 描述一个对象的形状, 里面必须要有 name 和 age 属性, 并且 name 为 string 类型, age 为 number 类型
// 属性不能多也不能少, 类型也不能错
interface Person {
  name: string
  age: number
}

const person1: Person = {
  name: 'xzq',
  age: 18
}
```

如果该对象的形状不符合我们接口所定义的，那么`TS`会检查出错误：

```ts
// error info: 缺少 age 属性
// const person2: Person = {
//   name: 'xzq'
// }

// error info: 多了一个 run 方法
// const person2: Person = {
//   name: 'xzq',
//   age: 18,
//   run() {}
// }
```

还有一点就是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以：

```ts
const person1: Person = {
  age: 18,
  name: 'xzq'
}
```

#### 可选属性

有些时候，某个接口中的属性不一定全部都是必须的，我们只想根据真实的情况传入部分属性，这个时候就可以利用到可选属性（`option bags`）。

```ts
interface Animal {
  name?: string
  age: number
}

// 这里 name 可要可不要
let dog: Animal = {
  // name: '小狗',
  age: 18
}

// 当然, 仍然不允许添加为定义的属性
// error
// dog.gender = 'male'
```

#### 可索引的类型

> 为了方便理解，后面我们都称之为动态（任意）属性

有些时候，我们希望能够根据条件任意传入一个或者多个属性，这个时候，就需要利用到动态属性：

```ts
// 如果想定义一个任意属性, 这里可以结合类似于 ES5 的动态属性名 [propName] 的方式来定义接口
interface Person1 {
  name: string
  // 这里的属性名 propName1 必须是 string 类型, 类似于函数的形参, 可以是其他任意字符串 , 然后值是 string 类型
  // 它可以匹配所有属性类型符合的属性
  [propName1: string]: string
}

// 一个任意属性可以对应一个对象上的多个属性, 比如这里的 xxx 和 xx
// 前提是属性的类型要要一致
let person2: Person1 = {
  name: 'xzq',
  xxx: 'xxx',
  xx: 'xx'
}
```

对于动态属性的类型`TS`有所限制，这里我们引入一个概念，同类型属性（其他同一类型的属性名）。

对于同类型属性，动态属性对应的值的类型表示的范围要大于等于其它非动态属性的值的类型所表示的范围。这里我们把前者的类型看作 `A` 后者的类型看作 `B`，那么抽象一下就是：`B extends A`

还能理解为`B`类型的值能够赋值给`A`类型的值：`let param1: A = (param2 as B)`：

```ts
interface Person2 {
  name: string
  age?: number
  // 这里非动态的同类型属性有: name, age, 他们的类型可以看作 string | number
  // 那么我们这里动态属性的类型只要能兼容 string | number 类型即可, 比如 any, string | number等
  // error info: 这个 string 代表了其他属性值的类型只能是 string 类型, number 无法被赋值给 string 类型
  // [prop: string]: string

  // success
  [prop: string]: string | number
}

interface Person3 {
  name: string
  age?: number
  // 任意属性的属性值的类型的对其他属性的限制只存在于属性名类型和其相同的属性上
  // 例如这里的任意属性名的类型为 number, 那么它就影响不到 name 和 age 属性
  [prop: number]: string
}
```

动态属性名的类型`TS`只支持 `4` 种，`string, number, symbol, 模板文本类型`，关于模板文本类型，具体请参考：<a href="#模板文本类型">模板文本类型</a>。

```ts
interface Person {
  [propName1: string]: string
  [propName2: number]: string
  [propName3: symbol]: number
  // 索引签名参数类型必须是 'string'、'number'、'symbol'或模板文本类型
  [propName4: boolean]: string
}
```

在 `JS`中，我们知道，一个对象的属性只能是字符串，如果传入其他类型的属性值，也会被对应类型的`toString`给转换为字符串类型（除了 `Symbol`）。

```js
// .js
let objProp1 = {}
let objProp2 = { name: 'xzq' }
objProp1.toString() // [object Object]
objProp2.toString() // [object Object]

let symbolProp1 = Symbol()
symbolProp1.toString() // Symbol()

let arrProp1 = []
let arrProp2 = [1, 2]
arrProp1.toString() // ''
arrProp2.toString() // '1,2'

const demoObj1 = {
  name: 'xzq',
  [symbolProp1]: 'symbol',

  // 这两个算作同名属性, 属性名都为 [object Object], 因此后面定义的属性会把前面的给覆盖
  // Object.prototype.toString
  [objProp1]: 'obj1',
  [objProp2]: 'obj2',

  // Array.prototype.toString
  [arrProp1]: 'arr1',
  [arrProp2]: 'arr2'
}
demoObj1['[object Object]'] // 'obj2'

demoObj1['Symbol()'] // undefined
demoObj1[symbolProp1] // 'symbol'

demoObj1[''] // 'arr1'
demoObj1['1,2'] // 'arr2'
```

因此当属性名定义为`number, string`，能够通过同样的方式获取到。

一个接口可以存在多个动态属性，但是有几个限制：

1. 不能存在同类型的动态属性，这里其实也能理解，如果多个同类型的属性的话，`TS`将无法区分这些属性：

   ```ts
   // error info: 类型'string'的索引签名重复
   // interface Person4 {
   //   [prop1: string]: object,
   //   [prop2: string]: string,
   // }
   ```

2. 后面定义的动态属性的值的类型必须要能被赋值给前面定义的任意属性的值，也就是前者的类型要兼容后者的类型。假设前者的类型为`A`，后者的类型为`B`，`let param1: A = (param2 as B)`：

   ```ts
   interface Person5 {
     [prop1: string]: string
     // error info: number 无法赋值给 string
     // [prop2: number]: number
   
     // 前面我们知道 null 或者 undefined 是任意类型的子级, 他们可以被赋值给任意类型
     [props: number]: null
   }
   ```

#### 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，其他地方不能再重新赋值，那么可以用 `readonly` 定义只读属性：

```ts
interface Person6 {
  readonly id?: string
  name: string
  age?: number
  [prop: string]: any
}

let person6: Person6 = {
  id: '1',
  name: 'xzq',
  age: 18
}
// error, 编译警告, 无法赋值给 'id' ，因为它是只读属性。
// person6.id = 'xx'
```

在定义对象的时候，即使没有给只读属性赋值，`TS`也会看作这里有一个`undefined`的初始值，在定义之后同样不能再次赋值：

```ts
// id 是可选属性, 因此这里可以不用赋初始值
// readonly 属性这里会看作有一个  id: undefined, 然后其他地方依旧不能再次赋值
let person66: Person6 = {
  name: 'xzq'
}

// error, 虽然在对象定义的时候没有 id 属性, 但是这里依旧会报错, 因为 readonly 属性只能在对象定义的时候赋值, 其他时候类似于属性赋值都不可以
// person66.id = 're-assign'
```

#### 描述函数和数组的形状

这里我们知道，函数和数组其实也是对象的一种：

```ts
// 这里还可以用接口定义函数的类型(在 js 中函数也是一种对象)
interface DemoFunc {
  // 前面的括号是参数类型和个数, : 之后的是返回值的类型
  (name: string): number
}

let demo1: DemoFunc
demo1 = function (name: string): number {
  return 1
}

// 但是这样会有一个问题, 就是我们需要描述 原生 Array 的方法, 不然无法调用其他方法
interface ArrBool {
  [index: number]: boolean
}
let arrBool1: ArrBool = [true, false]
// error, 编译警告,  ArrBool 类型上不存在 push 方法
// arrBool1.push()
```

#### 接口描述混合类型

有时候我们希望一个对象的类型既是函数，同时又具备它自身的属性和方法，比如：`jQuery`。在`TS`中有很多种方式实现这种效果，这里我们采用用接口来描述这一混合类型的方式。

```ts
interface jQuery {
  // 这行定义表明接口 jQuery 是一个函数的形状
  (id: string): HTMLElement
  // 这个定义表明接口 jQuery 具有一个 each 方法
  each<T>(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
}

function getJQuery(): jQuery {
  const tmp = (id: string) => document.getElementById(id)
  tmp.each = Array.prototype.forEach
  return tmp
}

const jQuery: jQuery = getJQuery()
jQuery('id')
jQuery.each(() => 'x')
```

### 对行为进行抽象

> 其实这里从本质上能看作一个接口对一个类的形状的描述。
>
> 只不过具体使用由之前的 `A:interface` 变成了 `A implements interface`。

```ts
interface Usb {
  name: string

  // 接口中的方法, 默认就是 abstract, 所以不能显式添加 abstract 来修饰
  // abstract transferFiles()

  transferFiles()
}

// 表明一个类里面必须要有 name 属性和 transferFiles 方法
// 对于接口中的方法, 类中具体还必须得是实现
class Computer implements Usb {
  name: string
  transferFiles() {
    console.log('pc 传输文件')
  }
}
```

接口中定义的方法默认就是抽象方法，不需要`abstract`修饰：

```ts
interface Usb {
  // error
  transferFile(): void
}

interface Usb {
  // success
  transferFile(): void
}
```

抽象方法是不可以有具体实现的：

```ts
interface Usb {
  // error
  transferFile(): void {
    console.log('传输文件')
  }
}
```

## 类

`TS`中的类的用法是基于`ES6`中类的定义，因此建议先参考：[ES6-class](https://es6.ruanyifeng.com/#docs/class)。

这里我们着重讲解的是`TS`中类相比于`ES6`中不同的点。

### 显式定义属性

```ts
class Person1 {
  public name
  constructor(name: string) {
    // 和在 ES6 中不同的是: 在 ts 中是需要显式声明该类有哪些属性的
    // error info: 类型 'Person1' 上不存在属性 'name'
    // this.name = name
  }
}
```

### 访问修饰符

`TS`有三种访问修饰符：

1. `public`，在`TS`中成员默认就是`public`，对访问没有限制；
2. `protected`，在自己和子类里面能够访问，其他的外界也无法访问；
3. `private`，只有自己里面能够访问，外界都无法访问；

修饰符能够用来修饰属性，方法，构造函数的参数。

```ts
type Gender = 'male' | 'female'

class Father {
  // 修饰符修饰属性
  public name
  protected age
  private gender
  // 等同于   gender: 'male' | 'female'
  constructor(name: string, age: number, gender: Gender) {
    this.name = name
    this.age = age
    this.gender = gender
  }

  // 修饰符修饰方法
  private print1(xxx: string) {
    // 在类的内部, 这三个属性都能访问
    console.log(this.name)
    console.log(this.age)
    console.log(this.gender)
  }

  // 如果不添加修饰符, 默认是 public
  print2() {}
}

let father1 = new Father('xzq', 18, 'female')
father1.name
father1.print2()
// 这里的错误信息只是会在 ts 编译的时候提示出错误信息, 实际在编译之后的 js 文件中, 依旧是能够运行调用的
// error info: 属性 'print1' 为私有属性，只能在类 'Fahter' 中访问
// 外界无法访问 private
// father1.print1()
// 外界无法访问 protected
// error info: 属性 'age' 受保护，只能在类 'Fahter' 及其子类中访问
// father1.age

class Son extends Father {
  // 如果构造方法被 private 修饰, 则外界无法实例化这个类
  private constructor(name: string, age: number, gender: Gender) {
    super(name, age, gender)
  }
  printSon1() {
    // 在继承的类里面, 能够访问到父类的 protected 修饰的属性或者方法
    console.log(this.age)
  }
}
// 类 'Son' 的构造函数是私有的，仅可在类声明中访问
// error info:
// let son1 = new Son('xzq', 18, 'male')
// son1.name
// son1.print2()
// 外界依旧不能访问
// son1.age
```

一个类的构造器如果被`private`修饰，那么意味着它无法被外界实例化，因为被`private`修饰的属性或者方法无法在外界被访问到：

```ts
class Son extends Father {
  // 如果构造方法被 private 修饰, 则外界无法实例化这个类
  private constructor(name: string, age: number, gender: Gender) {
    super(name, age, gender)
  }
}
```

### 只读修饰符

```ts
class Person5 {
  public readonly name: string
  constructor(name: string) {
    this.name = name
  }
}
let person5 = new Person5('xzq')
// error info: 无法分配到 'name' ，因为它是只读属性
person5.name = 'xzq'
```

### 修饰符结合构造函数

通过前文得知，修饰符还能够修饰构造函数的参数，这里其实是一种语法糖：

```ts
class Person5 {
  public readonly name: string
  protected age?: number
  constructor(name: string, age?: number) {
    this.name = name
  }
}

// 上下两种写法是等价的, 后者是前者的语法糖, 省略了在类中显式声明属性的定义, 直接在构造函数中定义了

class Person6 {
  // 'public' 修饰符必须位于 'readonly' 修饰符之前
  // constructor(readonly public name: string) {
  //   this.name = name
  // }
  constructor(public readonly name: string, protected age?: number) {
    this.name = name
    this.age = age
  }
}
```

### 抽象类

通过 `abstract` 关键字定义抽象类，同时 `abstract` 还可以可以定义抽象方法，抽象方法只能定义在抽象类和接口中，接口中的抽象方法是不需要`abstract`来修饰的。

抽象类中可以有具体实现的方法。

抽象类无法被实例化，即使它的构造器外界可以访问，子类继承它，就必须要实现抽象类中定义的抽象方法。

```ts
abstract class Animal {
  public name: string
  public constructor(name: string) {
    this.name = name
  }

  // 被 abstract 修饰的方法不能被具体实现
  // error info: 方法 'run' 不能具有实现，因为它标记为抽象
  abstract run()

  // 抽象类中可以有具体实现的方法, 这个方法可以不用被子类给实现
  eat() {
    console.log('eat')
  }
}

// 抽象类无法实例化, 即使 构造函数是可以访问的
// error info: 无法创建抽象类的实例
// new Animal()

// 如果没有 run 方法, 就会有如下错误信息
// error info: 非抽象类 'Dog' 不会实现继承自 'Animal' 类的抽象成员 'run'
class Dog extends Animal {
  // 这个抽象方法必须得实现, 不然编译会出现警告
  run() {
    console.log('dog run')
  }

  // 虽说这个方法不是必须实现的, 但是我们可以按照自己意愿选择是否重写父类的该方法
  eat() {
    console.log('dog-eat')
  }
}

new Dog('小黑').eat() // dog-eat
```

## 类和接口

### 类的静态部分和实例部分

一个类的属性和方法可以分成两部分，分别是实例部分和静态部分，前者属于类的实例，后者属于类本身（可以看成生命周期不同）。

而类上面关于类型相关一般指的都是类的公共（`public`）实例这一部分：

```ts
class Father {
  // 静态部分
  public static money = 100

  // 实例部分
  public name: string
  public age?: number

  // 私有实例部分
  private clothes1: string

  // 受保护的实例部分
  protected clothes2: string

  // 静态部分
  constructor(name: string, age?: number, clothes1?: string, clothes2?: string) {
    this.name = name
    this.age = age
    this.clothes1 = clothes1
    this.clothes2 = clothes2
  }

  // 静态部分
  public static fly(): void {
    console.log('fly')
  }

  // 实例部分
  public run(): void {
    console.log('run')
  }
}
```

### 类看作接口

当我们定义一个类的时候，还可以将其当作一个类型（`interface`）来使用，这个`interface`中有这个类中所有的公共（`public`）实例部分。

```ts
// 这个 FatherInterface 就是 class Father 对应的类型
// 看得出来, 里面忽略的这个类的静态部分
interface FatherInterface {
  name: string
  age?: number
  run(): void
  // error info: 属性'clothes1'在类型'Father'中是私有属性，但在类型'FatherInterface'中不是
  // clothes1: string
  // 属性'clothes2'在类型'Father'中受保护，但在类型'FatherInterface'中为公共属性
  // clothes2: string
}

const father1: FatherInterface = new Father('xzq')
const father2: Father = new Father('xzq')
```

### 类继承类

一个类只能直接继承一个类：

```TS
class Father1 {}
class Father2 {}
// error info: 类只能扩展一个类
class Son1 extends Father1, Father2 {}
```

继承之后，会分别继承父类的实例部分和静态部分，但是构造器不会被继承。

子类如果没有写构造器，那么默认会自动先调用父类的构造器。

子类如果写了构造器，那么需要在构造器中最先调用父类的构造器。

```ts
class Father1 {
  public static money: number = 100
  public name: string
  constructor(name: string) {
    this.name = name
  }
}

// 里面没写构造器, 默认会自动先调用父类的构造器
class Son1 extends Father1 {}
// 继承实例部分
new Son1('xzq').name // 'xzq'
// 继承静态部分
Son1.money // 100

class Son2 extends Father1 {
  // error info: 派生类的构造函数必须包含 'super' 调用
  constructor() {}
}

// success
class Son3 extends Father1 {
  constructor(name: string) {
    super(name)
  }
}
```

### 类实现接口

类实现接口可以看作这个接口描述了这个类的形状，也就是说这个接口描述的形状，该类必须要符合：

```ts
interface Usb {
  name: string

  // 接口中的方法, 默认就是 abstract, 所以不能显式添加 abstract 来修饰
  // abstract transferFiles()

  transferFiles()
}

// 表明一个类里面必须要有 name 属性和 transferFiles 方法
// 对于接口中的方法, 类中具体还必须得是实现
class Computer implements Usb {
  name: string
  transferFiles() {
    console.log('pc 传输文件')
  }
}
```

一个类可以实现多个接口：

```ts
interface HDMI {
  // 传输视频
  transferVideo(): void
  // 传输音频
  transferAudio(): void
}
interface USB {
  // 传输文件
  transferFile(): void
}

class Computer implements HDMI, USB {
  transferFile(): void {}
  transferVideo(): void {}
  transferAudio(): void {}
}
```

### 接口继承接口

接口继承接口和类继承类基本没什么区别，因为我们知道类在某种概念上就是一个描述类型的接口（[类可以看作接口](#类看作接口)）：

```ts
// 这里继承了 HDMI 接口的 transferVideo 和 transferAudio 方法
interface Typec extends HDMI {
  // 自身的方法: 充电
  charge(): void
}

class Computer implements Typec {
  charge(): void {}
  transferVideo(): void {}
  transferAudio(): void {}
}
```

### 接口继承类

之前我们讲过，[类可以看作接口](#类看作接口)，因此这里就和接口继承接口又差不多了：

```ts
class Usb {
  public static version: string = '3.0'

  public name: string

  constructor(name: string) {
    this.name = name
  }

  // 传输文件
  transferFile(): void {
    console.log('传输文件')
  }
}

interface Typec1 extends Usb {}

class Computer1 implements Typec1 {
  public name: string
  transferFile(): void {}
}

// 上下等同

// 会忽略类中的静态部分, 将类中实例部分抽取作为接口中描述的类型
interface UsbInterface {
  name: string
  transferFile(): void
}

interface Typec2 extends UsbInterface {}

class Computer2 implements Typec2 {
  name: string
  transferFile(): void {}
}
```

## 泛型

泛型(`Generics`)，是指在定义类，接口，函数的时候不预先把类型定死。

而是留下传参( `<T>`, 这里参数是类型 )入口，在使用类，接口，函数的时候传入指定的类型，这样可以提高灵活性和复用性。

### 泛型函数

下面来创建第一个使用泛型的例子：`identity`函数。 这个函数会返回任何传入它的值。

```ts
function identity(arg: any): any {
  return arg
}
```

我们为了这个函数能够支持多种类型的入参，因此将入参的类型和返回值指定为`any`。

但是这样就产生了一个很明显的缺陷，就是我们在获取这个函数的返回值时，`TS`在编译期间时无法检测出其具体是什么类型，也就是在传参之后，丢失了类型信息。

因此我们需要一种机制能够使返回值的类型与传入参数的类型是相同的，请看下面的例子：

```ts
// 在 functionName 和 后面传参的小括号之间定义 类型变量
function identity<T>(arg: T): T {
  return arg
}

// 这里我们类似传参, 给 T 变量赋值为 'string' 类型, 在函数的其他地方可以使用这个变量来代表 string 类型
identity<string>('1')
```

上面我们引入了类型变量的概念，它不是一个实体的概念，编译之后就会被擦除，但是我们依旧可以在编译之前将它当作一个变量来使用，只不过它代表的是一个类型而不是某个实体的值。

### 类型变量

类型变量有两种使用情况：

1. 我们可以使用类似传参的方式，直接给这个类型变量指定某种类型，在后续的地方就可以直接使用这个我们定义好的类型变量：

   ```ts
   function fillArr2<T>(length: number, value: T): T[] {
     return new Array(length).fill(value)
   }
   // 给类型变量传入指定的类型
   const arr2 = fillArr2<string>(2, 'x')
   ```

2. 不给类型变量传参，而是让`TS`自己去根据实际情况来推断这个类型变量是什么类型：

   ```ts
   function fillArr2<T>(length: number, value: T): T[] {
     return new Array(length).fill(value)
   }
   // TS 通过 'x' 判断出 value 类型为 string, 然后推断出类型变量 T 为 string
   const arr2 = fillArr2(2, 'x')
   ```


这里我们还可以传入多个泛型变量：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}
// 这里可以传入指定泛型类型
swap<string, number>(['1', 2])

// 当然也可以不传指定泛型类型, 那么 TS 就会自动去推断泛型的值
// 比如这里 TS 的推论结果为: T 为 boolean, U 为 number
swap([true, 1])
```

### 泛型类型(接口)

假设我们需要实现定义好一个类型的变量来接收一个泛型函数该怎么写：

```ts
let arrFunc3: <T>(length: number, value: T) => T[]
arrFunc3 = function fillArr3<T>(length: number, value: T): T[] {
  return new Array(length).fill(value)
}
```

或者通过通过对象（接口）类型的形式来定义：

```ts
let arrFunc3: { <T>(length: number, value: T): T[] }
arrFunc3 = function fillArr3<T>(length: number, value: T): T[] {
  return new Array(length).fill(value)
}
```

这里我们就可以将其类型抽取为一个接口：

```ts
// 这种泛型定义在接口上, 就不用重复定义在函数上
interface FillArr2<T> {
  (length: number, value: T): T[]
}

// 和其他泛型参数非必传, 可以让 ts 自己来推断不同的是, 泛型接口的参数必须要传
// 直接限定后面函数的泛型的类型
let arrFunc4: FillArr2<string>
arrFunc4 = function fillArr3<T>(length: number, value: T): T[] {
  return new Array(length).fill(value)
}
```

还有一种写法，下面这种写法的缺点是无法在定义类型的时候，直接定义好泛型是什么类型：

```ts
interface FillArr1 {
  // 接口中函数的泛型定义在括号前面, 其实也能理解, 泛型在 functionName 和 () 之间
  // 这里没有 functionName, 那么在 () 之前相对位置也是对的
  <T>(length: number, value: T): T[]
}

// 这里无法限定后面的 T 是什么类型, 除非在接口内部去改
let arrFunc3: FillArr1
arrFunc3 = function fillArr3<T>(length: number, value: T): T[] {
  return new Array(length).fill(value)
}
```

除了泛型接口，我们还可以创建泛型类。 注意，无法创建泛型枚举和泛型命名空间。

### 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（`< >`）括起泛型类型，跟在类名后面。

先指定好类型变量，然后在类的内部就可以将其进行使用：

```ts
class Person1<T, U> {
  name: T
  age: U
  getName(): T {
    return this.name
  }
  getAge(): U {
    return this.age
  }
}
```

### 泛型约束

有些时候我们需要能够提前知道类型变量的一些信息。

比如下面的场景，我们需要获取参数的长度，但是这里会发现出现编译警告，这是因为`TS`当前无法判断该泛型是否有`length`属性：

```ts
function getParamLength<T>(param1: T): number {
  // 这里会有编译警告
  // error info: 类型 'T' 上不存在属性 'length'
  return param1.length
}
```

因此这里我们需要限制一下传入的参数的类型，或者说限制一下泛型的类型，让其至少拥有`length`属性。这里就需要用到`extends`关键字：

```ts
interface LengthObj {
  length: number
}

function getParamLength1<T extends LengthObj>(param1: T): number {
  // 这里我们指定了泛型的约束, T 继承于接口 LengthObj
  return param1.length
}
```

对于这里的`extends`可以理解为兼容，`<A extends B>`可以看作让`B`类型兼容`A`类型，也就是`A`类型的值能够赋值给`B`类型。

具体关于兼容的概念可以查看 [类型断言的限制章节](#类型断言的限制) 中关于关于类型兼容概念的总结。

### 在泛型约束中使用类型参数

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象`obj`上，因此我们需要在这两个类型之间使用约束。

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

// keyof x === 'a' | 'b' | 'c' | 'd'(字符串字面量类型)
// 也就是说这里的 'a' | 'b' | 'c' | 'd' 类型必须要兼容 K 类型, 这就意味着 K 类型的值要能赋值给 'a' | 'b' | 'c' | 'd' 类型
let x = { a: 1, b: 2, c: 3, d: 4 }

// success
getProperty(x, 'a')
// error info: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'
getProperty(x, 'm')
```

`key of`的具体用法可以参考：[keyof](#索引类型查询操作符-keyof)。

### 默认泛型参数

当一个泛型参数既没有显式指定，也没有推断出来的时候，默认泛型参数就会生效：

```ts
function func1<T = string>(param1?: T): T {
  return param1
}
// 这里的 res 会看作 string 类型
let res = func1()
```

不只是函数上可以用，其他能够使用类型变量的地方基本都可以用：

```ts
class Person<T = string> {
  name: T
}
// 这里的 name 也会看作 string 类型
new Person().name
```

## 枚举

使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例，比如下面：

```ts
//例如每周七天
enum weekDays {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
```

枚举的成员会有对应的一个值，默认情况是以 0 开始， 以步长为 1 进行递增的数字。

枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```js
// Sun-index: 0; Sun-str: Sun
console.log(`Sun-index: ${weekDays.Sun}; Sun-str: ${weekDays[0]}`)
// Sun-index: 1; Sun-str: Mon
console.log(`Sun-index: ${weekDays.Mon}; Sun-str: ${weekDays[1]}`)
// Sun-index: 2; Sun-str: Tue
console.log(`Sun-index: ${weekDays.Tue}; Sun-str: ${weekDays[2]}`)
// Sun-index: 3; Sun-str: Wed
console.log(`Sun-index: ${weekDays.Wed}; Sun-str: ${weekDays[3]}`)
// Sun-index: 4; Sun-str: Thu
console.log(`Sun-index: ${weekDays.Thu}; Sun-str: ${weekDays[4]}`)
// Sun-index: 5; Sun-str: Fri
console.log(`Sun-index: ${weekDays.Fri}; Sun-str: ${weekDays[5]}`)
// Sun-index: 6; Sun-str: Sat
console.log(`Sun-index: ${weekDays.Sat}; Sun-str: ${weekDays[6]}`)
```

我们这里所说的枚举是运行时存在的实体，在编译阶段不会擦除。

这里编译之后变成了：

```js
var weekDays
;(function (weekDays) {
  weekDays[(weekDays['Sun'] = 0)] = 'Sun'
  weekDays[(weekDays['Mon'] = 1)] = 'Mon'
  weekDays[(weekDays['Tue'] = 2)] = 'Tue'
  weekDays[(weekDays['Wed'] = 3)] = 'Wed'
  weekDays[(weekDays['Thu'] = 4)] = 'Thu'
  weekDays[(weekDays['Fri'] = 5)] = 'Fri'
  weekDays[(weekDays['Sat'] = 6)] = 'Sat'
})(weekDays || (weekDays = {}))
```

这样看起来不太清楚，我们将其展开一下：

```js
var weekDays
;(function (weekDays) {
  weekDays[0] = 'Sun'
  weekDays['Sun'] = 0
  weekDays[1] = 'Mon'
  weekDays['Mon'] = 1
  weekDays[2] = 'Tue'
  weekDays['Tue'] = 2
  weekDays[3] = 'Wed'
  weekDays['Wed'] = 3
  weekDays[4] = 'Thu'
  weekDays['Thu'] = 4
  weekDays[5] = 'Fri'
  weekDays['Fri'] = 5
  weekDays[6] = 'Sat'
  weekDays['Sat'] = 6
})(weekDays || (weekDays = {}))
```

这样我们就知道了枚举类型值反向映射的原理了。

### 手动赋值

上文我们讲述的是枚举项自动默认赋值的情况，那这里我们如果要进行手动赋值呢， `TS` 支持数字的和基于字符串的赋值项。

手动赋值又被称之为初始化枚举项的表达式：

```ts
enum weekDays1 {
  Sun = 2,
  Mon,
  Tue = 5,
  Wed,
  Thu,
  Fri,
  Sat
}
// 这里你会发现 Sun --> 2, Mon --> 3, Tue --> 5, Wed --> 6, Thu -- 7, Fri --> 8, Sat --> 9

enum weekDays2 {
  Sun = 3.5,
  Mon,
  Tue = 1,
  Wed,
  Thu,
  Fri,
  Sat
}
// 这里你会发现 Sun --> 3.5, Mon --> 4.5, Tue --> 1, Wed --> 2, Thu -- 3, Fri --> 4, Sat --> 5
```

总结一下规律：在我们手动赋值（数值类型）时，以赋值为起点，以步长为 1 进行递增（不管起始点（赋值项）是小数，负数，或者后面的数字是否会重复）。

```ts
enum weekDays3 {
  Sun = 3,
  Mon,
  Tue = 1,
  Wed,
  Thu,
  Fri,
  Sat
}
// 这里你会发现 Sun --> 3, Mon --> 4, Tue --> 1, Wed --> 2, Thu -- 3, Fri --> 4, Sat --> 5

// 编译之后的 js 对应的对象为:
var weekDays3 = {
  // 丢失了 Sun, Mon
  '1': 'Tue',
  '2': 'Wed',
  '3': 'Thu',
  '4': 'Fri',
  '5': 'Sat',
  Sun: 3,
  Mon: 4,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5
}
```

这里会发现通过赋的值来取对应的枚举值的时候, 丢失了前面的重复的值（被后面的覆盖了）。

因此在手动赋值的时候我们尽可能的避免枚举类型对应的值的重复, 这样会导致一些无法预估的错误。

### 常数项和计算所得项

首先我们要知道，什么在`TS`的枚举中算得上是常数项和计算所得项呢？

当满足以下条件时，枚举成员被当作是常数项：

1. 不具有初始化函数并且之前的枚举成员是常数项。

   在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。

   但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。

   ```ts
   // 不具备初始化表达式(手动赋值)
   enum weekDays {
     Sun,
     Mon,
     Tue,
     Wed,
     Thu,
     Fri,
     Sat
   }
   // 0 1 2 3 4 5 6
   ```

2. 枚举成员使用常数项枚举表达式初始化。常数项枚举表达式是 `TS` 表达式的子集，它可以在编译阶段求值。
   当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：

   1. 数字字面量：

      ```ts
      enum weekDays {
        Sun = 0,
        Mon = 1,
        Tue = 2,
        Wed = 3,
        Thu = 4,
        Fri = 5,
        Sat = 6
      }
      ```

   2. 引用之前定义的常数项枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用：

      ```ts
      enum weekDays {
        Sun,
        Mon = Sun,
        Tue,
        Wed,
        Thu,
        Fri,
        Sat
      }
      ```

   3. 带括号的常数项枚举表达式；

   4. `+, -, ~` 一元运算符应用于常数项枚举表达式：

      ```ts
      enum weekDays {
        Sun = 1 + 2,
        Mon = 2 * 3,
        Tue,
        Wed,
        Thu,
        Fri,
        Sat
      }
      ```

   5. `+, -, *, /, %, <<, >>, >>>, &, |, ^` 二元运算符，常数项枚举表达式做为其一个操作对象；

   若常数项枚举表达式求值后为 `NaN` 或 `Infinity`，则会在编译阶段报错

然后除此之外所有其它情况的枚举成员被当作是需要计算得出的值（计算所得项）。

```ts
// White 对应的值为计算所得项
enum Colors1 {
  Green,
  Red,
  White = '11'.length
}

// error info:
// 枚举成员必须具有初始化表达式, (enum member) Colors2.Green
// 枚举成员必须具有初始化表达式, (enum member) Colors2.Red
enum Colors2 {
  White = '11'.length,
  Green,
  Red
}

// success
enum Colors3 {
  White = '11'.length,
  Green = 1,
  Red
}
```

关于计算所得项在枚举中需要的注意点：如果紧接在计算所得项后面的是未手动赋值的项（紧接在手动赋值的后面的第一个即可），那么它就会因为无法获得初始值而报错。

前文说过，`TS` 支持数字的和基于字符串的赋值项。那么这里数字就能看作常数项，字符串就能看作计算所得项。

```ts
// 字符串枚举
// 这里的规则符合上面关于计算所得项的总结
// error info: enum1.Two 枚举成员必须具有初始化表达式
enum enum1 {
  One = 'One',
  Two
}
// success, 紧跟在计算所得项后面是手动赋值
enum enum2 {
  One = 'One',
  Two = 0
}
// success, 紧跟在计算所得项后面是手动赋值
enum enum2 {
  One = 'One',
  Two = 'Two'
}

// 数字枚举
// 这里的规则符合上面关于常数项枚举的总结
// Two 对应的值为 1.5
enum enum2 {
  One = 0.5,
  Two
}
```

### 常量(const)枚举

前文所说的枚举不管是枚举项的定义或者枚举值在运行时会存在的，但是有时候，我们不希望产生过多的代码，但是又希望他能存在一定的实体。常量枚举就能满足这些条件，它的枚举项的定义在编译阶段会擦除，但是它的枚举值依旧能保留下来。

```ts
const enum weekDays {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
const weeks = [weekDays.Sun, weekDays.Mon]
```

经过编译之后，枚举的定义部分将会被擦除，但是在 `weeks` 变量的使用中依旧保留下来了一些，值是枚举对应的值，注释部分对应的是枚举项：

```js
var weeks = [0 /* Sun */, 1 /* Mon */]
```

我们再做一个测试：

```ts
const enum weekDays {
  Sun = 'Sun',
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
const weeks = [weekDays.Sun, weekDays.Mon]
```

编译之后

```js
var weeks = ['Sun' /* Sun */, 1 /* Mon */]
```

如果是普通的枚举项，我们来对比一下：

```ts
enum weekDays {
  Sun = 'Sun',
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}

const weeks = [weekDays.Sun, weekDays.Mon]
```

编译之后：

```js
var weekDays
;(function (weekDays) {
  weekDays['Sun'] = 'Sun'
  weekDays[(weekDays['Mon'] = 1)] = 'Mon'
  weekDays[(weekDays['Tue'] = 2)] = 'Tue'
  weekDays[(weekDays['Wed'] = 3)] = 'Wed'
  weekDays[(weekDays['Thu'] = 4)] = 'Thu'
  weekDays[(weekDays['Fri'] = 5)] = 'Fri'
  weekDays[(weekDays['Sat'] = 6)] = 'Sat'
})(weekDays || (weekDays = {}))
// 这里对应的值其实也是 [ "Sun", 1 ]
var weeks = [weekDays.Sun, weekDays.Mon]
```

这里就能看的出来常量（`const`）枚举和普通枚举的区别了。

### 外部枚举

外部枚举用来描述已经存在的枚举类型的形状，具体使用场景还不清楚。

外部枚举就更进一步，它只能再编译阶段生效，在运行时，关于枚举项的定义或者枚举值全部被擦除了。也就是说，外部枚举一定需要额外依赖我们定义的实体才能有用。

`declare`声明的是类型变量，在编译阶段都会擦除，具体请参考：<a href="#声明文件">声明文件</a>。

```ts
declare enum Color {
  Green,
  White
}
const colors = [Color.Green, Color.White]
```

编译之后，关于枚举项和枚举值的定义直接擦除，如果没有额外定义一个实体，那么这里运行时会报错：

```js
// error info: ReferenceError: Color is not defined
var colors = [Color.Green, Color.White]
```

因此我们需要额外定义一个实体，这里可以结合 `const` 一起来使用：

```ts
declare const enum Color {
  Green,
  White
}
const colors = [Color.Green, Color.White]
```

编译后：

```js
var colors = [0 /* Green */, 1 /* White */]
```

### 参考

- [TS 入门教程 - Enums](https://ts.xcatliu.com/advanced/enum.html#%E5%8F%82%E8%80%83)
- [TS Handbook 中文版 - Enums](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/enums.md)

## 声明文件（Coming Soon...）

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

### 新语法索引

- [`declare var`](https://ts.xcatliu.com/basics/declaration-files.html#declare-var) 声明全局变量
- [`declare function`](https://ts.xcatliu.com/basics/declaration-files.html#declare-function) 声明全局方法
- [`declare class`](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
- [`declare enum`](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
- [`declare namespace`](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
- [`interface` 和 `type`](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型
- [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
- [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块
- [`export as namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-as-namespace) UMD 库声明全局变量
- [`declare global`](https://ts.xcatliu.com/basics/declaration-files.html#declare-global) 扩展全局变量
- [`declare module`](https://ts.xcatliu.com/basics/declaration-files.html#declare-module) 扩展模块
- [`/// `](https://ts.xcatliu.com/basics/declaration-files.html#san-xie-xian-zhi-ling) 三斜线指令

这里额外补充一下

- `interface, type`，它们不需要`declare`来显式表示，他们默认就是声明了类型；

这里要注意的是，涉及到 `declare`声明的变量，它在编译之后会被擦除，因此他是需要依赖实体存在的。

### 声明类型，值，命名空间的关系

`TS` 中的声明会创建以下三种之一：命名空间，类型或值。 创建命名空间的声明会新建一个命名空间，它包含了用（`.`）符号来访问时使用的名字。 


| Declaration Type | Namespace | Type | Value |
| ---------------- | --------- | ---- | ----- |
| Namespace        | √         |      | √     |
| Class            |           | √    | √     |
| Enum             |           | √    | √     |
| Interface        |           | √    |       |
| Type Alias       |           | √    |       |
| Function         |           |      | √     |
| Variable         |           |      | √     |

声明命名空间，值算做一类，声明类型（`interface, type`）算作另外一类，它们的异同点：

相同点：

1. 两者只是在编译期间存在，在编译成为`.js`之后就都被完全擦除了；
2. 他们都是帮助`TS`从另外一个维度（类型）的层面识别`JS`实体；

不同点：

1. 声明类型（`interface, type`）需要用声明的模型绑定到给定的名字上，也就是绑定到具体的`JS`变量上：

   ```ts
   interface jQuery {
     (id: string): HTMLElement
   }
   let jQuery: jQuery = (id: string) => document.getElementById(id)
   jQuery('#foo')
   ```

2. 声明命名空间，值的声明会创建在`JS`输出中看到的值，也就是`TS`直接通过这个声明来看`JS`中的这个变量是什么，而不需要额外的绑定：

   ```ts
   // jQuery.d.ts
   declare var jQuery: (id: string) => HTMLElement
   
   // demo1.ts
   let jQuery = (id: string) => document.getElementById(id)
   jQuery('#foo')
   ```

   这里要注意的是，因为`TS`同样回把声明的值看作变量，因此如果没有抽取到别的文件中，比如抽取到`*.d.ts`中的话，会出现变量名冲突的情况：

   ```ts
   declare var jQuery: (id: string) => HTMLElement
   //error info: 标识符 'jQuery' 重复
   let jQuery = (id: string) => document.getElementById(id)
   jQuery('xx')
   ```

### 声明语句

假设这里我们想应用`jQuery`

```ts
// error info: 找不到名称'jQuery'
jQuery('#foo')
```

如果我们没有提供对应声明，那么在 `TS`看来，`jQuery`就无法被识别。

因此我们需要添加一个声明语句，在告诉`TS`，这个变量是什么。

```ts
declare var jQuery: (id: string) => any
// success
jQuery('#foo')
```

这里要注意的是，这里我们的`declare var jQuery: (id: string) => any`并不是定义了一个实体的变量，它只是告诉了`TS`这个`jQuery`变量是什么。在编译之后，这个是会被擦除的。因此这里实际在运行时执行时，还是需要依赖真正的`jQuery`变量。

上面的`.ts`文件编译之后

```js
jQuery('#foo')
```

这里如果直接执行就会报错，错误信息为：`ReferenceError: jQuery is not defined`。

### 声明文件

`TS` 一般会检查项目目录下所有 `*.ts` 结尾的文件, 当然, 这里也包括了 `*.d.ts` 文件，而我们通常会把声明语句放到一个单独的文件（`*.d.ts`）中，这就是声明文件。

这里要区分全局声明文件和局部声明文件，对于`.ts`文件而言，有一个特殊的机制：

1. 只要其中包含`export {}`或者其他可以代表其为模块的语句，那么`*.ts`就为局部模块，那么所对应的 `*.d.ts`自然就是局部声明文件了。对于这种声明文件，我们需要额外的导入或者配置才能生效；
2. 反之，这个`*.d.ts`就是全局声明文件，我们不需要额外的配置，该项目下的`.ts`文件就能识别到全局声明件中声明的类型了；

假如仍然无法解析，那么可以检查下 `tsconfig.json` 中的 `files`、`include` 和 `exclude` 配置，确保我们定义的声明文件在`TS`扫描范围之内。

比如这里我们写一个全局声明文件：

```ts
// jQuery.d.ts
declare var jQuery: (id: string) => any
```

那么该项目下的另外一个文件就能获得该定义：

```ts
// demo1.ts
jQuery('#foo')
```

那么如何定义和使用一个局部声明文件呢，这个具体在后面讲。

### 第三方声明文件

当然，`jQuery` 的声明文件不需要我们定义了，社区已经帮我们定义好了：[jQuery in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jquery/index.d.ts)。

我们可以直接下载下来使用，但是更推荐的是使用 `@types` 统一管理第三方库的声明文件。

`@types` 的使用方式很简单，直接用 `npm` 安装对应的声明模块即可，以 `jQuery` 举例：

```bash
npm install @types/jquery --save-dev
```

可以在[这个页面](https://microsoft.github.io/TypeSearch/)搜索你需要的声明文件。

下载好的声明文件默认会在 `node_modules/@types`目录下，这就说明，`TS`默认情况下也会读取该目录。

### 书写声明文件

当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。前面只介绍了最简单的声明文件内容，而真正书写一个声明文件并不是一件简单的事，以下会详细介绍如何书写声明文件。

在不同的场景下，声明文件的内容和使用方式会有所区别。

库的使用场景主要有以下几种：

- [全局变量](https://ts.xcatliu.com/basics/declaration-files.html#quan-ju-bian-liang)：通过 `<script>` 标签引入第三方库，注入全局变量
- [npm 包](https://ts.xcatliu.com/basics/declaration-files.html#npm-bao)：通过 `import foo from 'foo'` 导入，符合 ES6 模块规范
- [UMD 库](https://ts.xcatliu.com/basics/declaration-files.html#umd-ku)：既可以通过 `<script>` 标签引入，又可以通过 `import` 导入
- [直接扩展全局变量](https://ts.xcatliu.com/basics/declaration-files.html#zhi-jie-kuo-zhan-quan-ju-bian-liang)：通过 `<script>` 标签引入后，改变一个全局变量的结构
- [在 npm 包或 UMD 库中扩展全局变量](https://ts.xcatliu.com/basics/declaration-files.html#zai-npm-bao-huo-umd-ku-zhong-kuo-zhan-quan-ju-bian-liang)：引用 npm 包或 UMD 库后，改变一个全局变量的结构
- [模块插件](https://ts.xcatliu.com/basics/declaration-files.html#mo-kuai-cha-jian)：通过 `<script>` 或 `import` 导入后，改变另一个模块的结构

### 参考

- [TS 入门教程 - 声明文件](https://ts.xcatliu.com/basics/declaration-files.html)
- [TS Handbook 中文版 - 声明文件](https://github.com/zhongsp/TypeScript/blob/dev/zh/declaration-files/introduction.md)

## 声明合并

### 接口的合并

最简单也最常见的声明合并类型是接口合并。 从根本上说，合并的机制是把双方的成员放到一个同名的接口里。

如下所示：

```ts
interface Person {
  name: string
}
interface Person {
  age: number
}

// 上面两个等同于
interface Person {
  name: string
  age: number
}
```

合并接口其实也有一定的限制，对于合并的多个接口而言：

1. 对于不是函数类型的属性而言，该属性应该是唯一的。 如果它们不是唯一的，那么它们必须是相同的类型。

   如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错：

   ```ts
   interface Person {
     name: string
   }
   interface Person {
     // error info: 后续属性声明必须属于同一类型。属性 'name' 的类型必须为 'string'，但此处却为类型 'number'
     // name: number
   
     // success
     name: string
   }
   ```

2. 对于是函数类型的属性而言，每个同名函数声明都会被当成这个函数的一个重载，同时需要注意，当两个接口合并时，后面的接口中的函数属性具有更高的优先级：

   ```ts
   interface Cloner {
     clone(animal: Animal): Animal
   }
   
   interface Cloner {
     clone(animal: Sheep): Sheep
   }
   
   interface Cloner {
     clone(animal: Dog): Dog
     clone(animal: Cat): Cat
   }
   
   // 等同于
   
   interface Cloner {
     // Dog 和 Cat 出现在前面来了
     clone(animal: Dog): Dog
     clone(animal: Cat): Cat
     clone(animal: Sheep): Sheep
     clone(animal: Animal): Animal
   }
   ```

   注意每组接口内部的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置。

   这个规则有一个例外是当出现特殊的函数签名时。

   如果签名里有一个参数的类型是单一的字符串字面量（比如，不是字符串字面量的联合类型），那么它将会被提升到重载列表的最顶端。

   比如，下面的接口会合并到一起：

   ```ts
   interface Document {
     createElement(tagName: any): Element
   }
   interface Document {
     createElement(tagName: 'div'): HTMLDivElement
     createElement(tagName: 'span'): HTMLSpanElement
   }
   interface Document {
     createElement(tagName: string): HTMLElement
     createElement(tagName: 'canvas'): HTMLCanvasElement
   }
   ```

   合并后的`Document`将会像下面这样：

   ```ts
   interface Document {
     createElement(tagName: 'canvas'): HTMLCanvasElement
     createElement(tagName: 'div'): HTMLDivElement
     createElement(tagName: 'span'): HTMLSpanElement
     createElement(tagName: string): HTMLElement
     createElement(tagName: any): Element
   }
   ```
   看起来就像是按照函数参数的类型就像由具体到抽象来排序，对于类型相同的参数则是后面合并的接口优先级更高。

### 函数的合并

其实这里算不上声明的合并，因为这里定义的函数是实体，而非声明的值，类型，命名空间等。

这里应该算函数的重载：

```ts
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''))
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('')
  }
}
```

### 其他声明合并

其实声明合并还有其他合并的形式，请参考：[更多声明合并形式](https://github.com/zhongsp/TypeScript/blob/dev/zh/reference/declaration-merging.md)。

### 非法的合并

TypeScript 并非允许所有的合并。 目前，类不能与其它类或变量合并。 想要了解如何模仿类的合并，请参考 [TypeScript 的混入](https://github.com/zhongsp/TypeScript/blob/dev/zh/reference/mixins.md)。

## 工程化

### tsconfig.json

#### 概述

如果一个目录下存在一个`tsconfig.json`文件，那么它意味着这个目录是 TypeScript 项目的根目录。 `tsconfig.json`文件中指定了用来编译这个项目的根文件和编译选项。 一个项目可以通过以下方式之一来编译：

#### 使用 tsconfig.json

- 不带任何输入文件的情况下调用`tsc`，编译器会从当前目录开始去查找`tsconfig.json`文件，逐级向上搜索父目录；
- 不带任何输入文件的情况下调用`tsc`，且使用命令行参数`--project`（或`-p`）指定一个包含`tsconfig.json`文件的目录；

当命令行上指定了输入文件时，`tsconfig.json`文件会被忽略，比如：`tsc path/xxx.ts`。

#### 示例

`tsconfig.json`示例文件:

- 使用`"files"`属性：

  ```json
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

- 使用`"include"`和`"exclude"`属性：

  ```json
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }
  ```

#### 细节

`"compilerOptions"`可以被忽略，这时编译器会使用默认值。在这里查看完整的 [编译器选项](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/compiler-options.md) 列表。

`"files"`指定一个包含相对或绝对文件路径的列表。 `"include"`和`"exclude"`属性指定一个文件 glob 匹配模式列表。 支持的 glob 通配符有：

- `*` 匹配 0 或多个字符（不包括目录分隔符）
- `?` 匹配一个任意字符（不包括目录分隔符）
- `**/` 递归匹配任意子目录

如果一个 glob 模式里的某部分只包含`*`或`.*`，那么仅有支持的文件扩展名类型被包含在内（比如默认`.ts`，`.tsx`，和`.d.ts`， 如果`allowJs`设置能`true`还包含`.js`和`.jsx`）。

如果`"files"`和`"include"`都没有被指定，编译器默认包含当前目录和子目录下所有的 `TypeScript` 文件（`.ts`, `.d.ts` 和 `.tsx`），排除在`"exclude"`里指定的文件。

JS 文件（`.js`和`.jsx`）也被包含进来，如果`allowJs`被设置成`true`。 

如果指定了`"files"`或`"include"`，编译器会将它们结合一并包含进来。 

使用`"outDir"`指定的目录下的文件永远会被编译器排除，除非你明确地使用`"files"`将其包含进来（这时就算用`exclude`指定也没用）。

使用`"include"`引入的文件可以使用`"exclude"`属性过滤。 

然而，通过`"files"`属性明确指定的文件却总是会被包含在内，不管`"exclude"`如何设置。 

如果没有特殊指定，`"exclude"`默认情况下会排除`node_modules`，`bower_components`，`jspm_packages`和`<outDir>`目录。

任何被`"files"`或`"include"`指定的文件所引用的文件也会被包含进来。 `A.ts`引用了`B.ts`，因此`B.ts`不能被排除，除非引用它的`A.ts`在`"exclude"`列表中。

需要注意编译器不会去引入那些可能做为输出的文件；

比如，假设我们包含了`index.ts`，那么`index.d.ts`和`index.js`会被排除在外。 通常来讲，不推荐只有扩展名的不同来区分同目录下的文件。

我们设置`outDir`，让输出目录和可能会出现冲突的文件的目录不在同一目录是解决上面这个问题的一种办法。

`tsconfig.json`文件可以是个空文件，那么所有默认的文件（如上面所述）都会以默认配置选项编译。

在命令行上指定的编译选项会覆盖在`tsconfig.json`文件里的相应选项。

#### typeRoots 和 types


默认所有可见的"`@types`"包会在编译过程中被包含进来。 `node_modules/@types`文件夹下以及它们子文件夹下的所有包都是可见的。 

也就是说，`./node_modules/@types/`，`../node_modules/@types/`和`../../node_modules/@types/`等等。

而如果你手动设置了`typeRoots`，那么只有`typeRoots`下面的包才会被包含进来。 比如：

```json
{
  "compilerOptions": {
    "typeRoots": ["./typings"]
  }
}
```

这个配置文件会包含*所有*`./typings`下面的包，而不包含`./node_modules/@types`里面的包。

如果指定了`types`，只有被列出来的包才会被包含进来。 比如：

```json
{
  "compilerOptions": {
    "types": ["node", "lodash", "express"]
  }
}
```

这个`tsconfig.json`文件将仅会包含 `./node_modules/@types/node`，`./node_modules/@types/lodash`和`./node_modules/@types/express`。

`node_modules/@types/*`里面的其它包不会被引入进来。

因此我们一般是指定`"types": []`来禁用自动引入`@types`包。

注意，自动引入只在你使用了全局的声明（相反于模块）时是重要的。 如果你使用`import "foo"`语句，`TypeScript` 仍然会查找`node_modules`和`node_modules/@types`文件夹来获取`foo`包。

#### 使用 extends 继承配置

`tsconfig.json`文件可以利用`extends`属性从另一个配置文件里继承配置。

`extends`是`tsconfig.json`文件里的顶级属性（与`compilerOptions`，`files`，`include`，和`exclude`一样）。 `extends`的值是一个字符串，包含指向另一个要继承文件的路径。

在原文件里的配置先被加载，然后被来自继承文件里的配置重写。 如果发现循环引用，则会报错。

来自所继承配置文件的`files`，`include`和`exclude`*覆盖*源配置文件的属性。

配置文件里的相对路径在解析时相对于它所在的文件。

比如：

`configs/base.json`：

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`：

```json
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```

`tsconfig.nostrictnull.json`：

```json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

#### compileOnSave

在最顶层设置`compileOnSave`标记，可以让 `IDE` 在保存文件的时候根据`tsconfig.json`重新生成文件。

```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

要想支持这个特性需要`Visual Studio 2015， TypeScript1.8.4`以上并且安装[atom-typescript](https://github.com/TypeStrong/atom-typescript#compile-on-save)插件。

#### compilerOptions（编译选项）

| 选项                                 | 类型       | 默认值                                                       | 描述                                                         |
| ------------------------------------ | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `--allowJs`                          | `boolean`  | `false`                                                      | 允许编译 javascript 文件。                                   |
| `--allowSyntheticDefaultImports`     | `boolean`  | `module === "system"`或设置了`--esModuleInterop`             | 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。 |
| `--allowUnreachableCode`             | `boolean`  | `false`                                                      | 不报告执行不到的代码错误。                                   |
| `--allowUnusedLabels`                | `boolean`  | `false`                                                      | 不报告未使用的标签错误。                                     |
| `--alwaysStrict`                     | `boolean`  | `false`                                                      | 以严格模式解析并为每个源文件生成`"use strict"`语句           |
| `--baseUrl`                          | `string`   |                                                              | 解析非相对模块名的基准目录。查看[模块解析文档](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/module-resolution.md#base-url)了解详情。 |
| `--build` `-b`                       | `boolean`  | `false`                                                      | 使用[Project References](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/project-references.md)来构建此工程及其依赖工程。注意这个标记与本页内其它标记不兼容。详情参考[这里](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/project-references.md) |
| `--charset`                          | `string`   | `"utf8"`                                                     | 输入文件的字符集。                                           |
| `--checkJs`                          | `boolean`  | `false`                                                      | 在.js 文件中报告错误。与`--allowJs`配合使用。                |
| `--composite`                        | `boolean`  | `true`                                                       | 确保 TypeScript 能够找到编译当前工程所需要的引用工程的输出位置。 |
| `--declaration` `-d`                 | `boolean`  | `false`                                                      | 生成相应的`.d.ts`文件。                                      |
| `--declarationDir`                   | `string`   |                                                              | 生成声明文件的输出路径。                                     |
| `--diagnostics`                      | `boolean`  | `false`                                                      | 显示诊断信息。                                               |
| `--disableSizeLimit`                 | `boolean`  | `false`                                                      | 禁用 JavaScript 工程体积大小的限制                           |
| `--emitBOM`                          | `boolean`  | `false`                                                      | 在输出文件的开头加入 BOM 头（UTF-8 Byte Order Mark）。       |
| `--emitDecoratorMetadata`[1]         | `boolean`  | `false`                                                      | 给源码里的装饰器声明加上设计类型元数据。查看[issue #2577](https://github.com/Microsoft/TypeScript/issues/2577)了解更多信息。 |
| `--experimentalDecorators`[1]        | `boolean`  | `false`                                                      | 启用实验性的 ES 装饰器。                                     |
| `--extendedDiagnostics`              | `boolean`  | `false`                                                      | 显示详细的诊段信息。                                         |
| `--forceConsistentCasingInFileNames` | `boolean`  | `false`                                                      | 禁止对同一个文件的不一致的引用。                             |
| `--generateCpuProfile`               | `string`   | `profile.cpuprofile`                                         | 在指定目录生成 CPU 资源使用报告。若传入的是已创建的目录名，将在此目录下生成以时间戳命名的报告。 |
| `--help` `-h`                        |            |                                                              | 打印帮助信息。                                               |
| `--importHelpers`                    | `string`   |                                                              | 从[`tslib`](https://www.npmjs.com/package/tslib)导入辅助工具函数（比如`__extends`，`__rest`等） |
| `--importsNotUsedAsValues`           | `string`   | `remove`                                                     | 用于设置针对于类型导入的代码生成和代码检查的行为。`"remove"`和`"preserve"`设置了是否对未使用的导入了模块副作用的导入语句生成相关代码，`"error"`则强制要求只用作类型的模块导入必须使用`import type`语句。 |
| `--inlineSourceMap`                  | `boolean`  | `false`                                                      | 生成单个 sourcemaps 文件，而不是将每 sourcemaps 生成不同的文件。 |
| `--inlineSources`                    | `boolean`  | `false`                                                      | 将代码与 sourcemaps 生成到一个文件中，要求同时设置了`--inlineSourceMap`或`--sourceMap`属性。 |
| `--init`                             |            |                                                              | 初始化 TypeScript 项目并创建一个`tsconfig.json`文件。        |
| `--isolatedModules`                  | `boolean`  | `false`                                                      | 执行额外检查以确保单独编译（如[`transpileModule`](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function)或[@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript)）是安全的。 |
| `--jsx`                              | `string`   | `"preserve"`                                                 | 在`.tsx`文件里支持 JSX：`"react"`或`"preserve"`或`"react-native"`。查看[JSX](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/jsx.md)。 |
| `--jsxFactory`                       | `string`   | `"React.createElement"`                                      | 指定生成目标为 react JSX 时，使用的 JSX 工厂函数，比如`React.createElement`或`h`。 |
| `--lib`                              | `string[]` |                                                              | 编译过程中需要引入的库文件的列表。 可能的值为： ► `ES5` ► `ES6` ► `ES2015` ► `ES7` ► `ES2016` ► `ES2017` ► `ES2018` ► `ESNext` ► `DOM` ► `DOM.Iterable` ► `WebWorker` ► `ScriptHost` ► `ES2015.Core` ► `ES2015.Collection` ► `ES2015.Generator` ► `ES2015.Iterable` ► `ES2015.Promise` ► `ES2015.Proxy` ► `ES2015.Reflect` ► `ES2015.Symbol` ► `ES2015.Symbol.WellKnown` ► `ES2016.Array.Include` ► `ES2017.object` ► `ES2017.Intl` ► `ES2017.SharedMemory` ► `ES2017.String` ► `ES2017.TypedArrays` ► `ES2018.Intl` ► `ES2018.Promise` ► `ES2018.RegExp` ► `ESNext.AsyncIterable` ► `ESNext.Array` ► `ESNext.Intl` ► `ESNext.Symbol` 注意：如果`--lib`没有指定默认注入的库的列表。默认注入的库为： ► 针对于`--target ES5`：`DOM，ES5，ScriptHost` ► 针对于`--target ES6`：`DOM，ES6，DOM.Iterable，ScriptHost` |
| `--listEmittedFiles`                 | `boolean`  | `false`                                                      | 打印出编译后生成文件的名字。                                 |
| `--listFiles`                        | `boolean`  | `false`                                                      | 编译过程中打印文件名。                                       |
| `--locale`                           | `string`   | _(platform specific)_                                        | 显示错误信息时使用的语言，比如：en-us。                      |
| `--mapRoot`                          | `string`   |                                                              | 为调试器指定指定 sourcemap 文件的路径，而不是使用生成时的路径。当`.map`文件是在运行时指定的，并不同于`js`文件的地址时使用这个标记。指定的路径会嵌入到`sourceMap`里告诉调试器到哪里去找它们。使用此标识并不会新创建指定目录并生成 map 文件在指定路径下。而是增加一个构建后的步骤，把相应文件移动到指定路径下。 |
| `--maxNodeModuleJsDepth`             | `number`   | `0`                                                          | node_modules 依赖的最大搜索深度并加载 JavaScript 文件。仅适用于`--allowJs`。 |
| `--module` `-m`                      | `string`   | `target === "ES6" ? "ES6" : "commonjs"`                      | 指定生成哪个模块系统代码：`"None"`，`"CommonJS"`，`"AMD"`，`"System"`，`"UMD"`，`"ES6"`或`"ES2015"`。 ► 只有`"AMD"`和`"System"`能和`--outFile`一起使用。 ►`"ES6"`和`"ES2015"`可使用在目标输出为`"ES5"`或更低的情况下。 |
| `--moduleResolution`                 | `string`   | `module === "AMD" or "System" or "ES6" ? "Classic" : "Node"` | 决定如何处理模块。或者是`"Node"`对于 Node.js/io.js，或者是`"Classic"`（默认）。查看[模块解析](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/module-resolution.md)了解详情。 |
| `--newLine`                          | `string`   | _(platform specific)_                                        | 当生成文件时指定行结束符：`"crlf"`（windows）或`"lf"`（unix）。 |
| `--noEmit`                           | `boolean`  | `false`                                                      | 不生成输出文件。                                             |
| `--noEmitHelpers`                    | `boolean`  | `false`                                                      | 不在输出文件中生成用户自定义的帮助函数代码，如`__extends`。  |
| `--noEmitOnError`                    | `boolean`  | `false`                                                      | 报错时不生成输出文件。                                       |
| `--noErrorTruncation`                | `boolean`  | `false`                                                      | 不截短错误消息。                                             |
| `--noFallthroughCasesInSwitch`       | `boolean`  | `false`                                                      | 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿） |
| `--noImplicitAny`                    | `boolean`  | `false`                                                      | 在表达式和声明上有隐含的`any`类型时报错。                    |
| `--noImplicitReturns`                | `boolean`  | `false`                                                      | 不是函数的所有返回路径都有返回值时报错。                     |
| `--noImplicitThis`                   | `boolean`  | `false`                                                      | 当`this`表达式的值为`any`类型的时候，生成一个错误。          |
| `--noImplicitUseStrict`              | `boolean`  | `false`                                                      | 模块输出中不包含`"use strict"`指令。                         |
| `--noLib`                            | `boolean`  | `false`                                                      | 不包含默认的库文件（`lib.d.ts`）。                           |
| `--noResolve`                        | `boolean`  | `false`                                                      | 不把` /// <reference``> `或模块导入的文件加到编译文件列表。  |
| `--noStrictGenericChecks`            | `boolean`  | `false`                                                      | 禁用在函数类型里对泛型签名进行严格检查。                     |
| `--noUnusedLocals`                   | `boolean`  | `false`                                                      | 若有未使用的局部变量则抛错。                                 |
| `--noUnusedParameters`               | `boolean`  | `false`                                                      | 若有未使用的参数则抛错。                                     |
| ~~`--out`~~                          | `string`   |                                                              | 弃用。使用 `--outFile` 代替。                                |
| `--outDir`                           | `string`   |                                                              | 重定向输出目录。                                             |
| `--outFile`                          | `string`   |                                                              | 将输出文件合并为一个文件。合并的顺序是根据传入编译器的文件顺序和` ///<reference``> `和`import`的文件顺序决定的。查看输出文件顺序文档[了解详情](https://github.com/Microsoft/TypeScript/wiki/FAQ#how-do-i-control-file-ordering-in-combined-output---out-)。 |
| `paths`[2]                           | `Object`   |                                                              | 模块名到基于`baseUrl`的路径映射的列表。查看[模块解析文档](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/module-resolution.md#path-mapping)了解详情。 |
| `--preserveConstEnums`               | `boolean`  | `false`                                                      | 保留`const`和`enum`声明。查看[const enums documentation](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#94-constant-enum-declarations)了解详情。 |
| `--preserveSymlinks`                 | `boolean`  | `false`                                                      | 不把符号链接解析为其真实路径；将符号链接文件视为真正的文件。 |
| `--preserveWatchOutput`              | `boolean`  | `false`                                                      | 保留 watch 模式下过时的控制台输出。                          |
| `--pretty`[1]                        | `boolean`  | `false`                                                      | 给错误和消息设置样式，使用颜色和上下文。                     |
| `--project` `-p`                     | `string`   |                                                              | 编译指定目录下的项目。这个目录应该包含一个`tsconfig.json`文件来管理编译。查看[tsconfig.json](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/tsconfig.json.md)文档了解更多信息。 |
| `--reactNamespace`                   | `string`   | `"React"`                                                    | 当目标为生成`"react"` JSX 时，指定`createElement`和`__spread`的调用对象 |
| `--removeComments`                   | `boolean`  | `false`                                                      | 删除所有注释，除了以`/!*`开头的版权信息。                    |
| `--rootDir`                          | `string`   | _(common root directory is computed from the list of input files)_ | 仅用来控制输出的目录结构`--outDir`。                         |
| `rootDirs`[2]                        | `string[]` |                                                              | 根（root）文件夹列表，表示运行时组合工程结构的内容。查看[模块解析文档](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/module-resolution.md#virtual-directories-with-rootdirs)了解详情。 |
| `--showConfig`                       | `boolean`  | `false`                                                      | 不真正执行 build，而是显示 build 使用的配置文件信息。        |
| `--skipDefaultLibCheck`              | `boolean`  | `false`                                                      | 忽略[库的默认声明文件](https://github.com/zhongsp/TypeScript/blob/dev/zh/handbook/triple-slash-directives.md#-reference-no-default-libtrue)的类型检查。 |
| `--skipLibCheck`                     | `boolean`  | `false`                                                      | 忽略所有的声明文件（`*.d.ts`）的类型检查。                   |
| `--sourceMap`                        | `boolean`  | `false`                                                      | 生成相应的`.map`文件。                                       |
| `--sourceRoot`                       | `string`   |                                                              | 指定 TypeScript 源文件的路径，以便调试器定位。当 TypeScript 文件的位置是在运行时指定时使用此标记。路径信息会被加到`sourceMap`里。 |
| `--strict`                           | `boolean`  | `false`                                                      | 启用所有严格检查选项。 包含`--noImplicitAny`, `--noImplicitThis`, `--alwaysStrict`, `--strictBindCallApply`, `--strictNullChecks`, `--strictFunctionTypes`和`--strictPropertyInitialization`. |
| `--strictFunctionTypes`              | `boolean`  | `false`                                                      | 禁用函数参数双向协变检查。                                   |
| `--strictPropertyInitialization`     | `boolean`  | `false`                                                      | 确保类的非`undefined`属性已经在构造函数里初始化。若要令此选项生效，需要同时启用`--strictNullChecks`。 |
| `--strictNullChecks`                 | `boolean`  | `false`                                                      | 在严格的`null`检查模式下，`null`和`undefined`值不包含在任何类型里，只允许用它们自己和`any`来赋值（有个例外，`undefined`可以赋值到`void`）。 |
| `--suppressExcessPropertyErrors`[1]  | `boolean`  | `false`                                                      | 阻止对对象字面量的额外属性检查。                             |
| `--suppressImplicitAnyIndexErrors`   | `boolean`  | `false`                                                      | 阻止`--noImplicitAny`对缺少索引签名的索引对象报错。查看[issue #1232](https://github.com/Microsoft/TypeScript/issues/1232#issuecomment-64510362)了解详情。 |
| `--target` `-t`                      | `string`   | `"ES3"`                                                      | 指定 ECMAScript 目标版本`"ES3"`（默认），`"ES5"`，`"ES6"`/`"ES2015"`，`"ES2016"`，`"ES2017"`，`"ES2018"`，`"ES2019"`，`"ES2020"`或`"ESNext"`。 注意：`"ESNext"`最新的生成目标列表为[ES proposed features](https://github.com/tc39/proposals) |
| `--traceResolution`                  | `boolean`  | `false`                                                      | 生成模块解析日志信息                                         |
| `--types`                            | `string[]` |                                                              | 要包含的类型声明文件名列表。查看[@types，--typeRoots 和--types](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/tsconfig.json.md#types-typeroots-and-types)章节了解详细信息。 |
| `--typeRoots`                        | `string[]` |                                                              | 要包含的类型声明文件路径列表。查看[@types，--typeRoots 和--types](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/tsconfig.json.md#types-typeroots-and-types)章节了解详细信息。 |
| `--version` `-v`                     |            |                                                              | 打印编译器版本号。                                           |
| `--watch` `-w`                       |            |                                                              | 在监视模式下运行编译器。会监视输出文件，在它们改变时重新编译。监视文件和目录的具体实现可以通过环境变量进行配置。详情请看[配置 Watch](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/configuring-watch.md)。 |

- [1] 这些选项是试验性的。
- [2] 这些选项只能在`tsconfig.json`里使用，不能在命令行使用。

#### compilerOptions 中的 watch

编译器支持使用环境变量配置如何监视文件和目录的变化。

##### 使用`TSC_WATCHFILE`环境变量来配置文件监视

| 选项                                    | 描述                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| `PriorityPollingInterval`               | 使用`fs.watchFile`但针对源码文件，配置文件和消失的文件使用不同的轮询间隔 |
| `DynamicPriorityPolling`                | 使用动态队列，对经常被修改的文件使用较短的轮询间隔，对未修改的文件使用较长的轮询间隔 |
| `UseFsEvents`                           | 使用 `fs.watch`，它使用文件系统事件（但在不同的系统上可能不一定准确）来查询文件的修改/创建/删除。注意少数的系统如 Linux，对监视者的数量有限制，如果使用`fs.watch`创建监视失败那么将通过`fs.watchFile`来创建监视 |
| `UseFsEventsWithFallbackDynamicPolling` | 此选项与`UseFsEvents`类似，只不过当使用`fs.watch`创建监视失败后，回退到使用动态轮询队列进行监视（如`DynamicPriorityPolling`介绍的那样） |
| `UseFsEventsOnParentDirectory`          | 此选项通过`fs.watch`（使用系统文件事件）监视文件的父目录，因此 CPU 占用率低但也会降低精度 |
| 默认 （无指定值）                       | 如果环境变量`TSC_NONPOLLING_WATCHER`设置为`true`，监视文件的父目录（如同`UseFsEventsOnParentDirectory`）。否则，使用`fs.watchFile`监视文件，超时时间为`250ms`。 |

##### 使用`TSC_WATCHDIRECTORY`环境变量来配置目录监视

在那些 Nodejs 原生就不支持递归监视目录的平台上，我们会根据`TSC_WATCHDIRECTORY`的不同选项递归地创建对子目录的监视。 注意在那些原生就支持递归监视目录的平台上（如 Windows），这个环境变量会被忽略。

| 选项                                            | 描述                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `RecursiveDirectoryUsingFsWatchFile`            | 使用`fs.watchFile`监视目录和子目录，它是一个轮询监视（消耗 CPU 周期） |
| `RecursiveDirectoryUsingDynamicPriorityPolling` | 使用动态轮询队列来获取目录与其子目录的改变                   |
| 默认 （无指定值）                               | 使用`fs.watch`来监视目录及其子目录                           |

##### 背景

在编译器中`--watch`的实现依赖于 Nodejs 提供的`fs.watch`和`fs.watchFile`，两者各有优缺点。

`fs.watch`使用文件系统事件通知文件及目录的变化。 但是它依赖于操作系统，且事件通知并不完全可靠，在很多操作系统上的行为难以预料。 还可能会有创建监视个数的限制，如 Linux 系统，在包含大量文件的程序中监视器个数很快被耗尽。 但也正是因为它使用文件系统事件，不需要占用过多的 CPU 周期。 典型地，编译器使用`fs.watch`来监视目录（比如配置文件里声明的源码目录，无法进行模块解析的目录）。 这样就可以处理改动通知不准确的问题。 但递归地监视仅在 Windows 和 OSX 系统上支持。 这就意味着在其它系统上要使用替代方案。

`fs.watchFile`使用轮询，因此涉及到 CPU 周期。 但是这是最可靠的获取文件/目录状态的机制。 典型地，编译器使用`fs.watchFile`监视源文件，配置文件和消失的文件（失去文件引用），这意味着对 CPU 的使用依赖于程序里文件的数量。

### 代码质量检查和格式化

> 具体细节可以参考 [工程化之代码规范](/engineering/codeLintAndFormat)。

#### 概述

2019 年 1 月，[TypeScirpt 官方决定全面采用 ESLint](https://www.oschina.net/news/103818/future-typescript-eslint) 作为代码检查的工具，并创建了一个新项目 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)，提供了 `TypeScript` 文件的解析器 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser) 和相关的配置选项 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin) 等。而之前的两个 `lint`解决方案都将弃用：

- [typescript-eslint-parser](https://github.com/eslint/typescript-eslint-parser) 已停止维护；
- [TSLint](https://palantir.github.io/tslint/) 将提供迁移工具，并在 `typescript-eslint` 的功能足够完整后停止维护 TSLint）；

综上所述，目前以及将来的 `TypeScript` 的代码检查方案就是 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)。

#### 为什么需要代码检查

有人会觉得，`JavaScript` 非常灵活，所以需要代码检查。而 `TypeScript` 已经能够在编译阶段检查出很多问题了，为什么还需要代码检查呢？

因为 `TypeScript` 关注的重心是类型的检查，而不是代码风格。当团队的人员越来越多时，同样的逻辑不同的人写出来可能会有很大的区别：

- 缩进应该是四个空格还是两个空格？
- 是否应该禁用 `var`？
- 接口名是否应该以 `I` 开头？
- 是否应该强制使用 `===` 而不是 `==`？

这些问题 `TypeScript` 不会关注，但是却影响到多人协作开发时的效率、代码的可理解性以及可维护性。

下面来看一个具体的例子：

```ts
var myName = 'Tom';

console.log(`My name is ${myNane}`);
console.log(`My name is ${myName.toStrng()}`);
```

以上代码你能看出有什么错误吗？

分别用 tsc 编译和 eslint 检查后，报错信息如下：

```ts
var myName = 'Tom';
// eslint 报错信息：
// Unexpected var, use let or const instead.eslint(no-var)

console.log(`My name is ${myNane}`);
// tsc 报错信息：
// Cannot find name 'myNane'. Did you mean 'myName'?
// eslint 报错信息：
// 'myNane' is not defined.eslint(no-undef)
console.log(`My name is ${myName.toStrng()}`);
// tsc 报错信息：
// Property 'toStrng' does not exist on type 'string'. Did you mean 'toString'?
```

| 存在的问题                             | `tsc` 是否报错 | `eslint` 是否报错 |
| :------------------------------------- | :------------- | :---------------- |
| 应该使用 `let` 或 `const` 而不是 `var` | ❌              | ✅                 |
| `myName` 被误写成了 `myNane`           | ✅              | ✅                 |
| `toString` 被误写成了 `toStrng`        | ✅️              | ❌                 |

上例中，我们使用了 `var` 来定义一个变量，但其实 ES6 中有更先进的语法 `let` 和 `const`，此时就可以通过 `eslint` 检查出来，提示我们应该使用 `let` 或 `const` 而不是 `var`。

对于未定义的变量 `myNane`，`tsc` 和 `eslint` 都可以检查出来。

由于 `eslint` 无法识别 `myName` 存在哪些方法，所以对于拼写错误的 `toString` 没有检查出来。

由此可见，`eslint` 能够发现出一些 `tsc` 不会关心的错误，检查出一些潜在的问题，所以代码检查还是非常重要的。

#### 在 TypeScript 中使用 ESLint

##### 安装 ESLint

ESLint 可以安装在当前项目中或全局环境下，因为代码检查是项目的重要组成部分，所以我们一般会将它安装在当前项目中。可以运行下面的脚本来安装：

```bash
npm install --save-dev eslint
```

由于 ESLint 默认使用 [Espree](https://github.com/eslint/espree) 进行语法解析，无法识别 `TypeScript` 的一些语法，故我们需要安装 [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)，替代掉默认的解析器，别忘了同时安装 `typescript`：

```bash
npm install --save-dev typescript @typescript-eslint/parser
```

接下来需要安装对应的插件 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 它作为 `eslint` 默认规则的补充，提供了一些额外的适用于 `ts` 语法的规则。

```bash
npm install --save-dev @typescript-eslint/eslint-plugin
```

##### 配置ESLint

我们在项目的根目录下创建一个 `.eslintrc.js`，内容如下：

```js
// 参考：https://eslint.bootcss.com/docs/user-guide/configuring
module.exports = {
  root: true,
  // 一个环境定义了一组预定义的全局变量。可用的环境包括：
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  // 采用 @typescript-eslint 提供的解析器, 来识别 ts 语法
  parser: '@typescript-eslint/parser',
  plugins: [
    //参考： https://typescript-eslint.io/docs/linting/linting/
    //参考： https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/README.md
    '@typescript-eslint'
  ],
  extends: [
    // 继承别人写好的配置文件, 然后合并
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // rules 是基于 extends 合并后的 configuration file 来配置的, 因此 rules 的优先级更高, 粒度更细
  rules: {
      // 禁止使用 var
      'no-var': "error",
      // 优先使用 interface 而不是 type
      '@typescript-eslint/consistent-type-definitions': [
          "error",
          "interface"
      ]
  }
}
```

##### 执行 ESLint

这里我们可以执行：

```bash
npx eslint src --ext .ts
```

#### 在 TypeScript 中使用 Prettier

`ESLint` 包含了一些代码格式的检查，比如空格、分号等。但前端社区中有一个更先进的工具可以用来格式化代码，那就是 [Prettier](https://prettier.io/)。

`Prettier` 聚焦于代码的格式化，通过语法分析，重新整理代码的格式，让所有人的代码都保持同样的风格。

##### 安装 Prettier

首先需要安装 Prettier：

```bash
npm install --save-dev prettier
```

##### 配置 Prettier

然后创建一个 `.prettierrc.js` 文件，里面包含 `Prettier` 的配置项。

具体哪些配置项可以参考：[Prettier 文档 - 配置项](https://prettier.io/docs/en/options.html)

```js
// prettier.config.js or .prettierrc.js
module.exports = {
    // 使用 2 个空格缩进
    tabWidth: 4,
    // 行尾不需要有分号
    semi: false,
    // 使用单引号
    singleQuote: true,
    // 末尾不需要逗号
    trailingComma: 'none',
    // 自动根据当前系统环境匹配换行符 lf | crlf | cr | auto
    endOfLine: 'auto'
};
```

##### 执行 Prettier

```bash
npx prettier --write src
```

#### 整合 prettier + eslint + vscode

> 参考：[如何整合 prettier + eslint + vscode ](/engineering/codeLintAndFormat.html#整合到-vscode)

### 参考

- [TS Handbook 中文版 - tsconfig 配置](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/tsconfig.json.md)
- [TS Handbook 中文版 - 编译选项](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/compiler-options.md)
- [TS Handbook 中文版 - 配置 watch](https://github.com/zhongsp/TypeScript/blob/dev/zh/project-config/configuring-watch.md)
- [ TS 入门教程 - 代码检查 ](https://ts.xcatliu.com/engineering/lint.html)
- [typescript-eslint 官方文档](https://typescript-eslint.io/docs/)
- [ESLint 文档 - 中文版](https://eslint.bootcss.com/docs/user-guide/configuring)
- [Prettier 文档 - 配置](https://prettier.io/docs/en/configuration.html)

## 混合开发中的 JS 代码

在`TS`中我们可以和`JS`一起混合开发，不过这需要我们在编译选项中配置，`"allowJs": true`，这个时候，`TS`会将`JS`也当作输入文件（将其解析为`TS`），然后输出依旧是`JS`，输入输出都是`JS`文件，只不过加了一个转换为`TS`的中间过程。

默认情况下，`TS`为了提高转换速度，只会对`JS`进行输入输出，而不会进行类型校验和错误提示，这个时候与`allowJS`对应的配置`checkJs`就有用了。

`TypeScript 2.3`以后的版本支持使用`--checkJs`对`.js`文件进行类型检查和错误提示。

你可以通过添加`// @ts-nocheck`注释来忽略（整个文件）类型检查；你还可以使用`// @ts-ignore`来忽略本行的错误。

相反，你可以通过去掉`--checkJs`设置并添加一个`// @ts-check`注释来选择检查某些`.js`文件。 

如果你使用了`tsconfig.json`，`JS`检查将遵照一些严格检查标记，如`noImplicitAny`，`strictNullChecks`等。

但因为`JS`检查是相对宽松的，在使用严格标记时可能会有些出乎意料的情况。

对比`.js`文件和`.ts`文件在类型检查上的差异，有如下几点需要注意：

### 用 JSDoc 类型表示类型信息

`.js`文件里，类型可以和在`.ts`文件里一样被推断出来。 同样地，当类型不能被推断时，它们可以通过 JSDoc 来指定，就好比在`.ts`文件里那样。 如同 TypeScript，`--noImplicitAny`会在编译器无法推断类型的位置报错。 （除了对象字面量的情况；后面会详细介绍）

`JSDoc` 注解修饰的声明会被设置为这个声明的类型。比如：

```
/** @type {number} */
var x;

x = 0;      // OK
x = false;  // Error: boolean is not assignable to number
```

你可以在这里找到所有 `JSDoc` 支持的模式，[JSDoc 文档](https://github.com/zhongsp/TypeScript/blob/dev/zh/javascript/type-checking-javascript-files.md#supported-jsdoc)。

### 属性的推断来自于类内的赋值语句

ES2015 没提供声明类属性的方法。属性是动态赋值的，就像对象字面量一样。

在`.js`文件里，编译器从类内部的属性赋值语句来推断属性类型。 属性的类型是在构造函数里赋的值的类型，除非它没在构造函数里定义或者在构造函数里是`undefined`或`null`。 若是这种情况，类型将会是所有赋的值的类型的联合类型。 在构造函数里定义的属性会被认为是一直存在的，然而那些在方法，存取器里定义的属性被当成可选的。

```
class C {
    constructor() {
        this.constructorOnly = 0
        this.constructorUnknown = undefined
    }
    method() {
        this.constructorOnly = false // error, constructorOnly is a number
        this.constructorUnknown = "plunkbat" // ok, constructorUnknown is string | undefined
        this.methodOnly = 'ok'  // ok, but methodOnly could also be undefined
    }
    method2() {
        this.methodOnly = true  // also, ok, methodOnly's type is string | boolean | undefined
    }
}
```

如果一个属性从没在类内设置过，它们会被当成未知的。

如果类的属性只是读取用的，那么就在构造函数里用 `JSDoc` 声明它的类型。 如果它稍后会被初始化，你甚至都不需要在构造函数里给它赋值：

```
class C {
    constructor() {
        /** @type {number | undefined} */
        this.prop = undefined;
        /** @type {number | undefined} */
        this.count;
    }
}

let c = new C();
c.prop = 0;          // OK
c.count = "string";  // Error: string is not assignable to number|undefined
```

### 构造函数等同于类

`ES2015` 以前，`Javascript` 使用构造函数代替类。 编译器支持这种模式并能够将构造函数识别为 `ES2015` 的类。 属性类型推断机制和上面介绍的一致。

```
function C() {
    this.constructorOnly = 0
    this.constructorUnknown = undefined
}
C.prototype.method = function() {
    this.constructorOnly = false // error
    this.constructorUnknown = "plunkbat" // OK, the type is string | undefined
}
```

### 支持 CommonJS 模块

在`.js`文件里，`TypeScript` 能识别出 `CommonJS` 模块。 对`exports`和`module.exports`的赋值被识别为导出声明。 相似地，`require` 函数调用被识别为模块导入。例如：

```
// same as `import module "fs"`
const fs = require("fs");

// same as `export function readFile`
module.exports.readFile = function(f) {
  return fs.readFileSync(f);
}
```

对 `JavaScript` 文件里模块语法的支持比在 `TypeScript` 里宽泛多了。 大部分的赋值和声明方式都是允许的。

### 类，函数和对象字面量是命名空间

`.js`文件里的类是命名空间。 它可以用于嵌套类，比如：

```
class C {
}
C.D = class {
}
```

`ES2015` 之前的代码，它可以用来模拟静态方法：

```
function Outer() {
  this.y = 2
}
Outer.Inner = function() {
  this.yy = 2
}
```

它还可以用于创建简单的命名空间：

```
var ns = {}
ns.C = class {
}
ns.func = function() {
}
```

同时还支持其它的变化：

```
// 立即调用的函数表达式
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1

// defaulting to global
var assign = assign || function() {
  // code goes here
}
assign.extra = 1
```

### 对象字面量是开放的

`.ts`文件里，用对象字面量初始化一个变量的同时也给它声明了类型。 新的成员不能再被添加到对象字面量中。 这个规则在`.js`文件里被放宽了；对象字面量具有开放的类型，允许添加并访问原先没有定义的属性。例如：

```
var obj = { a: 1 };
obj.b = 2;  // Allowed
```

对象字面量的表现就好比具有一个默认的索引签名`[x:string]: any`，它们可以被当成开放的映射而不是封闭的对象。

与其它 `JS` 检查行为相似，这种行为可以通过指定 `JSDoc` 类型来改变，例如：

```
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;  // Error, type {a: number} does not have property b
```

### null，undefined，和空数组的类型是 any 或 any[]

任何用`null`，`undefined`初始化的变量，参数或属性，它们的类型是`any`，就算是在严格`null`检查模式下。 任何用`[]`初始化的变量，参数或属性，它们的类型是`any[]`，就算是在严格`null`检查模式下。 唯一的例外是像上面那样有多个初始化器的属性。

```
function Foo(i = null) {
    if (!i) i = 1;
    var j = undefined;
    j = 2;
    this.l = [];
}
var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

### 函数参数是默认可选的

由于在 `ES2015` 之前无法指定可选参数，因此`.js`文件里所有函数参数都被当做是可选的。 使用比预期少的参数调用函数是允许的。

需要注意的一点是，使用过多的参数调用函数会得到一个错误。

例如：

```
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1);       // OK, second argument considered optional
bar(1, 2);
bar(1, 2, 3); // Error, too many arguments
```

使用 `JSDoc` 注解的函数会被从这条规则里移除。 使用 `JSDoc` 可选参数语法来表示可选性。比如：

```
/**
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    console.log('Hello ' + somebody);
}

sayHello();
```

### 由`arguments`推断出的 var-args 参数声明

如果一个函数的函数体内有对`arguments`的引用，那么这个函数会隐式地被认为具有一个 var-arg 参数（比如:`(...arg: any[]) => any`)）。使用 JSDoc 的 var-arg 语法来指定`arguments`的类型。

```
/** @param {...number} args */
function sum(/* numbers */) {
    var total = 0
    for (var i = 0; i < arguments.length; i++) {
      total += arguments[i]
    }
    return total
}
```

### 未指定的类型参数默认为`any`

由于 `JavaScript` 里没有一种自然的语法来指定泛型参数，因此未指定的参数类型默认为`any`。

#### 在 extends 语句中：

例如，`React.Component`被定义成具有两个类型参数，`Props`和`State`。 在一个`.js`文件里，没有一个合法的方式在 `extends` 语句里指定它们。默认地参数类型为`any`：

```
import { Component } from "react";

class MyComponent extends Component {
    render() {
        this.props.b; // Allowed, since this.props is of type any
    }
}
```

使用 `JSDoc` 的`@augments`来明确地指定类型。例如：

```
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
    render() {
        this.props.b; // Error: b does not exist on {a:number}
    }
}
```

#### 在 JSDoc 引用中：

`JSDoc` 里未指定的类型参数默认为`any`：

```
/** @type{Array} */
var x = [];

x.push(1);        // OK
x.push("string"); // OK, x is of type Array<any>

/** @type{Array.<number>} */
var y = [];

y.push(1);        // OK
y.push("string"); // Error, string is not assignable to number
```

#### 在函数调用中

泛型函数的调用使用`arguments`来推断泛型参数。有时候，这个流程不能够推断出类型，大多是因为缺少推断的源；在这种情况下，类型参数类型默认为`any`。例如：

```
var p = new Promise((resolve, reject) => { reject() });

p; // Promise<any>;
```

### 支持的 JSDoc

下面的列表列出了当前所支持的 `JSDoc` 注解，你可以用它们在 `JavaScript` 文件里添加类型信息。

注意，没有在下面列出的标记（例如`@async`）都是还不支持的。

- `@type`
- `@param` (or `@arg` or `@argument`)
- `@returns` (or `@return`)
- `@typedef`
- `@callback`
- `@template`
- `@class` (or `@constructor`)
- `@this`
- `@extends` (or `@augments`)
- `@enum`

它们代表的意义与 `usejsdoc.org` 上面给出的通常是一致的或者是它的超集。 下面的代码描述了它们的区别并给出了一些示例。

#### `@type`

可以使用`@type`标记并引用一个类型名称（原始类型，`TypeScript` 里声明的类型，或在 `JSDoc` 里`@typedef`标记指定的） 可以使用任何 `TypeScript` 类型和大多数 `JSDoc` 类型。

```
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// You can specify an HTML Element with DOM properties
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = '';
```

`@type`可以指定联合类型—例如，`string`和`boolean`类型的联合。

```
/**
 * @type {(string | boolean)}
 */
var sb;
```

注意，括号是可选的。

```
/**
 * @type {string | boolean}
 */
var sb;
```

有多种方式来指定数组类型：

```
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

还可以指定对象字面量类型。 例如，一个带有`a`（字符串）和`b`（数字）属性的对象，使用下面的语法：

```
/** @type {{ a: string, b: number }} */
var var9;
```

可以使用字符串和数字索引签名来指定`map-like`和`array-like`的对象，使用标准的 `JSDoc` 语法或者 `TypeScript` 语法。

```
/**
 * A map-like object that maps arbitrary `string` properties to `number`s.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

这两个类型与 `TypeScript` 里的`{ [x: string]: number }`和`{ [x: number]: any }`是等同的。编译器能识别出这两种语法。

可以使用 `TypeScript` 或 `Closure` 语法指定函数类型。

```
/** @type {function(string, boolean): number} Closure syntax */
var sbn;
/** @type {(s: string, b: boolean) => number} Typescript syntax */
var sbn2;
```

或者直接使用未指定的`Function`类型：

```
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

`Closure` 的其它类型也可以使用：

```
/**
 * @type {*} - can be 'any' type
 */
var star;
/**
 * @type {?} - unknown type (same as 'any')
 */
var question;
```

#### 转换

`TypeScript` 借鉴了 `Closure` 里的转换语法。 在括号表达式前面使用`@type`标记，可以将一种类型转换成另一种类型

```
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString)
```

#### 导入类型

可以使用导入类型从其它文件中导入声明。 这个语法是 `TypeScript` 特有的，与 `JSDoc` 标准不同：

```
/**
 * @param p { import("./a").Pet }
 */
function walk(p) {
    console.log(`Walking ${p.name}...`);
}
```

导入类型也可以使用在类型别名声明中：

```
/**
 * @typedef { import("./a").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

导入类型可以用在从模块中得到一个值的类型。

```
/**
 * @type {typeof import("./a").x }
 */
var x = require("./a").x;
```

#### `@param`和`@returns`

`@param`语法和`@type`相同，但增加了一个参数名。 使用`[]`可以把参数声明为可选的：

```
// Parameters may be declared in a variety of syntactic forms
/**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4){
  // TODO
}
```

函数的返回值类型也是类似的：

```
/**
 * @return {PromiseLike<string>}
 */
function ps(){}

/**
 * @returns {{ a: string, b: number }} - May use '@returns' as well as '@return'
 */
function ab(){}
```

#### `@typedef`, `@callback`, 和 `@param`

`@typedef`可以用来声明复杂类型。 和`@param`类似的语法。

```
/**
 * @typedef {Object} SpecialType - creates a new type named 'SpecialType'
 * @property {string} prop1 - a string property of SpecialType
 * @property {number} prop2 - a number property of SpecialType
 * @property {number=} prop3 - an optional number property of SpecialType
 * @prop {number} [prop4] - an optional number property of SpecialType
 * @prop {number} [prop5=42] - an optional number property of SpecialType with default
 */
/** @type {SpecialType} */
var specialTypeObject;
```

可以在第一行上使用`object`或`Object`。

```
/**
 * @typedef {object} SpecialType1 - creates a new type named 'SpecialType1'
 * @property {string} prop1 - a string property of SpecialType1
 * @property {number} prop2 - a number property of SpecialType1
 * @property {number=} prop3 - an optional number property of SpecialType1
 */
/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param`允许使用相似的语法。 注意，嵌套的属性名必须使用参数名做为前缀：

```
/**
 * @param {Object} options - The shape is the same as SpecialType above
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback`与`@typedef`相似，但它指定函数类型而不是对象类型：

```
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */
/** @type {Predicate} */
const ok = s => !(s.length % 2);
```

当然，所有这些类型都可以使用 `TypeScript` 的语法`@typedef`在一行上声明：

```
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

#### `@template`

使用`@template`声明泛型：

```
/**
 * @template T
 * @param {T} x - A generic parameter that flows through to the return type
 * @return {T}
 */
function id(x){ return x }
```

用逗号或多个标记来声明多个类型参数：

```
/**
 * @template T,U,V
 * @template W,X
 */
```

还可以在参数名前指定类型约束。 只有列表的第一项类型参数会被约束：

```
/**
 * @template {string} K - K must be a string or string literal
 * @template {{ serious(): string }} Seriousalizable - must have a serious method
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

#### `@constructor`

编译器通过`this`属性的赋值来推断构造函数，但你可以让检查更严格提示更友好，你可以添加一个`@constructor`标记：

```
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  this.size = 0;
  this.initialize(data); // Should error, initializer expects a string
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length
}

var c = new C(0);
var result = C(1); // C should only be called with new
```

通过`@constructor`，`this`将在构造函数`C`里被检查，因此你在`initialize`方法里得到一个提示，如果你传入一个数字你还将得到一个错误提示。如果你直接调用`C`而不是构造它，也会得到一个错误。

不幸的是，这意味着那些既能构造也能直接调用的构造函数不能使用`@constructor`。

#### `@this`

编译器通常可以通过上下文来推断出`this`的类型。但你可以使用`@this`来明确指定它的类型：

```
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
    this.clientHeight = parseInt(e) // should be fine!
}
```

#### `@extends`

当 `JavaScript` 类继承了一个基类，无处指定类型参数的类型。而`@extends`标记提供了这样一种方式：

```
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

注意`@extends`只作用于类。当前，无法实现构造函数继承类的情况。

#### `@enum`

`@enum`标记允许你创建一个对象字面量，它的成员都有确定的类型。不同于 `JavaScript` 里大多数的对象字面量，它不允许添加额外成员。

```
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
}
```

注意`@enum`与 `TypeScript` 的`@enum`大不相同，它更加简单。然而，不同于 `TypeScript` 的枚举，`@enum`可以是任何类型：

```
/** @enum {function(number): number} */
const Math = {
  add1: n => n + 1,
  id: n => -n,
  sub1: n => n - 1,
}
```

#### 更多示例

```
var someObj = {
  /**
   * @param {string} param1 - Docs on property assignments work
   */
  x: function(param1){}
};

/**
 * As do docs on variable assignments
 * @return {Window}
 */
let someFunc = function(){};

/**
 * And class methods
 * @param {string} greeting The greeting to use
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * And arrow functions expressions
 * @param {number} x - A multiplier
 */
let myArrow = x => x * x;

/**
 * Which means it works for stateless function components in JSX too
 * @param {{a: string, b: number}} test - Some param
 */
var fc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * A parameter can be a class constructor, using Closure syntax.
 *
 * @param {{new(...args: any[]): object}} C - The class to register
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn10(p1){}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn9(p1) {
  return p1.join();
}
```

#### 已知不支持的模式

在值空间中将对象视为类型是不可以的，除非对象创建了类型，如构造函数。

```
function aNormalFunction() {

}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * Use 'typeof' instead:
 * @type {typeof aNormalFunction}
 */
var right;
```

对象字面量属性上的`=`后缀不能指定这个属性是可选的：

```
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * Use postfix question on the property name instead:
 * @type {{ a: string, b?: number }}
 */
var right;
```

`Nullable`类型只在启用了`strictNullChecks`检查时才启作用：

```
/**
 * @type {?number}
 * With strictNullChecks: true -- number | null
 * With strictNullChecks: off  -- number
 */
var nullable;
```

`Non-nullable`类型没有意义，以其原类型对待：

```
/**
 * @type {!number}
 * Just has type number
 */
var normal;
```

不同于 `JSDoc` 类型系统，`TypeScript` 只允许将类型标记为包不包含`null`。 如果启用了`strictNullChecks`，那么`number`是非`null`的。 如果没有启用，那么`number`是可以为`null`的。

### 参考

- [TS Handbook 中文版 - JavaScript 文件里的类型检查](https://github.com/zhongsp/TypeScript/blob/dev/zh/javascript/type-checking-javascript-files.md)