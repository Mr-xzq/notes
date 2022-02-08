# Generator 基本概念和使用

## 初步理解 Generator

> `Generator` 函数是 `ES6` 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

### 对 Generator 的理解

1. 状态机，内部封装了多个状态；
2. 遍历器对象生成函数，执行`Generator`会得到一个遍历器对象；

### Generator 的语法特征

1. `function`关键字和函数名之间有 `*`；
2. 内部可以使用`yield`表达式；

```js
// 这里的 one, two, three 可以看作该 Generator 函数内部封装的三个状态
function* oneTwoThreeGenerator() {
  yield 'one'
  yield 'two'
  return 'trhee'
}

// 返回一个具有 next 方法的对象(也就是遍历器对象), next 可以访问 Generator 函数内部封装的状态 
const oneTwoThreeGeneratorExec = oneTwoThreeGenerator()
// Object [Generator] {}, 该对象具有 next 方法
console.log('oneTwoThreeGeneratorExec: ', oneTwoThreeGeneratorExec) 

// 每一次 next, 都会返回当前指针指向的那个值, 然后封装成 --> { value: xxx, done: false / true }, done 表明当前是否遍历完, value 表示指针指向的那个状态
// 如果 done 为 true, 则表明当前指针已经指向 oneTwoThreeGenerator (状态机)最后的一个状态
// console.log('oneTwoThreeGeneratorExec.next(): ', oneTwoThreeGeneratorExec.next()) // { value: 'one', done: false }
// console.log('oneTwoThreeGeneratorExec.next(): ', oneTwoThreeGeneratorExec.next()) // { value: 'two', done: false }
// console.log('oneTwoThreeGeneratorExec.next(): ', oneTwoThreeGeneratorExec.next()) // { value: 'three', done: true }
// console.log('oneTwoThreeGeneratorExec.next(): ', oneTwoThreeGeneratorExec.next()) // { value: 'undefined', done: true }
```



## yield 表达式

> `yield` 表达式只能用在 `Generator` 函数中，并且在 `Generator` 函数的执行过程中，只要遇到 `yield`表达式， `Generator` 函数就会将执行权交出去（也就是暂停执行）。
>
> 只有在遍历器对象调用`next(), throw(), return()...`的时候，`Generator`函数才会恢复执行。

### yield 的特征

1. 遇到`yield`表达式`Generator` 函数暂停执行；

2. `yield`表达式后面的表达式会作为`next()`的返回值中的 `value` 返回出去，比如：

   `yield 1 ---> { value: 1, done: boolean }`；

3. `yield`用在别的表达式中时，自己需要被`()`包裹起来。有两种情况例外：

   + 用作函数的参数；
   + 赋值表达式的右边；

```js
function foo(param1, param2) {
  console.log(param1, param2)
}
function* funcDemo4() {
  // const a = 2 + yield 1 // error
  // console.log('b', 2 * yield 1 + 2) // error

  // 函数的参数
  foo(yield 1, yield 2)

  // 赋值表达式的右边
  const c = yield 3
  console.log('c: ', c)
}
const funcDemo4Exec = funcDemo4()
funcDemo4Exec.next()
funcDemo4Exec.next()
// 为什么这一次 next, foo 函数才执行, 这里可以思考一下
funcDemo4Exec.next()
```



### Generator 函数的执行流程

1. 遇到`yield`表达式`Generator` 函数暂停执行；

2. 调用`next()`方法恢复执行，然后重复第`1`步；

3. 当遇到`return xxx` 时，将`{value: xxx, done: true}`返回出去之后，终止执行。

   这里要注意的是，如果函数没有显式的`return xxx`，也会有隐式的`return undefined`在函数的结尾；

4. 终止之后，后续所有的`next()`的结果都是`{value: undefined, done: true}`；



