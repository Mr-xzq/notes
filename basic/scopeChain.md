[block scope]: https://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F
[全局执行期上下文]: /basic/scopeChain#全局执行期上下文
[函数执行期上下文]: /basic/scopeChain#函数执行期上下文
[执行期上下文分类]: /basic/scopeChain#执行期上下文分类
[JS 解析到执行过程]: /basic/scopeChain#js-由解析到执行的过程
[理解Javascript执行过程]: https://www.cnblogs.com/tugenhua0707/p/11980566.html
[变量和函数提升]: /basic/scopeChain#变量提升和函数提升
[执行期上下文]: /basic/scopeChain#执行期上下文
[作用域链]: /basic/scopeChain#作用域链
[作用域的嵌套]: /basic/scopeChain#作用域的嵌套


# 作用域（链），执行期上下文（栈），变量提升，闭包

## 作用域

### 概念

任何程序设计语言都有作用域的概念，简单的说，作用域就是变量与函数的可访问范围，控制着变量和函数的可见性与生命周期，换句话说，作用域决定了代码区块中变量和其他资源的可见性。

同时也可以将其理解为：用于确定在何处以及如何查找变量（标识符）的规则。

### 分类

#### 按照产生时机划分

##### 静态作用域

又叫词法作用域，是由函数声明（定义）时决定的，和函数具体在哪里执行没有关系；



##### 动态作用域

动态作用域是在运行时根据程序的流程信息来动态确定的，而不是在写代码时进行静态确定的；

比如动态作用域并不关心函数和作用域是如何声明以及在何处声明（定义）的，只关心它们在何处调用；

`JavaScript`采用的就是词法作用域（`lexical scoping`），又称静态作用域。



##### 验证

那么如何去验证`JS`是静态（词法）作用域呢？

如下例：

```js
var a = 'global - a'

function foo() {
  console.log('foo: ', a)
}

function bar() {
  var a = 'bar'
  foo()
}

bar() // foo:  global - a
```



如果`foo`的作用域是在声明时就定义了，那么此时`foo`先看自己内部有没有定义`a`变量，如果没有，则向定义时的所处环境的上级作用域寻找，最终访问的`a`应该是全局作用域中的`a`，也就是应该输出`foo:  global - a`；

如果`foo`的作用域是在调用时决定的，那么此时`foo`先看自己内部有没有定义`a`变量，如果没有，则向调用时的所处环境的上级作用域寻找，最终访问的`a`应该是`bar`函数中的`a`，也就是应该输出`foo-a: bar`；

最终我们发现输出结果是`foo:  global - a`，因此验证知道`JS`是静态（词法）作用域。



#### 按照作用范围划分

在`JS`中变量的作用域有全局作用域，局部作用域和`ES6`新增的块级作用域。



##### 全局作用域

也叫顶层作用域，在代码中任何地方都能访问到的变量或者函数拥有全局作用域，一般来说以下几种情形拥有全局作用域：

1. 在最外层定义的变量或者函数（用`let, const`在顶层声明的变量不会被挂载到`window`上）：

   ```js
   var a = 'a'
   let b = 'b'
   
   function foo() {
     console.log('a: ', window.a) // a: a
     console.log('b: ', window.b) // b: undefined
   }
   
   foo()
   ```

   

2. 非严格模式下未用声明符号声明的变量：

   ```js
   function foo() {
     // 'use strict'
     // 严格模式下会抛出异常: Uncaught ReferenceError: a is not defined
     a = 10
   }
   
   foo()
   console.log('a: ', a) // a:  10
   ```

   

3. 所有`window`上具有的属性或者方法：

   ```js
   function foo() {
     console.log('window', window) // window
     console.log('location: ', location) // widow.location
   }
   
   foo()
   console.log('navigator', navigator) // window.navigator
   ```

   



##### 局部作用域：

局部作用域还可以称之为函数作用域，指在函数内声明的所有变量在函数体内始终是可见的，可以在整个函数的范围内使用及复用。

函数作用域只有函数被定义时才会创建，包含在父级函数作用域或全局作用域内。





##### 块级作用域：

`ES6` 中，对于 `let const` 声明的变量, 它们可以拥有 [块级作用域][block scope]。


