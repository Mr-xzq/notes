[Mdn Strict Mode]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F

[严格模式和非严格模式的区别]: https://zhuanlan.zhihu.com/p/362078508

[call]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
[apply]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
[bind]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

[new]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new

[arrow function(ruanyifeng)]: https://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0
[arrow function(MDN)]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions

[let]: https://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F

[currentTarget]: https://developer.mozilla.org/zh-CN/docs/Web/API/Event/currentTarget
[target]: https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target



#  this 详解

> 在没有特别指明的情况下，下文的例子都是在浏览器环境。

关于严格模式和非严格模式的区别，可以参考：

1. [浏览器中的严格模式(MDN)][Mdn Strict Mode]；

2. [严格模式和非严格模式的区别]；


## 全局上下文

严格模式和非严格模式：

```js
console.log('this', this) // --> window
```

## 函数上下文

> 函数上下文中的`this`都是在函数调用的那一刻才知道的，也就是运行时决定的。

### 默认绑定

> 通常指的是独立函数调用，没有具体的调用者，典型的形式为 `fun()`。

非严格模式：

非严格模式中默认绑定中函数的`this --> window`。

```js
var name = 'xzq'
function printThis() {
  console.log('printThis', this) // window
  console.log('printThis-name', this.name) // 'xzq'
}
printThis()
```



严格模式：

严格模式中默认绑定中函数的`this --> undefined`。

```js
var name = 'xzq'
function printThis() {
  'use strict'
  console.log('printThis', this) // undefined
  console.log('printThis-name', this.name) // Uncaught TypeError: Cannot read properties of undefined (reading 'name')
}
printThis()
```





扩展知识：

参考：https://es6.ruanyifeng.com/#docs/let#%E9%A1%B6%E5%B1%82%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7

`var` 在全局上下文中声明的变量会挂载到 `window` 上。

`let, const` 不会挂载到 `window` 上。

`var name = 'xzq'`。

`let name = 'xzq'`。

这里有一点需要注意，当你在 `window` 上声明的属性之后，你需要把浏览器当前网页关掉，重新打开，这个对应的属性才会消除。



`setTimeout(cb, xx), setInterval(cb, xx)...`这种类型的`cb`的调用方式也看做没有明确的调用者，那么其中`cb`的`this`的指向也可以应用默认绑定的规则。



### 隐式绑定

> 函数是由某个对象上调用的，例如： `xxx.foo()`。

非严格模式和严格模式：

`this`指向调用者，和函数自身所处的位置无关。

```js
function printThis() {
  console.log('printThis-name', this.name) // 'xzq'
}
const person = {
  name: 'xzq',
  printThis,
  subPerson: {
    name: 'subXzq',
    printThis
  }
}

person.printThis() // 'xzq'
person.subPerson.printThis() // 'subXzq'
```



注意：

如果将对象中的函数赋值出来，然后直接调用，那么就等同于第一种默认调用模式了。

```js
const otherPrintThis = person.printThis
otherPrintThis() // this --> 严格模式: undefined, 非严格模式: window
```



### 显式绑定

> 指的是通过`call, apply, bind`的第一个参数进行显式指定函数的`this`。
>
> 例如：`foo.call(thisArg, ...args), foo.apply(thisArg, [args]), foo.bind(thisArg, ...args)()`。

关于这三个方法具体的用法可以参考：

1. [call(MDN)][call]；

2. [apply(MDN)][apply]；

3. [bind(MDN)][bind]；

其中 [call] 和 [apply] 类似，只有一个区别，就是 [call] 方法接受的是一个参数列表，而 [apply] 方法接受的是一个包含多个参数的数组。

```js
function foo() {}
foo.call(thisArg, '1', '2', '3'...)
foo.apply(thisArg, ['1', '2', '3'...])
```



其中 [call] 和 [bind] 的参数列表是一样的，但是 [call] 会调用函数；而 [bind] 不会调用函数，而是返回绑定`this`之后的含函数。

```js
function foo() {}
foo.call(thisArg, '1', '2', '3'...)
const otherFoo = foo.bind(thisArg, '1', '2', '3')
otherFoo()
```



关于这三者的第一个参数`thisArg`需要做出一些特殊说明：

严格模式下：

传入什么，这个函数的`this`就指向什么。

```js
function printThis() {
  'use strict'
  console.log('printThis', this)
}
printThis.call({}) // {}
printThis.call(1) // 1
printThis.call(null) // null
printThis.call(undefined) // undefined
```