```js
function foo(param1, param2) {
  console.log(param1, param2)
}
function* funcDemo4() {
  // const a = 2 + yield 1 // error
  // console.log('b', 2 * yield 1 + 2) // error

  // 函数的参数
  foo(yield 1, yield 2)

  // 赋值表达式的右边
  const c = yield 3
  console.log('c: ', c)
}

// 这个 next 的顺序我们得理一理:
const funcDemo4Exec = funcDemo4()

// { value: 1, done: false }, 指针指向第一个 yield 1 表达式, 此时这个 next 还不算经过 foo 函数, 所以 foo 还没有被执行
console.log('funcDemo4Exec.next(): ', funcDemo4Exec.next())
// { value: 2, done: false }, 指针指向第二个 yield 2 表达式, 此时这个 next 还不算经过 foo 函数, 所以 foo 还没有被执行
console.log('funcDemo4Exec.next(): ', funcDemo4Exec.next())
// 此时调用 next, 指针继续往下走, 去找暂停点( yield 或者 return ), 找到 yield 3, 此时 next 指向该 yield 表达式, 途中经过了 foo 函数, 因此 foo 被执行了 会输出 ( undefined, undefined ), 这里也表明 yield 表达式的默认值是 undefined
// 这里指针的走向是: yield 2 ---> yield 3
console.log('funcDemo4Exec.next(): ', funcDemo4Exec.next())

// 这里在调用 next, 指针由 yield3 ---> return undefined(函数最后隐式返回), 途中经过了   console.log('c: ', c), 因此会有输出 ( 'c': undefined )
console.log('funcDemo4Exec.next(): ', funcDemo4Exec.next())

/**
 * 这里输出结果的顺序是:
 * funcDemo4Exec.next():  { value: 1, done: false }
 * funcDemo4Exec.next():  { value: 2, done: false }       
 * undefined undefined
 * funcDemo4Exec.next():  { value: 3, done: false }
 * c:  undefined
 * funcDemo4Exec.next():  { value: undefined, done: true }
 */

```



### Generator 函数内部 return 和 yield 的区别

相同点：

1. 两者后面的表达式的值都可以被封装成`{ value: xxx, done: xxx }` 返回出去作为 `next` 函数的返回值；
2. 都是`Generator`函数执行的暂停点；

不同点：