```js
var sum = 100;

// 在以往我们为了避免命名冲突, 保证逻辑的相对独立性, 通常会用匿名 IIFE(立即执行函数) 来封装一段逻辑代码
// 其实这也是早期模块的实现思路
(function() {
  var num1 = 1
  var num2 = 2
  function add(...args) {
    return args.reduce((prev, cur) => prev + cur, 0)
  }
  var sum = add(num1, num2)
  console.log('sum: ', sum)
})();


// 代码块
{
  let num1 = 1
  let num2 = 2
  function add(...args) {
    return args.reduce((prev, cur) => prev + cur, 0)
  }

  // 具备块级作用域, 不会覆盖全局的 sum
  // let sum = add(num1, num2)  // global-sum: 100
  const sum = add(num1, num2)   // global-sum: 100

  // 不具备块级作用域, 会覆盖全局的 sum
  // var sum = add(num1, num2) // global-sum: 3

  console.log('sum: ', sum)
}

console.log('global-sum: ', sum)
```



### 作用域的嵌套

首先我们知道，作用域是在定义时刻产生的，然后根据作用域的范围划分，块级作用域和函数作用域肯定是被包括在全局作用域下的。

举一个例子：

```js
// 全局作用域
var flag = 'global'
function foo() {
  // 函数作用域
  var flag = 'foo'
  function bar() {
    // 函数作用域
    var flag = 'bar'
    {
      // es6 通过 let, const 声明的变量具有块级作用域
      let flag1 = 'block-1'
      const flag2 = 'block-2'
    }
  }
}
```



![image-20220304132732889](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:30:40-%E5%B5%8C%E5%A5%97%E4%BD%9C%E7%94%A8%E5%9F%9F.png)

### 变量查找规则

按照作用域的嵌套，每段独立的执行代码块只能访问自己作用域和外层作用域中的变量，无法访问到内层作用域的变量。

## 执行期上下文

### 概念

官方一点地说，执行上下文（`Execution context`）就是一个评估和执行`JS`代码的环境的抽象概念。通俗地说，就是每当 `Javascript` 代码在运行的时候，它都是在执行上下文中运行。

`JS`执行中所需要的变量或者函数等信息都是从执行期上下文中获取的。



### 生命周期

执行期上下文的生命周期分为如下三个阶段：

1. 创建阶段；
2. 执行阶段；
3. 回收阶段；

#### 创建阶段

当函数被调用，但未执行任何其内部代码之前，会做以下三件事：

1. 首先创建变量对象（`VO --> Varibale Object`），然后进行初始化函数的参数 `arguments`（在当前执行期上下文为 [函数执行期上下文] 的情况下），提升函数声明和变量声明等的操作。

    不同类型的上下文他们的变量对象（`VO`）的叫法也会不同，比如 [全局执行期上下文] 中的`GO --> Global Object`，或者 [函数执行期上下文] 中的`AO --> Activation Object`；

2. 创建作用域链（`Scope Chain`）：在执行期上下文的创建阶段，作用域链是在变量对象（`VO`）之后创建的。

   作用域链本身包含变量对象，一般来说当前执行期上下文对应的变量对象在作用域链顶端。作用域链用于解析（获取）变量，当被要求解析（获取）变量时，`JS` 始终从代码嵌套的最内层（作用域链的顶端）开始，如果最内层没有找到变量，就会跳转到上一层父作用域中查找，直到找到该变量；

3. 确定 `this` 指向：包括多种情况，可以参考`this`详解；

在一段 `JS`脚本执行之前，要先解析代码（所以说 `JS` 是解释执行的脚本语言），等待执行期上下文生成好了之后`JS`脚本才会真正开始执行。

具体可以参考：[JS 解析到执行过程]



#### 执行阶段

执行变量赋值、代码执行。

#### 回收阶段

执行上下文出栈等待虚拟机回收执行上下文。

### JS 由解析到执行的过程

参考：[理解Javascript执行过程]