非严格模式下：

传入引用类型的值，那么这个函数的`this`就指向这个引用类型的值。

传入原始类型的值，那么这个函数的`this`就指向这个原始类型的值对应的包装对象。

传入`null, undefined`，那么这个函数的`this`就指向`window`。

```js
function printThis() {
  console.log('printThis', this)
}
printThis.call({}) // {}
printThis.call(1) // Number { 1 } --> new Number(1)
printThis.call(null) // window
printThis.call(undefined) // window
```



综合示例（非严格模式下）：

```js
var name = 'xzq'
function printThis() {
  console.log('printThis-name', this.name)
}
const person = {
  name: 'xzq',
  printThis,
  subPerson: {
    name: 'subXzq'
  }
}

person.printThis.call(person.subPerson) // 'subXzq'
printThis.apply(person) // 'xzq'
printThis.call(null) // 'xzq', 此时 this --> window
printThis.apply(undefined) // 'xzq', 此时 this --> window
```



### new 绑定

> 指的是通过`new`调用一个函数，此时的`this`指向一个新的对象。
> 
> 例如：`new foo()`。

参考：[new(MDN)][new]



通过`new`调用函数时，`JS`引擎内部会对该函数有隐式的如下`4`步操作：

1. 创建一个空的 `JS` 对象（即 `{}`）；
2. 为步骤`1` 新创建的对象添加属性 `__proto__`，将该属性链接至构造函数的原型对象；
3. 将步骤 `1` 新创建的对象作为该函数的 `this`，也就是改变该函数的 `this` 指向，这里可以通过显式绑定的方式，例如：`call, apply, bind`；
4. 如果该函数没有返回对象（包含 `Functoin, Array, Date, RegExg, Error...`），则返回 `this`；



按照这个规则，我们自己实现以下`new`运算符：

```js
function callFunctionByNew(func, ...args) {
  // 步骤 1
  const tmpObj = {}
  
  // 步骤 2
  tmpObj.__proto__ = func.prototype
  
  // 步骤 3
  const res = func.call(tmpObj, ...args)
  // 如果构造函数中有手动返回一个对象(Functoin, Array, Date, RegExg, Error...)
  if(res !== null && (typeof res === 'object' || typeof res === 'function')) return res
  
  // 步骤 4
  return tmpObj
}
```



调用`new func()`之后的返回值有两种情况：

1. `func`中没有显式返回一个引用类型的值（包含 `Functoin, Array, Date, RegExg, Error...`），那么直接返回一个实例化后的对象；
2. `func`中显式返回一个引用类型的值（包含 `Functoin, Array, Date, RegExg, Error...`），那么直接返回该值；



但是`this`的指向却和`new func()`的返回值无关，`new`调用函数中`this`的指向是指向一个新创建的对象，也就是我们上例中传入的`tmpObj`。



### 箭头函数

> `() => {}`，这是`ES6`的一种定义函数的方式，该函数没有自己的`this`，它的`this`是由它的上级作用域中的`this`决定。

关于箭头函数具体可以参考：

1. [箭头函数(ES6-ruanyifeng)][arrow function(ruanyifeng)]；

2. [箭头函数(MDN)][arrow function(MDN)]；



箭头函数需要注意的几点：

1. 箭头函数没有自己的 `this` 对象，箭头函数的 `this` 取决于它的上级作用域中的 `this`；
2. 由于箭头函数没有自己的 `this` 指针，调用显式绑定方式调用该函数时（`call, apply, bind`），它们的第一个参数会被忽略，而只能正常识别传递后面的参数列表，也就是说无法绑定函数的 `this`，这也就意味着箭头函数的 `this` 是无法通过显式绑定方式改变的；
3. 不可以当作构造函数，也就是说，不可以对箭头函数使用 `new`运算符，否则会抛出一个错误；
4. 没有自己的 `arguments` 对象，当然，如果父级作用域有 `arguments`，它是可以正常和访问变量一样使用的。如果要用，可以用 `rest` 参数代替；
5. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数；



举一个例子：

```js
var name = 'window'

var person1 = {
  name: 'person1',
  show1: () => console.log(this.name),
  show2: function () {
    return () => console.log(this.name)
  }
}
var person2 = { name: 'person2' }

person1.show1() // window
person1.show1.call(person2) // 箭头函数 call 的第一个参数会被忽略, window

person1.show2()() // 对象调用 + 箭头函数 person1
person1.show2().call(person2) // 对象调用 + 箭头函数 call 的第一个参数会被忽略, person1
person1.show2.call(person2)() // 对象调用 + call + 箭头函数 person2
```



