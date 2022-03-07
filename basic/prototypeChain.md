[__proto__]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
[instanceof]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof
[getPrototypeOf]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf

[基本数据类型和引用数据类型-01]: https://juejin.cn/post/6844904049465098247
[基本数据类型和引用数据类型-02]: https://juejin.cn/post/6992460438902423589

[原型链]: https://juejin.cn/post/6934498361475072014


# 原型链

> 为了后面我们方便理解原型链，这里我们暂且将 `__proto__` 叫做隐式原型，将`prototype`叫做显式原型。

## 基础规则

我们先来了解下面引用类型的四个规则：

1. 引用类型，都具有对象特性，即可自由扩展属性，并且对象存储在栈中的是指针（也就是变量的值），实际内容存储在堆内存中；

2. 引用类型，都有一个隐式原型 `__proto__` 属性，属性值是一个普通的对象；

3. 引用类型，隐式原型 `__proto__` 的属性值指向它的构造函数的显式原型 `prototype` 属性值；

4. 当你试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么它会去它的隐式原型 `__proto__`（也就是它的构造函数的显式原型 `prototype`）中寻找。如果是设置一个属性，则并不会遵循这个规则；



## 理解原型链

接下来我们举几个例子，你就会慢慢地理解原型和原型链。

例子`1`：

```js
const obj = {};
const arr = [];
const fn = function() {}

obj.__proto__ === Object.prototype // true
arr.__proto__ === Array.prototype // true
fn.__proto__ === Function.prototype // true
```

该例能验证上述规则`2, 3`。



例子`2`：

```js
function Person(name) {
  this.name = name
}

Person.prototype.eat = function () {
  console.log(this.name , ': 吃饭')
}

const person = new Person('xxx')

person.eat() // 访问的实际是 Person.prototype.eat

person.toString() // 访问的实际是 Object.prototype.toString
```

该例能验证上面的规则`4`，其实规则`4`就是原型链规则的体现，当一个对象（引用类型）的值上访问不到对应属性时，会去它的隐式原型上查找（`__proto__`），而隐式原型实际指向该对象（引用类型）的构造函数的显式原型`prototype`。





我们来分析一下它们的查找过程：

`person.eat()`：`person.eat() --> person.__proto__.eat() --> Person.prototype.eat()`；



`person.toString()`: `person.toString() --> person.__proto__.toString() --> Person.prototype.toString() --> Person.ptorotype.__proto__.toString() --> Object.prototype.toString()`；

这个`toString`的访问难点就是你需要知道，显式原型（`prototype`）自身是就是一个对象（引用类型），所以它也要符合上述第`4`点规则。

也就是说`Person.prototype`同样具有自身的`__proto__`。

比如这里的：`Person.prototype.toString() --> Person.ptorotype.__proto__.toString()`



而`Person.prototype`的构造函数就是`Object`。

比如这里的：`Person.ptorotype.__proto__.toString() --> Object.prototype.toString()`



这也就引出了原型链的概念了，接下来我们来分析一下`f`对象的原型链是怎么样的：

```js
function Foo() {}
function Fo() {}

Fo.prototype = new Foo()

const f = new Fo()
```

![image.png](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220306/18:48:21-%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%BB%93%E6%9E%84%E7%A4%BA%E6%84%8F%E5%9B%BE.png)









关于`__proto__`补充：

虽说目前一些主流浏览器（`Chrome, Edge...`）仍然支持`__proto__`，但是其实`__proto__`并没有被纳入到目前的`Web`标准中。

具体可以参考：[__proto__(MDN)][__proto__]

关于其兼容性，如下图：

![image-20220217140255198](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220306/18:48:18-__proto__%E5%85%BC%E5%AE%B9%E6%80%A7.png)



关于引用类型补充：

参考：

1. [基本数据类型和引用数据类型-01]；

2. [基本数据类型和引用数据类型-02]；


`JS`中有两种类型的值，一种是原始类型（简单类型），另外一种就是引用类型（复杂类型）。

引用类型的值和原始类型值的差异最根本的就是：

引用类型的引用（指针）存在于栈（栈内存）中，而真实的值其实存在于堆（堆内存）中；

而原始类型的值没有引用（指针）这一说法，值直接就存在于栈（内存）中；



请看下面的例子：

```js
var a1=0;                 // typedof a1 -> number
var a2 = 'this is str';   // typedof a2 -> string
var a3 = null;            // typedof a3 -> null
var c = [1, 2, 3];        // c instanceof Array  ->true
var b = { m: 20 };        // b instanceof Object ->true
```

![img](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220306/18:48:30-JS%E5%8F%98%E9%87%8F%E5%9C%A8%E5%86%85%E5%AD%98%E4%B8%AD%E7%9A%84%E5%AD%98%E5%82%A8.png)

也就是说这里的`b`变量存放的其实只是一个引用（指针）而已，当你通过`b.m = 30`时，`JS`引擎会通过该引用（指针）去寻找堆内存中实际存放的对象，然后去操作它。

常见的引用类型的值有：`Object、Array、Function、Date、RegExp...`。



## instanceof

参考：[instanceof(MDN)][instanceof]

`instanceof`运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

根据前文我们对原型链的讲解，这里我们来自己实现一下`instanceof`运算符。

```js
// 判断 constructorFunc 的 prototype 是否会出现在 obj 的原型链上
function _instanceof(obj, constructorFunc) {

  // let objProto = obj.__proto__
  let objProto = Object.getPrototypeOf(obj)

  const constructorFuncPrototype = constructorFunc.prototype

  while(objProto) {
    if(constructorFuncPrototype === objProto) return true

    objProto = Object.getPrototypeOf(objProto)
  }

  return false
}

function Person() {}
const person = new Person()
console.log('instanceof', _instanceof(person, Person))
console.log('instanceof', _instanceof(person, Object))

function OtherPerson() {}
console.log('instanceof', _instanceof(person, OtherPerson))
```



关于这里的`getPrototypeOf(obj)`方法它获取的是`obj.__proto__`，也就是`obj`它的构造函数的`prototype`。

具体可以参考：[getPrototypeOf(MDN)][getPrototypeOf]



## 参考链接

[原型链(掘金)][原型链]