1. 在`Generator`函数的执行过程中：

   + 遇到`return`之后，该`Generator`的执行状态就变为终止了，后面的语句都不会被执行到了（除非遇到`try...finally`，具体请看 [Generator.prototype.return](#return-方法)），反复调用`next`，得到的只能是`{done: true, value: undefined}`，也就是说同一个`Generator`函数中只有一个`return`会生效；

   + 而遇到`yield`表达式，`Generator`函数的执行状态只是变为暂停，当你再次调用`next`时，该函数还会继续往下执行，也就是说同一个`Generator`函数中可以有多个`yield`生效；

```js
// 在 return 3 之后的语句不会执行
function* funcDemo2() {
  yield 1
  yield 2
  return 3
  return 4
  console.log('after return in Generator')
  yield 5
}
const funcDemo2Exec = funcDemo2()
// { value: 1, done: false }
console.log('funcDemo2Exec.next(): ', funcDemo2Exec.next()) 
// { value: 2, done: false }
console.log('funcDemo2Exec.next(): ', funcDemo2Exec.next()) 

// { value: 3, done: true }, 这里执行到 return, done 直接变为 true, 后续的 next 将会一直返回 { value: undefined, done: true }
console.log('funcDemo2Exec.next(): ', funcDemo2Exec.next())
// Generator 函数终止之后返回的值: { value: undefined, done: true }
console.log('funcDemo2Exec.next(): ', funcDemo2Exec.next()) 
```

## Generator 和 Interator 的关系

> `Symbol.iterator`是一个常量值，类型是 `Symbol` 类型。
>
> 任意一个对象，只要具有`obj[Symbol.iterator] === Generator`，那么它就可以被迭代。
>
> 常见的有四种操作会隐式的用到迭代：
>
> 1. `Array.from(obj)`；
> 
> 2. `[...obj] ----> 扩展运算符`；
> 
> 3. `let [ a, b, c ] = obj ----> 解构赋值`；
> 
> 4. `for(let xxx of obj) {}`；
>
> 注意的是：
>
> 1. 对象的展开：`{...obj}`用到的不是迭代；
>
> 2. 迭代会自动调用`next`， 取出其中的`next`返回值中的`value`，一直到`{done: true}`就终止，
>
>    并且忽略终止时的`value(done 为 true 时, value 对应的值)`；

```js
let obj = { name: 'xzq', age: 18 }
// Array.from(obj)
// 这里我们知道 obj 上没有 [Symbol.iterator] 对应的方法, 因此 直接 返回 空数组
// console.log('Array.from(obj): ', Array.from(obj)); // []

obj[Symbol.iterator] = function* () {
  yield 1
  yield 2
  return 3
}

// 这里忽略的最后的 3, 因为此时的 done: true
// console.log('Array.from(obj): ', Array.from(obj)); // [1, 2]
// console.log([...obj]) // [1, 2]
// let [ a, b ] = obj // a: 1, b: 2
```

### 调用遍历器对象的 Symbol.iterator 属性得到的遍历器对象等于该遍历器对象自身

```js
function* demoFunc4() {
  yield 1
  yield 2
}

// 调用定义的 Generator 函数得到遍历器对象 demoFunc4Exec
const demoFunc4Exec = demoFunc4()
// demoFunc4Exec 的 Symbol.iterator 属性也是一个 Generator 函数
// 调用其得到一个遍历器对象 selfDemoFunc4Exec
const selfDemoFunc4Exec = demoFunc4Exec[Symbol.iterator]()
// demoFunc4Exec 和 selfDemoFunc4Exec 等同
console.log(selfDemoFunc4Exec === demoFunc4Exec) // true

// 这里要注意的是, 可能是因为语法层面的限制, 如果你用下面的写法得到的就是 false
// 很奇怪, 不知道为什么
// 先得到 Generator 函数
// const selfDemoFunc4 = demoFunc4Exec[Symbol.iterator]
// 然后通过 Generator 函数得到遍历器对象
// const selfDemoFunc4Exec = selfDemoFunc4.call(selfDemoFunc4)
// console.log(selfDemoFunc4Exec === demoFunc4Exec) // false


// 这就意味着, 你同样可以迭代遍历器对象, 因为它同样具有[Symbol.iterator]
for(let res of demoFunc4()) {
  console.log(res) // 1, 2
}
```

## next 方法的参数

> 首先我们知道，`yield expression`后面的`expression`会封装为`{value: expression, done: boolean}`作为外界的`next()`的返回值。
> 
> 如果`yield`后面没有表达式， 那么此时认为`expresstion`为`undefined`。
>
> 这就可以看作`Generator`函数内部向外部通信的一种方式，那么是否有一种外部向内部通信的方式呢？
>
> 这里`next(param)`传递的 `param`，就是向内部传值的一种方式。

### next 参数是如何传递的？

遍历器对象调用`next(param)`时，`Generator`会先将指针的起点（执行`next(param)`移动指针之前）指向的 `yield expression`整体替换成`param`， 然后指针会由暂停到开始往下移动，然后执行代码，直到遇到`yield, return, throw...`才暂停。

这里可以看到，当`next(param)`第一次执行的时候，指针是由`函数开始  ----> 第一个 yield expression`，也就是说指针的起点并不是`yield expression`，那么当前没有可以替换的值，所以第一次`next(param)`传入的参数会被是无效的（会被`v8`引擎忽略）。

`next`只能传递一个参数，如果同时传递多个参数，后面的参数会被忽略。

```js
function* demoFunc1() {
  // res1: undefined
  const res1 = yield 1
  console.log('res1', res1) // res1 hello
  const res2 = yield 2
  console.log('res2', res2) // world
}

const demoFunc1Exec = demoFunc1()

// next(param) 中的 param 会替换指针起点的 yield 表达式(第一个 next 传递的参数是无效的)

// 函数开始 --> yield 1
// { value: 1, done: false }
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next('无效的参数')) 

// yield 1 --> yield 2
// { value: 1, done: false }  const res1 = 'hello'
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next('hello')) 

// yield 2 --> return undefined
// 这里 next 只能接收一个参数, 后面多出来的参数是无效的
// { value: 1, done: false } const res2 = 'world'
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next('world', '无效的参数'))
demoFunc1Exec.next() // { value: undefined, done: true }
```



### next 调用后，Generator 内部是如何执行的

> 我们知道，当`next`调用时，`Generator`内部指针会移动，当指针移动到 `yield expression`时，`expression`会先执行，然后指针会暂停住。 

请看下面的例子：

```js
function* demoFunc3() {
  while (true) {
    // end 初始值: undefined
    let end = yield console.log('next 后, 先执行 yield 后的表达式')
    console.log('end', end)
    if (end) break
  }
}
const demoFunc3Exec = demoFunc3()

// 函数开始 --> yield console.log('next 后, 先执行 yield 后的表达式')
// 执行指针结尾指向的 yield 后的表达式, 表达式的返回值可以通过 next() 获取到, 这里我们知道 console.log() 的返回值为 undefined
console.log(demoFunc3Exec.next()) // { value: undefined, done: false }

// 上一次指针的结尾就是下一次指针的起点

// next(true) 传递的参数为 true, 先将指针的起点（移动指针之前）指向的 yield console.log('next 后, 先执行 yield 后的表达式')替换为 true
// 然后指针开始向下移动, let end = true --> xxx
// 在指针移动的过程中, 执行了 let end = true, 然后 if(true) break, 那么就退出了循环
// 这里等于说指针走向为: yield --> return undefined
console.log(demoFunc3Exec.next(true)) // { value: undefined, done: true }
// 已经终止
console.log(demoFunc3Exec.next()) // { value: undefined, done: true }
```

### 总结

这里`next`执行过程是先将`Generator`函数内部指针的起点（执行`next(param)`移动指针之前指向的`yield`）替换为`next`传入的参数，然后再往下执行。

这里其实你也可以发现，只有当指针移动之后，上一行的 `JS` 语句才会执行。比如：`let end = yield xxx`。

遇到`yield, return, throw...`再暂停。

## throw 方法

> `throw(param)`同样可以传参， 如果没有显式的传，那么此时`param`被视作`undefined`，然后 `(throw param)`替换`yield expression`整体。
>
> `throw()`什么情况有返回值，那就是此时`Generator`函数的内部指针必须指向`yield 或者 return`。

### Generator 函数体内部的异常被外部捕获

```js
function* demoFunc1(){
  yield 1
  // 内部没有 try catch, 有了未捕获的异常, Generator 函数直接终止
  
  // 这个代码不会执行
  console.log(1)
}
const demoFunc1Exec = demoFunc1()
// Generator 函数内部指针: 函数开始执行 --> yield 1
demoFunc1Exec.next()

try {
  // 先替换 yield 1 变为 throw undefined, 然后会隐式调用 next(), 然后指针开始往下, 代码开始执行, 先发现内部没有 try...catch
  // 异常往外冒泡, 被外部 try...catch 捕获
  demoFunc1Exec.throw() // 此时的 throw() 没有返回值, 因为此时的指针没有指向 yield 或者 return, 函数直接异常终止了
}catch(e) {
  console.log('外部捕获: ', e) // ‘外部捕获’: undefined(因为 throw undefined)
}

```



### Generator 函数体外部可以抛异常让其内部捕获

```js
function* demoFunc1() {
  try {
    yield 1
  } catch (e) {
    console.log('内部捕获: ', e) // 内部捕获:  undefined
  }
  console.log(1) 
  yield 2
}
const demoFunc1Exec = demoFunc1()
// Generator 函数内部指针: 函数开始执行 --> yield 1
demoFunc1Exec.next()

// 先替换 yield 1 变为 throw undefined, 然后会隐式调用 next(), 然后指针开始往下, 代码开始执行, 先发现内部有 try...catch
// 异常被内部 try...catch 捕获, 指针正常往下, 执行经过的 console.log(1), 直到遇到 yield 2 时停止, 然后指针此时指向 yield 2, 此时的 throw() 就有返回值了 { value: 2, done: false }
demoFunc1Exec.throw()
```



### Generator 函数体内部的异常被内部捕获

```js
function* demoFunc1() {
  try {
    yield 1
  } catch (e) {
    console.log('内部捕获: ', e) // 内部捕获:  outside generator error
    throw 'inner generator error'
  }
  console.log(1) 
  yield 2
}
const demoFunc1Exec = demoFunc1()
// Generator函数内部指针: 函数开始执行 --> yield 1
demoFunc1Exec.next()

try {
  // 先替换 yield 1 变为 throw 'outside generator error', 然后隐式调用 next(), 然后指针开始往下, 代码开始执行, 先发现内部有 try...catch
  // 异常被内部 try...catch 捕获, 指针正常往下, 执行经过的 catch 代码块里的 console.log('内部捕获: ', e),  然后执行: throw 'inner generator error'
  // 抛出异常, 发现内部没有 try 捕获了, 因此 next 此时指向 throw 语句, 也就意味着 throw() 没有返回值了, generator 函数直接终止, 然后 done 直接被置为 true, 以后的 next() 返回值都为 { value: undefined, done: true }
  // 最后你会发现内部未捕获的异常冒泡到外部, 被外部的 try 捕获
  demoFunc1Exec.throw('outside generator error')
}catch(e){
  console.log('外部捕获', e) // 外部捕获 inner generator error
}

// demoFunc1Exec.next()
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next()) // {value: undefined, done: true}
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next()) // {value: undefined, done: true}
console.log('demoFunc1Exec.next(): ', demoFunc1Exec.next()) // {value: undefined, done: true}

```

### 如果多次调用 throw

```js
function* demoFunc1() {
  try {
    yield 1
  } catch (e) {
    console.log('内部捕获: ', e) // 内部捕获:  undefined
  }
  console.log(1) 
  yield 2
}
const demoFunc1Exec = demoFunc1()
// Generator 函数内部指针: 函数开始执行 --> yield 1
demoFunc1Exec.next()

// 先替换 yield 1 变为 throw undefined, 然后隐式调用 next(), 然后指针开始往下, 代码开始执行, 先发现内部有 try...catch
// 异常被内部 try...catch 捕获, 指针正常往下,  执行经过的 console.log(1), 直到遇到 yield 2 时停止
demoFunc1Exec.throw()

// 先替换 yield 2 为 throw undefined, 然后隐式调用 next(), 然后指针开始往下, 代码开始执行, 发现内部没有 try...catch 代码, 而 next 此时指向 throw 语句, 不能正常继续往下指向 return undefined, 因此此时的 throw() 没有返回值
// Generator 函数终止, 后面如果再次手动调用 next(), 返回值 { done: true, value: undefined }
// 异常往外冒泡, 外界也没有 try...catch, 发现未捕获的异常
demoFunc1Exec.throw()
```

也就是说，内部的`try...catch`只能捕获外界的一个 `generator.throw()`，这是因为`throw()`还会隐式的调用`next()`。

## return 方法

首先来个简单的例子：

```js
function* demoFunc5() {
  let data1 = yield 1
  yield 2
  yield 3
}
const demoFunc5Exec = demoFunc5()

// Generator 内部指针: 函数开始执行 --> yield 1
console.log('demoFunc5Exec.next(): ', demoFunc5Exec.next()) // { value: 1, done: false }

// 此时指针指向 yield 1, 将其替换为 return 'return', 然后隐式调用 next(), 指针往下移动, 然后执行 let data1 = return 'return'
// 等于说指针走向为: yield1 --> return 'return', 那么此时 Generator 等于说运行完了
console.log(`demoFunc5Exec.return('return'): `, demoFunc5Exec.return('return')) // { value: 'return', done: true }
console.log('demoFunc5Exec.next(): ', demoFunc5Exec.next()) // { value: undefined, done: true }

```

> `return` 一般情况都会终止函数的执行，但是有个特殊情况，那就是遇到 `try...finally`。这时，`return` 会延迟到 `finally` 中的代码执行完再执行。

```js
try {
  console.log('try --- 1')
  console.log('try --- 2')
  return
  console.log('不会执行: try --- 3')
}finally {
  console.log('会执行: finally')
}
console.log('不会执行')

// 这里的输出结果是: try --- 1, try --- 2, 会执行: finally
```

所以接下来结合`Generator.prototype.return`的示例你就明白了：

```js
function* demoFunc5() {
  try {
    let data1 = yield 1
    console.log('data1: ', data1);
    // 跳过执行, 直接进入 finally 中
    let data2 = yield 2
    console.log('data2: ', data2);
    let data3 = yield 3
    console.log('data3: ', data3);
  }finally {
    console.log('不会被 return 所终止')
    let data4 = yield 4
    console.log('data4: ', data4);
  }
  console.log('会被 return 所终止')
  let data5 = yield 5
  console.log('data5: ', data5);
}
const demoFunc5Exec = demoFunc5()

// Generator内部指针: 函数开始执行 --> yield 1
demoFunc5Exec.next()

// 此时指针指向 yield 1, 将其替换为 return 'return', 然后隐式调用 next(), 指针往下移动, 然后执行 let data1 = return 'return',
// 那么暂时当前指针走向为 yield1 --> return 'return', 结合前文函数中遇到 return 时会先执行 finally 中的代码, 然后再执行 return
// 因此指针直接进入 finally
// 然后执行  console.log('不会被 return 所终止'), 当指针遇到  yield 4 时暂停
// 那么此时真正的指针走向为 yield1 --> yield 4
console.log(`demoFunc5Exec.return('return'): `, demoFunc5Exec.return('return')); // { value: 4, done: false }

// finally 执行完之后再返回去执行 return
// 因此指针走向为 yield 4 --> return 'return', 过程中会经过 console.log('data4: ', undefined)。
// 这里我们会发现, return 一直延迟到 finally 中的代码执行完之后, 才执行。
console.log('demoFunc5Exec.next(): ', demoFunc5Exec.next()); // { value: 'return', done: true }
console.log('demoFunc5Exec.next(): ', demoFunc5Exec.next()); // { value: undefined, done: true }
```

## throw，return，next 总结

1. 三者都是让`Generator`恢复执行的操作，也就是可以理解为`throw, return`都具有`next`的操作；
2. 三者都能通过传递参数的方式向`Generator`内部传递一定的信息：
   + `throw(error)` 可以向内部传递`error`；
   + `return(value) 和 next(value)` 可以向内部传递`value`；
3. `throw, return, next`三者可以理解为先替换`yield expression`，而且总是先替换指针的起点（执行`next(param)`移动指针之前）指向的`yield expression`，然后再执行`next`，指针才往下执行；
4. 三者的返回值都是当前指针末尾指向(也就是调用 `next()`指针移动之后的指向)的 `yield xx, return xx ...` 表达式的值 (`{ value: xx, done: boolean }`)；

## yield* 表达式

> 当遇到嵌套`Generator`函数的时候，外部没有一种很好的方式能够使得内部的`Generator`进行迭代。
> 
> 这个时候如果我们手动迭代就很麻烦，` yield*`就是为了解决这种情况出现的。

```js
function* insideFunc1() {
  yield '内部1'
  yield '内部2'
  return '内部终止'
}

function* outsideFunc1() {

  // 如果不在内部自己遍历的话, 这个内部的 遍历器 将永远 暂停执行
  // insideFunc1()
  yield console.log('外部1')

  // 手动递归太麻烦, 而且会忽略 done 为 true 时的值, 也就是 return 的值
  // 具体可以参考前面的章节 Generator 和 Interator 的关系
  for (let insideRes of insideFunc1()) {
    console.log('insideRes: ', insideRes)
  }

  // 使用 yield* 更加优雅, 且不会忽略 done 为 true 时的值
  // 这个内部 return 的值会作为 yield* insideFunc1() 的返回值拿出来
  // 而上面那种手动递归的方式显然没有方法拿到这个内部 return 的值
  const insideRetureVal = yield* insideFunc1()
  yield console.log('外部2')
  return console.log('外部终止')
}

const outsideFunc1Exec = outsideFunc1()

// 对于 yield* 的方式, 我们外部的 next 可以访问到内部
// outsideFunc1Exec.next()
// outsideFunc1Exec.next() // 这一步才执行 内部的 遍历
// outsideFunc1Exec.next() // { value: undefined, dont: true }
// outsideFunc1Exec.next()
```



### yield* 和常规迭代方式的异同

我们知道常规的会触发迭代的方式有`4`种：`for...of, let [a, b] = arr, [...arr], Array.from()`。

它们的相同点：

1. 都可以对部署了`[Symbol.iterator]`接口（也就是 `obj[Symbol.iterator] === Generator`）的进行迭代，`yield* [], yield* Generator(); for(let res of []), for(let res of Generator())`；
 
它们的不同点：

1. `yield*`不会忽略 `{ value: xxx, done: true }`，其中`done`为`true`时的`value`。而后者会忽略；
2. `yield*`不是自动迭代，而是在外部`Generator`进行`next`的时候，让这个`next`可以执行到 `yield*`后面的`Generator`内部；
3. 常规迭代方式可以自动迭代，而且获取到其中的`value`；

```js
function* innersideFunc4() {
  yield '内部执行1'
  yield '内部执行2'
  return '内部执行终止'
}

function* outsideFunc4() {
  const v = yield* innersideFunc4()
  // 这里可以拿到内部 return 的值, 并且不会终止掉外部 Generator
  console.log('v: ', v);
  yield '外部执行1'
  return '外部执行终止'

  // 等同于(后者会忽略 done 为 true 时的 value )
  // for (const iterator of innersideFunc4()) {
  //   yield(iterator)
  // }

}
const outsideFunc4Exec = outsideFunc4()

// 函数开始 --> yield '内部执行1'
// { value: '内部执行1', done: false }
console.log('outsideFunc4Exec.next(): ', outsideFunc4Exec.next()); 

// yield '内部执行1' --> yield '内部执行2'
// { value: '内部执行2', done: false }
console.log('outsideFunc4Exec.next(): ', outsideFunc4Exec.next()); 

// 这里需要注意的是，当遇见内部的 return 时不会终止掉外部的 Generator 函数，而是终止内部，然后指针跳到外部
// yield '内部执行2' --> return '内部执行终止'(它会作为 yield* 表达式的值) --> yield '外部执行1'
// 这个过程中会执行 console.log('v: ', '内部执行终止')
// { value: '外部执行1', done: false }
console.log('outsideFunc4Exec.next(): ', outsideFunc4Exec.next()); 

// yield '外部执行1' --> return '外部执行终止'
// { value: '外部执行终止', done: true }
console.log('outsideFunc4Exec.next(): ', outsideFunc4Exec.next()); 

// { value: 'undefined', done: true }
console.log('outsideFunc4Exec.next(): ', outsideFunc4Exec.next()); 
```

## Generator 结合异步操作

### 异步操作同步表达

```js
function* stepGen() {
  yield Promise.resolve.then(() => console.log(1))
  yield console.log(2)
  yield Promise.resolve.then(() => console.log(3))
}
const stepGenExec = stepGen()
let done = false
while(!done) {
 done = stepGenExec.next().done
}
```

虽说能够同步表达，但是由于在外部的`while`中是同步代码，而`Promise.resolve().then`是异步代码，因此这里执行顺序有时候并不会如我们想象那样。

这里我们需要结合`Thunk`或者`Promise`来在合适的时候交回`Generator`的执行权，也就是说我需要知道异步函数何时执行完。

而不是直接无脑直接`next`。

### 结合 Promise 或者 Thunk 实现真正异步操作同步化

#### 结合 Thunk 来实现

首先什么`Thunk`呢？

在传统编程概念中, 对于函数的传参有两种情况:

1. 传名调用(调用的时候再求值)；

2. 传参调用(先求值, 当作参数放进去)；

```js
const log = console.log.bind(console)
function demo1(param1, skip) {
  if (skip) return
  // 针对将 param1 改造成了 thunk 的形式
  if (typeof param1 === 'function') {
    param1 = param1()
  }
  log('param1: ', param1)
}

// log(1 + 2)
// 对于 传名调用  是将 1 + 2 传进去, 然后调用 log() 时再求值
// 对于 传参调用  是先在外面求和, 然后将 3 传入进去

// 有些时候, 如果参数计算比较复杂, 这个时候类似于 按需加载 的传名调用效率肯定更高
const demo1Param1 = () => new Array(1000).fill(100).reduce((prev, item) => prev + item, 0)
// 针对这种情况先求和, 在放入进去, 而且这个时候, 在函数中甚至还有可能没有用到该参数
// 现然这个时候造成了一定程度上的性能上的浪费
// log(demo1Param1(), true)

// 这个时候, 出现了一种 thunk 的概念来解决这种情况, 它是一种将传名调用 --> 传参调用的一种方式
function demo1Thunk1(param1) {
  return param1
}
// 将参数通过 thunk 函数包裹, 然后传入进去, 再需要的时候再 调用该函数 得到原本的参数
// log(demo1Thunk1(demo1Param1))
```

这里就看的出来，对于传参调用，有时候会造成性能上的损失，而传名调用，就可以避免这个问题，类似于按需加载。

而`thunk`在其中就是用来 将传名调用 --> 传参调用的一种方式，多个参数被放到一个临时函数中，在需要的时候再调用这个临时函数，这个临时函数就是传统意义上的`thunk`函数。

但是在`JS`中用法和这常规用法又有所不同，在`JS`中`thunk`也是一个临时函数，只不过他其中放的不是多个参数，而是一个函数，它就是一个被改造了对原函数的传参方式的函数。

在`JS`中，必须是参数中有回调的函数，才会被认为能够转化为`thunk`，这点很特殊。

```js
const fs = require('fs')
function transForm2Thunk(fn) {
  // 第一次执行, 将其他的参数传入当前函数, 返回一个函数
  return function (...args) {
    // 第二次真正执行, 传入回调函数
    return function (cb) {
      return fn.call(this, ...args, cb)
    }
  }
}
const readFileThunk = transForm2Thunk(fs.readFile)(path, {encoding: 'utf-8'...options})

// 多参数时的 readFile
readFile(path, {encoding: 'utf-8'...options}, cb)

// thunk 版, 传参方式发生改变
readFileThunk(cb)
```



接下来结合`thunk`，来让`Generator`能够实现异步操作同步表达：

```js
// 同步表达
function* demoFunc2() {
  try {
    // yield 后表达式的返回值会传到外界 --> { value: xx, done: false }
    const data1 = yield readFileThunk(demo1TxtPath, { encoding: 'utf-8' })
    console.log('data1: ', data1)
    const data2 = yield readFileThunk(demo2TxtPath, { encoding: 'utf-8' })
    console.log('data2: ', data2)
    const data3 = yield readFileThunk(demo3TxtPath, { encoding: 'utf-8' })
    console.log('data3: ', data3)
  } catch (error) {
    console.log('e', error)
  }
}
const demoFunc2Exec = demoFunc2()

// 在遇到 yield 的时候，指针暂停执行, 
// 那么什么时候恢复执行比较好呢，那就是在异步函数执行完之后的回调函数里 next 显然是最好的
// 这个时候，内部的 yield 将 异步函数执行完之后的 回调函数 传出来, 我们在外界进行 next
// 这样就达成了我们想要的效果
demoFunc2Exec.next().value((err, data) => {
  demoFunc2Exec.next(data).value((err, data) => {
    demoFunc2Exec.next(data).value((err, data) => {
      demoFunc2Exec.next(data)
    })
  })
})
```

为了解决前文中提出需要知道异步函数何时执行完的问题，这里巧妙的利用的 `thunk` 和 `yield expression` 会将表达式的返回值传递出来的特性。

这样就能得到一个参数为回调函数的函数，传入的回调函数执行的时候就是内部异步函数执行完的时刻。

这样我们就能在`Generator`外部传入这个回调函数，在这个回调函数中进行`next`，让暂停的`Generator`在合适的时机（异步函数执行完的时候）恢复执行。

#### 结合 Promise 来实现

通过上文结合`thunk`实现的逻辑我们知道了`Generator`异步操作同步表达的关键逻辑了：

那就是我们需要在`Generator`内部通知到到外部何时异步函数执行完，并且提供给外界一个操作入口来调用 `next`恢复`Generator`的执行，从而达成异步操作同步化的效果。

```js
const fsPromise = require('fs/promises')
// 同步表达
function* demoFunc3() {
  try {
    // 每一个 yield 表达式的后面都是一个运行结果 Promise 对象的表达式
    const data1 = yield fsPromise.readFile(demo1TxtPath, { encoding: 'utf-8' })
    console.log('data1: ', data1)
    const data2 = yield fsPromise.readFile(demo2TxtPath, { encoding: 'utf-8' })
    console.log('data2: ', data2)
    const data3 = yield fsPromise.readFile(demo3TxtPath, { encoding: 'utf-8' })
    console.log('data3: ', data3)
  } catch (error) {
    console.log('e', error)
  }
}
const demoFunc3Exec = demoFunc3()

// 我们只有在 then 中 next(交回程序执行权), 让程序继续执行
// next() --> { value: Promise, done: xxx }
demoFunc3Exec.next().value.then(data => {
  demoFunc3Exec.next(data).value.then(data => {
    demoFunc3Exec.next(data).value.then(data => {
      demoFunc3Exec.next(data)
    })
  })
})
```

这里为啥不需要`thunk`，因为`fsPromise.readFile`自己返回的就是一个`Promise`，我们可以在外界获取它，然后再其`then`的时候，让暂停的`Generator`恢复执行，这里思想其实和回调函数是一样的。

上文可以发现，如果不能自动执行`Generator`，每次都需要自己手动调用，很麻烦，那么如何自动调用`Generator`呢？

## 自动执行 Generator

> 自动执行的关键就是：在什么时候交出执行权，什么时候收回执行权。
>
> 只要能在交出执行权的时候(指针暂停)，提供下一次收回执行权的操作(指针恢复执行)，那么该`Generator`就会自动执行下去。

### Thunk 版

> `yield`后面只能是`thunk`函数

```js
function runByThunk(generator) {
  const generatorExec = generator()
	// 对回调进行封装, 这样意味着回调的时候, 如果 done 不为 true, 就会自动 next 让 Generator 继续执行
  const cb = function(err, data) {
    // 第一次 next 的参数(data)会被忽略, 所以这里没影响

    // 第一次 next 的时候, yield 表达式后面的异步函数开始执行了, 当其执行完之后会自动调用回调, 也就是 value(cb)
    // 前文我们知道, 我们需要在 cb 中让 Generator 恢复执行, 因此我们将 cb 进行封装, 在其中加入 next(data) 的 操作, 
    // 顺便将异步执行的结果返回出去, 然后当 done 时, 表示 所有的 yield 执行完毕  
    const { done, value } = generatorExec.next(data)
    if(done) return
    // value 其实就是一个被 thunk 函数, 它是异步的, 它的参数是回调函数, 当异步函数执行完之后会调用传入的回调函数
    // 这里就形成了一个递归逻辑, 只要异步函数执行完就会调用 cb, 然后 cb 又会重复这个步骤，直到 `Generator` 内部执行完 --> done: true
    value(cb)
  }
  // 启动 Generator 函数
  cb()
}
```

### Promise 版

> `yield`后面只能是`Promise`

```js
function runByPromise(generator) {
  const g = generator()
  // 对回调进行封装, 这样意味着 then 的时候, 如果 done 不为true, 就会自动 next 让Generator继续执行
  function cb(data) {
    // value 必须是 Promise, 也就是 yield 表达式后面是 Promise
    const { value, done } = g.next(data)
    if(done) return
    // value 是一个 Pending 状态的 Promise, 在它状态发生改变时(异步操作执行完时)执行 cb
    // 这里就形成了一个递归逻辑, 只要异步函数执行完就会调用 cb, 然后 cb 又会重复这个步骤，直到 `Generator` 内部执行完 --> done: true
    value.then(cb)
  }
  // 初始化启动 Generator
  cb()
}
```