![img](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:30:43-JS%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

大致分为两大步，分别是：

1. 语法检查阶段；
2. 运行阶段；

语法检查阶段主要对当前`script`（标签）内的代码进行扫描，查看有没有语法错误等，直接执行下一个`script`代码段，因此在同一个`script`（标签）内的代码段有错误的话就不会执行下去。但是它不会影响下一个`script`（标签）内的代码段。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
	
  <!--第 1 个 script 标签-->
  <script>
    let name1 = 'demo-01';

    // 在语法检查阶段就会抛出异常
    // Uncaught SyntaxError: Unexpected identifier
    xx x;

    // 当前 script 标签后面的代码不会执行
    console.log('demo-01')
  </script>
	
   <!--第 2 个 script 标签-->
  <script>
    let name2 = 'demo-02';

    // 不影响下一个 script 标签中代码的执行
    console.log('demo-02')

  </script>
</body>

</html>
```

其实这里也看得出来，`JS`的执行确实是逐行执行的，但是执行之前的语法检查和预编译都不是逐行执行的，而是先按照一块一块进行代码解析，然后才逐行执行，这个一块一块的指的就是`script`（标签）。

并且如果`JS`如果完全是逐行预编译的话，那么 [变量和函数提升] 就说不通了。


预编译阶段对应的就是执行期上下文生命周期中的创建阶段。

当执行期上下文产生后，对应代码才会执行。

这里有一点需要注意，预编译首先是全局预编译（先生成`GO`），函数体未调用时是不进行预编译的。



### 执行期上下文分类

#### 全局执行期上下文

对于全局执行上下文而言，它对应的`VO`又被称之为`GO --> Global Object`。

对全局进行预编译的过程：

1. 创建一个`GO`对象；

2. 将对应作用域中的变量声明和形参挂载到执行期上下文中，初始值为 `undefined`；

   注意：

   + 函数表达式赋值的形式属于变量声明的范畴，`var foo = function() {}`。

     要和函数声明区分开，`function foo() {}`；

   + 这里的变量声明特指`var, function`声明的变量。只有`var, function`声明的变量具有变量提升，`let const`声明的变量和`var`不同，可以参考 [变量和函数提升]；

3. 将对应作用域中的函数声明挂载到执行期上下文中，将函数值赋值给函数声明；

4. 创建执行期上下文对应的作用域链，将`GO`挂载到作用域链顶端；

5. 确定`this`指向，在全局执行上下文中`this --> window`；



#### 函数执行期上下文

对于全局执行上下文而言，它对应的`VO`又被称之为`AO --> Activation Object`。

对函数进行预编译的过程：

1. 创建一个`AO`对象；

2. 将对应作用域中的变量声明和形参挂载到执行期上下文中, 初始值为 `undefined`；

   注意：

   + 函数表达式赋值的形式属于变量声明的范畴，`var foo = function() {}`。

     要和函数声明区分开，`function foo() {}`；

   + 这里的变量声明特指`var, function`声明的变量。只有`var, function`声明的变量具有变量提升，`let const`声明的变量和`var`不同，可以参考 [变量和函数提升]；

3. 将形参与实参的值相统一；

4. 将对应作用域中的函数声明挂载到执行期上下文中，将函数值赋值给函数声明；

5. 创建执行期上下文对应的作用域链，将`AO`挂载到作用域链顶端；

6. 确定`this`指向；



#### Eval 执行期上下文

运行在 `eval` 函数中的代码也获得了自己的执行上下文，但由于`JS`开发人员不常用 `eval` 函数，所以在这里不再讨论。

关于`eval`你可以参考：

1. [你不知道的 eval](https://juejin.cn/post/6844903713140637709)；

2. [eval和new Function的区别](https://juejin.cn/post/6844903859274383373)；



## 变量提升和函数提升

变量提升不能算作一种官方的标准说法，它只能说是一种现象（其中函数声明提升比变量声明提升优先级更高），产生现象的原因就在`JS`的预编译阶段流程产生的，也就是执行期上下文的创建阶段创建`VO`的过程产生的。

参考: [执行期上下文生成`VO`的过程][执行期上下文分类]



请看下面的例子：

```js
var foo

console.log(foo) // function foo
console.log(a) // undefined

var a = 10

console.log(a) // 10

function foo (a) {
  console.log(a) // 100
  var a = 1000
  console.log(a) // 1000
}

foo(100)

console.log(foo) // function foo
```



先预编译全局，生成全局执行期上下文对应的`GO`，具体步骤可以参考 [GO 生成步骤](#全局执行期上下文)：

```js
const GO = {
	a: undefined,
  foo: function, 
  // undefined --> foo function;
  // 1. 先将变量声明挂到 GO 中, 初始值为 undefined
  // 2. 然后将函数声明挂到 GO 中, 然后函数声明对应的函数赋到对应的值上(会覆盖同名变量)
  // 因此就造成了函数声明的提升比变量声明的提升优先级更高的效果
}
```



然后进入执行阶段，开始逐行执行代码：

```js
console.log(foo) // function foo
console.log(a) // undefined

var a = 10
function foo (a) {
  console.log(a) // 100
  var a = 1000
  console.log(a) // 1000
}

// 在这一刻暂停住, 开始预编译 foo, 生成对应的 AO
foo(100)
```



并且由于经过 `var a = 10` ，那么此时的`GO`为：

```js
const GO = {
	a: 10,
  foo: function,
}
```



预编译函数生成函数执行期上下文对应的`AO`的步骤具体可以参考[AO生成步骤](#函数执行期上下文)：

```js
const AO = {
	a: 100,  
  // undefined --> 100; 
  // 1. 先找到变量声明和形参, 将初始值置为 undefined;
  // 2. 然后形参实参相统一
}
```



然后进入执行阶段，开始逐行执行代码：

```js
console.log(a) // 100
var a = 1000
```



并且由于经过 `var a = 1000` ，那么此时的`AO`变为：

```js
const AO = {
	a: 1000, 
}
```



然后执行：

```js
console.log(a) // 1000
```



补充一点：

关于`let`是否具有变量提升可以参考：

1. [我用了两个月的时间才理解 `let`](https://zhuanlan.zhihu.com/p/28140450)；
2. [因为说 `let` 没有变量提升，我被嘲笑了](https://juejin.cn/post/6983702070293430303)；

`let`存在一种暂时性死区的概念，也就是说在预编译阶段，同样会将`let`声明的变量放到对应的`VO`中，只不过初始值不再是`undefined`，而是一个标志着死区概念的标记位，如果这个标记位没有被具体的值给覆盖，那么访问这个变量都会抛出异常。

```js
console.log(typeof a) // 'undefined'
var a = 10

console.log(typeof i) // ReferenceError: Cannot access 'i' before initialization
let i = 10;

// 执行之前先预编译
const VO = {
  a: undefined,
  i: '死区(禁止访问)' // 这里是伪代码, 只是方便我们理解用的
}

// 只有在 let i = 10 之后
const VO = {
  a: xxx,
  i: 10 // '死区(禁止访问)' --> 10
}

```

关于暂时性死区可以参考：

1. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#%E6%9A%82%E5%AD%98%E6%AD%BB%E5%8C%BA
2. https://es6.ruanyifeng.com/#docs/let#%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA



总结

`let`是否具有变量提升：

1. 如果从预编译阶段（代码真正开始执行之前）是否会将对应声明的变量放到变量对象（`VO`）中的角度来看`let`是否具有和`var`一样的变量提升的话，那么`let`具有变量提升；

   ```js
   var a = 'global-a';
   
   function foo() {
     console.log(x); // ReferenceError: Cannot access 'x' before initialization
     let a = 'sub-a'
   }
   
   foo()
   ```

   

   这个例子说明在预编译 `foo`的过程中，`let a`被加到`VO`中了，不然的话，那就能够访问外界的`a`的值。

2. 如果从变量赋值之前是否能够访问变量的角度来看`let`是否具有和`var`一样的变量提升的话，那么`let`不具有变量提升；

## 执行期上下文栈

参考：[[译] 理解 JavaScript 中的执行上下文和执行栈](https://juejin.cn/post/6844903682283143181)

我们知道，在`JS`的执行同一过程中只可能有一个全局执行期上下文，但是可能有多个函数执行期上下文，那么如何来管理这不同类型的多个执行期上下文呢？

`JS` 引擎创建了执行上下文栈来管理所有的执行期上下文。可以把执行上下文栈认为是一个存储执行期上下文的栈结构，遵循先进后出的原则。

当 `JS` 引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的函数执行期上下文并压入栈的顶部。

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

让我们通过下面的代码示例来理解：

```js
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```



执行流程如下：

1. 当上述代码在浏览器加载时，`JS`引擎创建了一个全局执行期上下文并把它压入当前执行栈；

2. 当遇到 `first()` 函数调用时，`JS` 引擎为该函数创建一个新的函数执行期上下文并把它压入当前执行栈的顶部；
3. 当从 `first()` 函数内部调用 `second()` 函数时，`JS`引擎为 `second()` 函数创建了一个新的函数执行期上下文并把它压入当前执行栈的顶部；
4. 当 `second()` 函数执行完毕，它的执行上下文会从当前栈弹出，并且控制流程到达下一个执行上下文，即 `first()` 函数的执行上下文；

5. 当 `first()` 执行完毕，它的执行上下文从栈弹出，控制流程到达全局执行期上下文。一旦所有代码执行完毕，`JS`引擎从当前栈中移除全局执行上下文；



![img](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/15:06:56-%E6%89%A7%E8%A1%8C%E6%9C%9F%E4%B8%8A%E4%B8%8B%E6%96%87%E6%89%A7%E8%A1%8C%E6%A0%88%E5%9B%BE%E4%BE%8B.png)



## 作用域和执行期上下文的区别

作用域是在定义时刻就决定的，而且它是静态的，而我们的执行期上下文是在代码执行的前一刻才知道的。

比如这里我们以函数作为例子：

函数对应的作用域为函数作用域，在函数定义的那一刻就决定了；

函数的执行期上下文是在代码执行到函数执行的前一刻才决定的，也就是预编译阶段才生成，其中最典型的例子就是函数中`this`的指向；

## 作用域链

### 函数定义时对应的作用域链

在`JS`中，函数也是对象，实际上，`JS`里一切都是对象。函数对象和其它对象一样，拥有可以通过代码访问的属性和一系列仅供`JS`引擎访问的内部属性。

其中一个内部属性是`[[Scope]]`，由`ECMA-262`标准第三版定义，该内部属性包含了函数被创建的作用域中对象的集合，这个集合被称为函数的作用域链，它决定了哪些数据能被函数访问。

和前文所说的 [作用域的嵌套] 类似。



当一个函数创建（定义）的时候，它的作用域链会被当前函数作用域的上一级作用域（所处的环境）所初始化。

例如定义下面这样一个函数：

```js
var a = 10

function foo() {
  var b = 20
}

foo()
```



![image-20220303220540628](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:30:50-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-01.png)



### 执行期上下文对应的作用域链

当代码开始执行，到执行到`foo`函数的前一刻，开始对函数进行预编译，这个时候就会产生执行期上下文，并且会为该执行期上下文对应的变量对象（`VO`）创建一个作用域链。

它的作用域链初始化为当前运行函数的`[[Scope]]`所包含的对象，这个作用域链决定了各级上下文中的代码在访问变量或者函数时的顺序。

要注意的是，这里初始化的方式赋值的是指针，也就是说后面函数运行时对自身作用域链的对象进行更改时，会影响到原来的函数上的`[[Scope]]`，只有当当前函数执行完之后，自身执行期上下文会弹出上下文栈，作用域链顶端的`AO`也会被销毁，原来函数上的`[[Scope]]`才会恢复到原来定义时刻的样子。

代码正在执行的上下文的变量对象（`VO`）始终处于这个作用域链的顶端，因为这里的们的执行期上下文指的时函数执行期上下文，因此这个变量对象（`VO`）又被称之为活动对象（`AO`）。

![image-20220303215740562](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:30:53-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-02.png)



当`AO`构建好之后，并且被放到这个作用域链顶端时（执行期上下文生成好了），这个时候，`foo`函数开始执行。`foo`的执行的时候，是可以动态改变执行其上下文对应的`AO, GO`中的属性，甚至动态改变这个作用域链都有可能，比如`with, try...catch`。

当`foo`执行完之后，对应的执行期上下文会弹出上下文栈，那么其对应的作用域链顶端的`AO`也会被销毁。



接下来举一个特殊的例子：

```js
a(glob)
function a (para1) {
  console.log(para1)
  var at_a = 'a'
  function b () {
    console.log(at_b)
    var at_b = 'b'
    console.log(at_b)
    console.log(at_a)
    at_a = at_a + 'a'
    function c () {
      console.log(at_a)
      var at_c = 'c'
    }
    c()
  }
  b()
}
console.log(glob)
var glob = 100
```



我们这里来分析一下：

1. `a`函数的`[[Scope]]`，也就是定义时的作用域链（所处的环境）；

   ![image-20220304095928433](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:30:57-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-03.png)

2. 即将要执行`a`函数发生的预编译所产生的`AO`对象，也就是代码执行到`a(glob)`的这一刻先进行该函数的预编译；

   预编译生成`AO`的步骤参考：[生成 AO 的步骤][函数执行期上下文]

   ![image-20220304101218036](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:00-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-04.png)

3. 预编译时产生的执行期上下文所关联的作用域链（浅拷贝`[[Scope]]`，用其来初始化），此时`AO`被挂载在这个作用域链顶端；

   ![image-20220304101732289](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:02-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-05.png)

​			

4. 待`a`函数的执行期上下文和其对应的作用域链都生成好之后，该函数的预编译阶段结束，接下来开始执行；

   首先执行`console.log(xxx)`，然后开始给`at_a`赋值，然后开始到`b()`（这里会有对`b`函数的预编译）：

   ![image-20220304102839141](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:05-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-06.png)



注意：

1. 函数定义时自身的内部属性`[[Scope]]`对应的作用域链和函数执行的前一刻，也就是预编译阶段产生的执行期上下文所对应的作用域链不是一个东西，但是后者用会以前者为基础来初始化；
2. 函数执行时访问变量的范围和顺序是按照执行期上下文中对应的作用域链决定的，从顶端依次往下寻找，如果最终没有寻找到，那么就是`undefined`，此时`AO`在作用域链顶端；
3. `VO(GO, AO)...`是可变对象，函数执行时可以改变里面的数据；



### 运行时改变作用域链

函数每次执行时对应的运行期上下文都是独一无二的，所以多次调用同一个函数就会导致创建多个运行期上下文。

当函数执行完毕，执行上下文会被销毁，每一个运行期上下文都和一个作用域链关联。

一般情况下，在运行期上下文运行的过程中，其作用域链只会被 `with` 语句和 `catch` 语句影响。

```js
var age = 100

const person = {
  age: 18
}

function foo() {

  var age = 80
	
  with(person) {
    // 按照访问顺序从作用域链顶端开始往下寻找
    console.log('inside with', age) // 18
  }

  // with 临时对作用域链的操作会消失
  // 按照访问顺序从作用域链顶端开始往下寻找
  console.log('outside with', age) // 80
}

foo()
```



在执行到 `with(person)`时，会将 `person` 对象中的属性作为一个临时的 `VO` 对象挂载到当前 `foo` 函数的执行期上下文所对应的执行期上下文的顶端。

![image-20220304111449560](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:10-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-07.png)



在执行到`catch(e)`时，会将`e`包装进一个临时对象中，这个临时对象会被作为`VO`临时挂载到当前 `foo` 函数的执行期上下文所对应的执行期上下文的顶端。

```js
var age = 100

function foo() {
  var e = 'e'
  try {
    throw 'exception'
  }catch(e) {
    console.log('e: ', e) // e: exception
  }
}

foo()
```



![image-20220304111645288](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:15-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-08.png)

## 闭包

### 概念

《JavaScript高级程序设计》这样描述：

> 闭包是指有权访问另一个函数作用域中的变量的函数；

《JavaScript权威指南》这样描述：

> 从技术的角度讲，所有的`JavaScript`函数都是闭包：它们都是对象，它们都关联到作用域链。

《你不知道的JavaScript》这样描述：

> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

接下来我们总结一下：

闭包指的是一个函数，是一个能够访问另一个（一般来说是上级）函数作用域中的变量的函数，所以你看到的闭包函数一般都是嵌套函数。

```js
function foo() {
  var flag = 'foo'
  function bar() {
    console.log('flag: ', flag)
  }
  bar()
}

foo()
```



这里的`bar`函数就是一个闭包，因为它能够访问`foo`函数作用域中的变量。

因此这里我们可以发现，其实任意函数都能成为闭包。



也许看到你这你会觉得，这个闭包并没有产生任何实际的意义。确实，如果就官方定义来说，这确实没什么用。

接下来我们来结合实际使用场景来深入讲解一下闭包。

### 深入闭包

接下来请看闭包的一个特殊场景：

```js
// 定义一个累加器
function accumulator(count) {
  var num = 0
  function add() {
    num += count
    console.log('num: ', num)
    return num
  }
  // 将函数返回出去
  return add
}

// 每次加 1 的累加器
var addOne = accumulator(1)
addOne() // 1
addOne() // 2
addOne() // 3
```



也许你第一眼看到这个例子，会觉得每次`addOne()`每次的执行结果不应该都是`1`吗，但是事实却不是这样。

这里利用闭包完成了累加器的效果，那原理是什么呢？这里就要结合前文所说的 [执行期上下文] 和 [作用域链] 来进行讲解了。



首先分析执行到`const addOne = accumulator(1)`时，对`accumulator(1)`预编译进行分析，产生一个执行期上下文和它所对应的作用域链。

![image-20220304135754988](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:19-%E9%97%AD%E5%8C%85-01.png)



然后代码开始执行，当`const addOne = accumulator(1)`执行完之后，对应的执行期上下文和它对应的作用域链应为：

![image-20220304140149131](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:23-%E9%97%AD%E5%8C%85-02.png)



核心要来了，在`accumulator`函数内部定义了一个`add`函数，这里我们知道，函数定义时刻也会有一个对应的作用域链，本来这个作用域链应该由其嵌套作用域决定，其实就是`add`函数定义时所处的环境：

![image-20220304141055370](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:32-%E9%97%AD%E5%8C%85-03.png)



在`const addOne = accumulator(1)`执行完之后，被保存出来的不只是这个函数，还包括这个函数定义时刻的作用域链（环境），只不过这个时候这个作用域链变为：

![image-20220304142854589](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:26-%E9%97%AD%E5%8C%85-04.png)



执行期上下文对应的作用域链和函数定义时的作用域链也是有对应关系的，前者往往用后者来初始化（浅拷贝），因此对执行期上下文中作用域链中对象的改动也会影响到函数定义时的作用域链。

本来当`accumulator(1)`执行完之后，它所对应的`AO`应该被销毁，但是由于函数的引用被保存出来了，随之这个作用域链也被保存出来了，目前被`addOne`变量持有这个引用，导致`accumulator`执行时对应的`AO`其无法销毁。

当执行到`addOne()`时，又开始了预编译，这个时候生成了`addOne`的执行期上下文和对应的作用域链，记住，此时的：

![image-20220304142548715](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:42-%E9%97%AD%E5%8C%85-05.png)

这里你会发现，`addOne`的`AO`中并没有自己的`num, count`，根据变量查找原则，从作用域链的的顶端依次往下查找，`addOne`访问的应该是`accumulator`的`AO`中的`num, count`。

当前`addOne()`执行完之后，它的`AO`被销毁了（它只能销毁自己的`AO`，无法销毁它定义时的环境 -- 包含上级的`AO`）：

![image-20220304165625595](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220307/10:31:50-%E9%97%AD%E5%8C%85-06.png)



这就变成了下一次`addOne`的环境，预编译阶段生成的`AO`就会以这个为基础进行添加，因此你会发现，`addOne`的父（上）级作用域链无法被销毁（就会造成内存泄漏），后面`addOne`函数的操作都是基于这同一个父级上下文，只有自身的`AO`是会经历销毁重建的过程。

这也就是这个累加器的实现原理，这也就是闭包的应用所在。

如果想避免内存泄漏，那么你只能手动将`addOne = null`，消除其对父级作用域中`AO`的引用，让其能够被正常垃圾回收。



总结一下，函数持有父（上）级作用域链，而自身又被保存到了外部，这就导致上级作用域链中的`AO`无法被正常销毁。

这也是闭包特殊用法所在的原理所在，接下来来看一下主要应用场景。

### 主要应用场景

1. 实现方法和属性的私有化，并且结合立即执行函数（`IIFE`）实现模块化封装，同时也就防止了命名冲突；

   ```js
   // moduleA
   var run = function() {
     // ...
   }
   var moduleA = (function() {
     var run = function() {
       console.log('run...')
     }
     var flag = 'moduleA'
     // ...
   
     return {
       run,
       flag,
       // ...
     }
   })();
   
   moduleA.run();
   ```

   

2. 实现缓存；

   ```js
   // 定义一个累加器
   function accumulator(count) {
     var num = 0
     function add() {
       num += count
       console.log('num: ', num)
       return num
     }
     // 将函数返回出去
     return add
   }
   
   // 每次加 1 的累加器
   var addOne = accumulator(1)
   addOne() // 1
   addOne() // 2
   addOne() // 3
   ```

   

### 常见问题

#### for 循环定时器问题

```js
for(var i = 0; i < 10; i ++) {
  setTimeout(function () {
    console.log('i: ', i);
  }, 0)
}
console.log('outside-i: ', i) // 在外界也能访问 i, 且值为 10
// 期望输出结果是: 0, 1, 2, ...
// 实际输出结果是: i: 10, 10...
```



造成这个问题的原因有如下：

1. `setTimeout`是异步任务（宏任务），并不是同步执行，因此是等`for`循环走完之后，`setTimeout`中的回调函数才开始执行；
2. `var`声明的变量并没有块级作用域，再加上这里的`for`循环中不是函数作用域，因此这里的`i`具有全局作用域，因此都是同一个变量，不同的匿名函数访问的都是全局作用域中的`i`；

解决这个问题的核心就是要让`i`具有函数作用域或者块级作用域，因此对应的解决方案也有两种：

1. 通过立即执行函数 + 闭包，让用一个`otherI`去接收`i`，这个`otherI`是函数作用域，因此10次循环就有10个不同的`otherI`：

   ```js
   for(var i = 0; i < 10; i ++) {
     (function() {
       var otherI = i
       setTimeout(function () {
         console.log('i', otherI);
       }, 0)
     })()
   }
   ```

2. 通过`let`来声明`i`，让其具有块级作用域：

   ```js
   for(let i = 0; i < 10; i ++) {
     setTimeout(function () {
       console.log('i', i);
     }, 0)
   }
   ```

   

   变量`i`是`let`声明的，当前的`i`只在本轮循环有效，每一次循环中的`i`之间都是相互独立的。

   你可能会问，如果每一次循环中的`i`之间都是相互独立的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？

   这是因为 `JS` 引擎内部会记住上一轮循环的值，初始化本轮的变量`i`时，就在上一轮循环的基础上进行计算。

   另外，`for`循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

   ```javascript
   for (let i = 0; i < 3; i++) {
     let i = 'abc';
     console.log(i);
   }
   // abc
   // abc
   // abc
   ```

   上面代码正确运行，输出了 `3` 次`abc`。这表明函数内部的变量`i`与循环变量`i`不在同一个作用域，有各自单独的作用域（同一个作用域不可使用 `let` 重复声明同一个变量）。

   不用 `const`的原因是因为常量无法被更改。

#### for 循环闭包问题

题`1`：

```js
var result = []
var a = 1
var total = 0

for (var i = 0; i < 3; i++) {
  result[i] = function () {
    total += i * a
    console.log(total)
  }
}

result[0]() // 3 -->  0 + 3 * 1
result[1]() // 6 -->  3 + 3 * 1
result[2]() // 9 -->  6 + 3 * 1
```



题`2`：

```js
var result = []
var total = 0

function foo(a) {
  for (var i = 0; i < 3; i++) {
    result[i] = function () {
      total += i * a
      console.log(total)
    }
  }
}

foo(1)
result[0]() // 3 -->  0 + 3 * 1
result[1]() // 6 -->  3 + 3 * 1
result[2]() // 9 -->  6 + 3 * 1
```



分析如下：

1. 函数并没有在循环中立即调用执行；

1. 函数被保存到了外部（被放到数组中了），由于闭包的特性，被保存到外部的同时还有当前那一刻函数所在的父级作用域（链），因此数组中存储的三个函数他们的父级作用域链都是同一个，比如题 `1` 的全局作用域，比如题 `2` 的 `foo` 函数的作用域；

## 参考链接

https://www.cnblogs.com/lhb25/archive/2011/09/06/javascript-scope-chain.html

https://juejin.cn/post/7043408377661095967

https://juejin.cn/post/6844904165672484871

https://juejin.cn/post/6926831181681917959

https://blog.csdn.net/qq_27626333/article/details/78463565

https://juejin.cn/post/6844903797135769614

https://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F

https://juejin.cn/post/6844903606311714824

https://juejin.cn/post/6844903612879994887

https://juejin.cn/post/6844903858636849159

https://juejin.cn/post/7051604174357676062