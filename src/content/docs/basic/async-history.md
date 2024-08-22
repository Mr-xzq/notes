---
title: 简述 JS 异步发展不同阶段
---

[Generator]: /basic/generator
[Generator 自动执行]: /basic/generator#自动执行-generator

# 简述 JS 异步发展不同阶段

> 下面用顺序读取三个文件为例子

![JS异步不同方式](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/JS异步不同方式.jpg)

## Callback

> `node`早期`API`中基本都是采用回调函数的方式。

如果要顺序读取三个文件，这里就会有一个历史经典的问题：回调地区（`callback hell`），这里明显的缺陷就是：

1. 代码层级嵌套过深，看着就恶心；
2. 里外层代码之间强耦合，非常不宜维护，修改其中一层代码，可能会影响到别的很多层都得改；

```js
const fs = require("fs");
fs.readFile(demo1TxtPath, { encoding: "utf-8" }, (err, data) => {
  try {
    if (err) throw err;
    console.log(data);
    fs.readFile(demo2TxtPath, { encoding: "utf-8" }, (err, data) => {
      try {
        if (err) throw err;
        console.log(data);
        fs.readFile(demo3TxtPath, { encoding: "utf-8" }, (err, data) => {
          try {
            if (err) throw err;
            console.log(data);
            fs.readFile();
          } catch (error) {}
        });
      } catch (error) {}
    });
  } catch (error) {}
});
```

因此，`Promise`横空出世，它的出现很大一部分原因，就是为了解决控制异步函数顺序执行中使用 `callback` 所带来的回调地狱的问题。

## Promise

> `Promise` 是异步编程的一种解决方案，比传统的解决方案`callback(回调函数)`更合理和更强大。
>
> 它最早是由社区提出和实现，`ES6` 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

```js
const fsPromise = require("fs/promises");
fsPromise
  .readFile(demo1TxtPath, { encoding: "utf-8" })
  .then((data) => {
    console.log(data);
    return fsPromise.readFile(demo2TxtPath, { encoding: "utf-8" });
  })
  .then((data) => {
    console.log(data);
    return fsPromise.readFile(demo3TxtPath, { encoding: "utf-8" });
  })
  .then((data) => console.log(data));
```

这里发现，虽然`Promise + then` 解决了回调地狱的问题，但是，不同的异步操作之间多了很多冗余代码，看着也很难受。

## Generator + yield

> [Generator] 函数是 `ES6` 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

```js
function* generatorReadFile() {
  try {
    // 每一个 yield 表达式的后面都是一个运行结果 Promise 对象的表达式
    const data1 = yield fsPromise.readFile(demo1TxtPath, { encoding: "utf-8" });
    console.log("data1: ", data1);
    const data2 = yield fsPromise.readFile(demo2TxtPath, { encoding: "utf-8" });
    console.log("data2: ", data2);
    const data3 = yield fsPromise.readFile(demo3TxtPath, { encoding: "utf-8" });
    console.log("data3: ", data3);
  } catch (error) {
    console.log("e", error);
  }
}
// 自动执行(yield 后面必须是 Promise)
function runByPromise(generator) {
  const g = generator();
  function cb(data) {
    const { value, done } = g.next(data);
    if (done) return;
    value.then(cb);
  }
  cb();
}
runByPromise(generatorReadFile);
```

通过`generator + yield + promise + runByPromise(自动执行)`也完成了异步操作顺序执行的效果。

虽说后面的自动执行可以封装起来，在用的地方直接用就行，但是强依赖于自动执行。

并且`function* fnName`的 [Generator] 的写法总感觉有点不太自由。

## async + await

> `ES2017` 标准引入了 `async` 函数，使得异步操作变得更加方便。
>
> `async` 函数是什么？一句话，它就是 [Generator] 函数的语法糖。

```js
async function asyncReadFile() {
  try {
    const data1 = await fsPromise.readFile(demo1TxtPath, { encoding: "utf-8" });
    console.log("data1: ", data1);
    const data2 = await fsPromise.readFile(demo1TxtPath, { encoding: "utf-8" });
    console.log("data2: ", data2);
    const data3 = await fsPromise.readFile(demo1TxtPath, { encoding: "utf-8" });
    console.log("data3: ", data3);
  } catch (error) {
    console.log("e", error);
  }
}
```

相比于`generator + yield + promise + runByPromise(自动执行)`，这里不需要 自动执行 这一步，这里其实也能看出，`async await`其实就是对自动执行进行了封装。

这是目前异步操作的终极解决方案。

## async, await和 Generator 的关系

> `async, await`就是 `Generator + yield` 的语法糖。
>
> `async`函数的实现原理，就是将 [Generator] 函数和 [Generator 自动执行]，包装在一个函数里。

```js
async function fn(args) {
  // 代码 a b c
}

// 等同于
function coAsync() {...}
function* gen() {
 // 代码 a b c
}

function fn(args) {
  return coAsync(gen)
}
```

所有的`async`函数都可以写成上面的第二种形式，其中的`coAsync`函数就是 [自动执行器][Generator 自动执行]。

下面给出`coAsync`函数的实现，也就是 [Generator] 的 [自动执行器][Generator 自动执行]（自动执行到 [Generator] 终止）。

```js
function coAsync(genF) {
  return new Promise(function (resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        // next: { value: cb, done: fasle / true }
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      // 如果 Generator 执行完之后, 函数终止, 且Promise状态由 pending 变化为 fulfilled
      if (next.done) {
        return resolve(next.value);
      }

      // 对cb 进行拆分程三种情况
      function cb(status = "v", val) {
        if (status === "v") {
          step((val) => gen.next(val));
        } else if (status === "e") {
          step((e) => gen.throw(e));
        } else {
          step(() => gen.next());
        }
      }
      // 恢复 Generator的执行, 这里的Promise.resolve('xxx') 一定程度上可以等价为 new Promise((resolve, reject) => resolve('xxx'))
      // 关于这句话的疑惑, 可以参考 https://es6.ruanyifeng.com/#docs/promise#Promise-resolve

      // 这里看得出来, 这个 next.value 目前只支持 Promise 类型的, 如果需要支持 thunk 类型的, 那么需要将 thunk 类型的 next.value 包装成 Promise 然后进行操作

      // 如果next.value 就是一个 Promise, 那么这里等同于 next.value.then(xxx).catch(xxx)
      Promise.resolve(next.value)
        .then((v) => cb("v", v))
        .catch((e) => cb("e", e));
    }
    // 递归, 初始启动
    step(() => gen.next());
  });
}
```

这里我们也看得出为什么`async`函数的返回值是一个`Promise`。

关于`Promise`用法的疑惑请参考：https://es6.ruanyifeng.com/#docs/promise。