参考：[let 具有块级作用域][let]

在`ES6`之前只有两种作用域，分别是全局作用域和函数作用域，在`ES6`时多出来一种块级作用域。

我们这里需要知道的就是前两种就够了。



`person.show1()`：箭头函数是没有自己的`this`的，它依赖于的上级作用域中的`this`，这里它的上级作用域是全局作用域，也就是说不管是严格模式还是非严格模式，它的`this`都是指向`window`。



`person1.show1.call(person2)`：箭头函数通过显式绑定的方式（`call, apply, bind`）指定`this`时，指定是无效的，也就是说这里的箭头函数的`this`依旧是寻找上级作用域中的`this`，同样指向`window`。



`person1.show2()()`：

1. `const func = person1.show2()`得到一个箭头函数；
2. `func()`

这个`func`就是箭头函数，它的`this`和它上级作用域的`this`绑定的，这里我们发现它的上级作用域是函数作用域，也就是`show2`这个函数的作用域，`show2`函数的是由`person1`对象调用的，也就是隐式绑定的方式指定的`this`，那么`show2`函数的`this`指向`person1`，因此`func`的`this`指向`person1`。



`person1.show2().call(person2)`：

1. `const func = person1.show2()`得到一个箭头函数；
2. `func.call(person2)`

这个`func`就是箭头函数，箭头函数通过显式绑定的方式（`call, apply, bind`）指定`this`时，指定是无效的，也就是说这里的箭头函数的`this`依旧是寻找上级作用域中的`this`，同样指向`show2`函数中的`this`，也就是`person1`。



`person1.show2.call(person2)()`：

1. `const func = person1.show2.call(person2)`得到一个箭头函数；
2. `func()`

这个`func`就是箭头函数，它的`this`和它上级作用域的`this`绑定的，这里我们发现它的上级作用域是函数作用域，也就是`show2`这个函数的作用域，`show2`函数的是由`call(person2)`的方式调用，也就是显式绑定的方式指定的`this`，那么`show2`函数的`this`指向`call`的第一个参数`person2`，因此`func`的`this`指向`person2`。



注意：

有很多人箭头函数中的`this`是固定的，在定义时就决定了的。而普通函数的`this`是在运行时才知道的，但是经过上面我们的例子发现，其实箭头函数的`this`不是固定的。

因为箭头函数的`this`和它的上级作用域中的`this`是绑定的，如果它的上级作用域是普通函数中的函数作用域，那么该箭头函数中的`this`也是在该普通函数调用时才决定。



### DOM 事件绑定函数

> 通过 `addEventerListener(eventName, cb)`或者`onEventName --> onclick = cb`的方式给`DOM`元素注册的回调函数中的`this`指向绑定该事件的元素，也就是和`ev.target`相同。



```html
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>

  <script>
    const ul = document.querySelector('ul')
    ul.addEventListener('click', function (ev) {
      console.log('ev-currentTarget', ev.currentTarget) // 不会变化，指向当前绑定事件的元素
      console.log('ul-this', this) // 不会变化，同样指向当前绑定事件的元素
      console.log('ev.currentTarget === this', ev.currentTarget === this) // true

      console.log('ev-target', ev.target) // 会变化，指向触发事件处理函数的元素
    })
  </script>
</body>

</html>
```



关于`currentTarget, target`可以参考：

1. [currentTarget(MDN)][currentTarget]；

2. [target(MDN)][target]；

[currentTarget] 指向当前绑定事件的元素，它是不可变的，而 [target] 指向触发当前事件的元素，因此可变。





## 总结

判断`this`的指向可以总结为如下几步：

1. 当前`this`在全局上下文还是在函数上下文，如果是全局上下文，那么直接就是`window`，如果是函数上下文就接着往下走；
2. 对于函数上下文，我们可以看函数的调用方式被划分为哪一种类别：
   + 如果是`foo()`的形式，或者`setTimeout(foo, timeout), setInterval(foo, timeout)`，那么采用默认绑定的规则；
   + 如果是`xxx.foo()`的形式，那么采用隐式绑定的规则；
   + 如果是`foo.call(thisArg, ...args), foo.apply(thisArg, [args]), foo.bind(thisArg, ...args)()`的形式，那么采用显式绑定的规则；
   + 如果是`new foo()`的形式，那么采用`new`绑定的规则；
   + 如果该函数是`() => xxx`，那么采用箭头函数的规则；
   + 如果当前函数是通过 `addEventerListener(eventName, foo)`或者`onEventName --> onclick = foo`的方式注册的，那么采用`DOM`事件绑定函数的规则；


## 经典面试题

### 测试题 1

```js
var name = 'window'

var person1 = {
  name: 'person1',
  show1: function () {
    console.log(this.name)
  },
  show2: () => console.log(this.name),
  show3: function () {
    return function () {
      console.log(this.name)
    }
  },
  show4: function () {
    return () => console.log(this.name)
  }
}
var person2 = { name: 'person2' }

person1.show1() // 对象调用 person1
person1.show1.call(person2) // call person2

person1.show2() // 箭头函数 window
person1.show2.call(person2) // 箭头函数 call 的第一个参数会被忽略， window

person1.show3()() // 普通调用 window
person1.show3().call(person2) // call person2
person1.show3.call(person2)() // 普通调用 window 

person1.show4()() // 对象调用 + 箭头函数 person1
person1.show4().call(person2) // 对象调用 + 箭头函数 call 的第一个参数会被忽略，person1
person1.show4.call(person2)() // 对象调用 + call + 箭头函数 person2

```



### 测试题 2

```js
var name = 'window'

function Person(name) {
  this.name = name
  this.show1 = function () {
    console.log(this.name)
  }
  this.show2 = () => console.log(this.name)
  this.show3 = function () {
    return function () {
      console.log(this.name)
    }
  }
  this.show4 = function () {
    return () => console.log(this.name)
  }
}

var personA = new Person('personA')
var personB = new Person('personB')

personA.show1() // new + 对象调用，personA
personA.show1.call(personB) // new + 对象调用 + call，personB

personA.show2() // new + 对象调用，personA
personA.show2.call(personB) // new + 箭头函数 call 的第一个参数会被忽略, personA

personA.show3()() // new + 对象调用 + 普通调用，window
personA.show3().call(personB) // new + 对象调用 + call，personB
personA.show3.call(personB)() // new + 对象调用 + call + 普通调用，window

personA.show4()() // new + 对象调用 + 箭头函数，personA
personA.show4().call(personB)  // new + 对象调用 + 箭头函数 call 的第一个参数会被忽略，personA
personA.show4.call(personB)()  // new + 对象调用 + call + 箭头函数， personB
```



### 测试题 3（最难）

> 知识点：
>
> + 原型链
>
> + 变量提升
>
> + `this`
>
> + 运算符优先级

```js
// 测试题
function Foo() {
  // 这个会污染全局的 getName
  getName = function () {
    console.log(1)
  }
  return this
}
Foo.getName = function () {
  console.log(2)
}
Foo.prototype.getName = function () {
  console.log(3)
}
var getName = function () {
  console.log(4)
}
// 函数声明是预编译阶段就已经放到 AO 中了，还没到执行阶段
function getName() {
  console.log(5)
}

//请写出以下输出结果：
Foo.getName() // 2
getName() // 4

// 执行 Foo() 之后，全局的 getName 被覆盖了
Foo().getName() // 此时函数内部的 this --> window，那么此时的 getName() 对应的应该是外界的 getName，结果为 1

getName() // 1

// 运算符的优先级，new 带不带参数优先级是不同的  带参数优先级比不带参数优先级更高
// 带参数指的是 new 后面的表达式中有()
// 不带参数就是后面的表达式没有()

// new 带参数
new Foo.getName() // --> (new (Foo.getName)()) 这里要注意的是 getName 后面的括号不能看作函数调用，而要看作 new ... (...) 带参数
// 1. getName = Foo.getName
// 2. new getName() , 将 getName 用 new 来调用 这里会输出 2，然后返回值是 {}

// new 带参数
new Foo().getName() // --> ((new Foo()).getName)() 这里要注意的是 getName 后面的括号不能看作函数调用，而要看作 new ... (...) 带参数
// 1. foo = new Foo()
// 2. getName = foo.getName --> Foo.prototype.getName ... 原型链查找
// 3. getName() --> 输出 3

new new Foo().getName() // --> (new ((new Foo()).getName)()) 这里要注意的是 getName 后面的括号不能看作函数调用，而要看作 new ... (...) 带参数
// 1. foo = new Foo()
// 2. getName = foo.getName --> Foo.prototype.getName ... 原型链查找
// 3. new getName() 将 getName 用 new 来调用 这里会输出 3，然后返回值是 {}
```