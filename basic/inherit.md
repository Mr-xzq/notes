[原型链]: /basic/prototypeChain
[this]: /basic/this
[原型式继承]: /basic/inherit#原型式继承
[原型链继承]: /basic/inherit#原型链继承
[借用构造函数继承]: /basic/inherit#借用构造函数继承
[组合继承]: /basic/inherit#组合继承
[寄生式继承]: /basic/inherit#寄生式继承

[Object.create()]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

# 继承

## 前置知识

1. [原型链]；
2. [`this`详解][this]；

## 原型链继承

```js
function Parent(name) {
  this.name = name
  this.hobbies = []
}

Parent.prototype.printName = function() {
  console.log('name: ', this.name)
}

function Son(name) {}
Son.prototype = new Parent()

// 这里传的参数是无效的
const son1 = new Son('xxx')
son1.printName() // name:  undefined
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

// 只有在获取不存在的属性时，才会去原型链上查找，设置不存在的属性并不会这样做
// 这里修改的不是原型链上的属性，而是给 son1 自己新添加了一个 name 属性
// 因此这里并不会影响到另外的以 new Parent() 为原型的对象对 name 属性的获取
son1.name = 'xxx'
son1.printName() // name: xxx



const son2 = new Son('xxx')
son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son1-football', 'son2-basketball']

son2.printName() // name: undefined
```



缺点：

1. `Son`无法复用`Parent`的构造器；

2. `Son`的实例对象由于没有独属于自身的属性，访问的都是原型上的属性，导致修改属性（特指引用类型的变量不改变引用的情况，比如: `const arr = []; arr.push('xxx')`）时会修改掉原型上的值，这样就会对其他共享此原型的对象造成影响；



## 借用构造函数继承

```js
function Parent(name, hobbies) {
  this.name = name
  this.hobbies = hobbies
}

Parent.prototype.printName = function() {
  console.log('name: ', this.name)
}

function Son(name, hobbies) {
  Parent.call(this, name, hobbies)
}

const son1 = new Son('xxx', [])
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

// son1.printName() // error, 无法通过原型链去访问 printName 方法


const son2 = new Son('xxx', [])
son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son2-basketball']
```



优点：

1. `Son`可以复用`Parent`的构造器；

缺点：

1. 由于没有使用原型链，`Son`只能继承`Parent`构造器中含有的属性或者方法，无法通过原型链去访问`Parent.prototype...`的方法；

一般来说借用构造函数继承这种方式很少单独使用。



## 组合继承

它是结合 [原型链继承] + [借用构造函数继承] 两种方式的一种新方式。

```js
// 组合式继承
function Parent(name, hobbies) {
  this.name = name
  this.hobbies = hobbies
}

Parent.prototype.printName = function() {
  console.log('name: ', this.name)
}

function Son(name, hobbies) {
  Parent.call(this, name, hobbies)
}

Son.prototype = new Parent()

const son1 = new Son('son1', [])
son1.printName() // son1
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

console.log('son1: ', son1)




const son2 = new Son('son2', [])
son2.printName() // son2
son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son2-basketball']
```



优点：

1. 避免了 [原型链继承] 中`Son`无法复用`Parent`构造器的问题；
2. 避免了[借用构造函数继承] 中`Son`无法通过原型链去访问`Parent.prototype`上的方法的问题；

缺点：

1. `son`的实例和`son.__proto__`上具有重复的属性名和方法名，这是由于`Son.prototype = new Parent()` 和`Son`中调用了`Parent.call(this, xxx)`造成的；

   ![image-20220217170712042](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220306/19:25:19-%E7%BB%84%E5%90%88%E7%BB%A7%E6%89%BF%E9%80%A0%E6%88%90%E7%9A%84%E7%BC%BA%E7%82%B9.png)




## 原型式继承

这和`ES5`中`Object.create()`很类似。

参考：[Object.create()]

`Object.create(proto, [propertiesObject])`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

第一个参数`proto`指的就是这个新对象的`__proto__`需要指向的对象。

第二个参数是`[propertiesObject]`，它是可选的，该参数和`Object.defineProperties()`的第二个参数相同。

同时注意，如果`proto`参数是原始值类型（`null`除外），则抛出一个 `TypeError`异常。

比如：

```js
// Uncaught TypeError: Object prototype may only be an Object or null: 0
Object.create(0)

// success
Object.create(new Number(0))
Object.create({})
// success
Object.create(null)
```



接下来我们通过原型式继承来实现一下`Object.create(proto)`方法，它的思路就是创建一个临时对象，让临时对象的构造函数的`prototype`指向我们传入的`proto`。

```js
function createObject(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}
```



接下来应用一下：

```js
function Person(name, hobbies) {
  this.name = name
  this.hobbies = hobbies
}

Person.prototype.printName = function () {
  console.log('name: ', this.name)
}

const person = new Person('xxx', [])



const subPerson1 = createObject(person)
subPerson1.hobbies.push('subPerson1-basketball')
console.log(subPerson1.hobbies) // ['subPerson1-basketball']

// 只有在获取不存在的属性时，才会去原型链上查找，设置不存在的属性并不会这样做
// 这里修改的不是原型链上的属性，而是给 subPerson1 自己新添加了一个 name 属性
// 因此这里并不会影响到另外的以 person 为原型的对象对 name 属性的获取
subPerson1.name = 'xzq'
subPerson1.printName() // name:  xzq


const subPerson2 = createObject(person)
subPerson2.hobbies.push('subPerson2-football')
console.log(subPerson2.hobbies) // ['subPerson1-basketball', 'subPerson2-football']

// 这里并没有被影响到, 因为这里获取的是原型上的 name 属性
subPerson2.printName() // name:  xxx
```



缺点：

1. 和原型链继承有同样的问题，`const obj = createObject(proto)`，`obj`没有独属于自身的属性，访问的都是`proto`的属性，导致修改属性（特指引用类型的变量不改变引用的情况，比如: `const arr = []; arr.push('xxx')`）时会修改掉`proto`的属性，这样就会对其他共享此`proto`的对象造成影响；
2. 无法`createObject`的过程中对生成的对象进行自定义；



## 寄生式继承

寄生式继承是与原型式继承差不多的思路，只不过再寄生式继承中会对对对象进行某种增强，比如增加某个方法，比如增加某个属性。

```js
// 原型式继承
function createObject(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}

// 寄生式继承
function createAnotherObject(proto) {
  const obj = createObject(proto)
  
  // 对生成的对象进行某种增强
  obj.run = function() {}
  obj.age = 18
  //...
  
  return obj
}
```

其实这里我们就看的出来，寄生式继承只是将原型式继承进行了一层封装而已。

它相比于原型式继承多了一个优点，那就是能够对生成的对象进行自定义。

它同样具有原型式继承的缺点：

1. 和原型链继承有同样的问题，`const obj = createObject(proto)`，`obj`没有独属于自身的属性，访问的都是`proto`的属性，导致修改属性（特指引用类型的变量不改变引用的情况，比如: `const arr = []; arr.push('xxx')`）时会修改掉`proto`的属性，这样就会对其他共享此`proto`的对象造成影响；



## 寄生组合式继承

就是将 [寄生式继承] 和 [组合继承] 两种方式进行合并，摒弃它们的缺点，获得它们的优点。

```js
function Parent(name, hobbies) {
  this.name = name
  this.hobbies = hobbies
}

Parent.prototype.printName = function() {
  console.log('name: ', this.name)
}

function Son(name, hobbies) {
  Parent.call(this, name, hobbies)
}

// 只要关联上了父类的实例，那么都会出现`Son`的不同实例共享父类这个实例的属性的问题
// Son.prototype = new Parent()

//  因此这里采用寄生式继承的思想

function F() {}
// 如果直接将原型进行共享，会导致两个构造函数的原型对象相互影响
// Son.prototype = Parent.prototype
F.prototype = Parent.prototype
// 这样就避免了需要额外将 Parent 实例化一次
Son.prototype = new F()


const son1 = new Son('son1', [])
son1.printName() // son1
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

console.log('son1: ', son1)

const son2 = new Son('son2', [])
son2.printName() // son2
son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son2-basketball']
```



优点：

1. `Son.prototype = new F()` 相比于 `Son.prototype = new Parent()`：一方面，不用为了实现继承还需要额外去实例化`Parent`，另一方面就是会让`Son.prototype`上不会多出冗余的属性（重复的属性）；
2. `Son`可以复用`Parent`构造函数；
3. `Son`的实例可以通过`Parent`的原型去访问对应的属性或者方法；



这里我们在对其进行一些封装：

```js
function _extends(Son, Parent) {

  // 1. 通过一个暂时的中间对象将 Son.prototype 和 Parent.prototype 关联起来

  // function F() {}
  // const f = new F()
  // F.prototype = Parent.prototype
  // Son.prototype = f

  // 简写成如下

  Son.prototype = Object.create(Parent.prototype)

  // -----------------------------------

  // 2. 由于第一步 Son.prototype 指向了别人变的面目全非了, 因此这里我们需要将其进行整容, 让其保留一些原来的属性

  Son.prototype.constructor = Son

  // 3. 通过 super 属性保存父类的引用
  Son.prototype.super = Parent

  // 4. 让构造函数也完成继承(继承静态属性)
  Son.__proto__ = Parent
}

Parent.staticName = 'static parent'

function Parent(name, age) {
  this.name = name
  this.age = age
}

function Son(name, age, hobbies) {
  this.super(name, age)
  this.hobbies = hobbies
}

_extends(Son, Parent)

console.log('staticName from Parent: ', Son.staticName) // staticName from Parent:  static parent

const son = new Son('xzq', 18, ['足球'])
console.log('son: ', son) // Son { name: 'xzq', age: 18, hobbies: [ '足球' ] }
```



## ES6 Class 继承

`ES6`中继承达到的效果其实和我们前面讲的寄生组合式继承类似，同样都是可以继承静态属性方法和实例属性方法，但是他们有本质性的区别。

`ES6` 规定，子类必须在`constructor()`方法中调用`super()`，否则就会报错。

这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。

如果不调用`super()`方法，子类就得不到自己的`this`对象。



为什么子类的构造函数，一定要调用`super()`？原因就在于 `ES6` 的继承机制，与 `ES5` 完全不同。

比如我们前面封装的`_extends`函数（寄生组合式继承），它的本质就是将`Son.prototype`和`Parent.prototype`关联起来，然后将`Son.__proto__`和`Parent`关联起来，前者达成实例属性的继承，后者达成静态属性的继承，然后将`Parent`保留`Son.prototype.super`上，方便我们在`Son`中复用父类的构造函数，然后`Son`在添加自己的属性或者方法。

然后结合`new`的原理，其实这里只创建了一个`this`，那就是专属于`Son`的`this`，这里你会发现，其实调用`super`的原因就是为了复用父类的构造函数，简化代码。

因此`super`实际上你调与不调都可以，只不过如果不调用`super`的话你想拥有父类构造函数中的属性要自己手动写罢了；

但是在`ES6`中`super`是必须要调用的，而且必须在第一行调用，不然会报错：



```js
class Parent{
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

class Son extends Parent{
  constructor(hobbie) {
    // success
    // super()
    this.hobbie = hobbie
    // error
    // super()
  }
}

// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
const son = new Son('踢足球')
```



这是因为`ES6` 的继承机制，本质上先实例化一个父类的实例对象，然后再将该对象作为子类的实例，也就是说在子类的构造函数中，只有调用`super()`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，必须依赖父类实例的产生。

```js
// 伪代码
function _extends(Son, Parent) {
  // 省略其他继承逻辑
  // ...
  
  // ES6 的继承方式中先调用了 Parent 
  const parent = new Parent(...)
  Son.call(parent, ...)
}
```

这就是为什么 `ES6` 的继承必须先调用`super()`方法，因为这一步会生成一个继承父类的`this`对象，没有这一步就无法继承父类。

这意味着新建子类实例时，父类的构造函数必定会先运行一次。

## 注意点

这里发现[原型链继承]，[原型式继承]，[寄生式继承]，都会带来同一个问题：

那就是`Son`的实例由于基本没有属于自身的属性，因此`Son`的实例获取到的属性值基本都是从其原型上拿到的，因此一般对属性的修改都会修改原型上的属性，导致其他共享这一原型的对象同样遭受影响。

以原型链继承的例子为例：

```js
function Parent(name, hobbies) {
  this.name = name
  this.hobbies = hobbies
}

Parent.prototype.printName = function() {
  console.log('name: ', this.name)
}

function Son(name) {}
Son.prototype = new Parent('parent', [])

// 这里传的参数是无效的
const son1 = new Son('xxx')
son1.printName() // name:  parent
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

// 只有在获取不存在的属性时，才会去原型链上查找，设置不存在的属性并不会这样做
// 这里修改的不是原型链上的属性，而是给 son1 自己新添加了一个 name 属性
// 因此这里并不会影响到另外的以 new Parent() 为原型的对象对 name 属性的获取
son1.name = 'xxx'
son1.printName() // name: xxx



const son2 = new Son('xxx')
son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son1-football', 'son2-basketball']

son2.printName() // name: parent
```



由于这里的`Son`的实例是没有对应的自身的属性，不同的实例获取值时，获取的都是`new Parent()`或者`Parent.prototype`上的属性或者方法。

然后在设置值时，如果当前实例对象上没有该属性，那么就会在当前实例对象上新增一个属性，而不是去原型链寻找，然后去设置：

```js
son1.printName() // name:  parent
son1.name = 'xxx'
son1.printName() // name: xxx


son2.printName() // name: parent
```

请看下面的例子，你是否觉得很奇怪，不是说设置值时不会去寻找对应的原型上的值而后进行设置吗？那下面的例子又作何解释：

```js
son1.hobbies.push('son1-football')
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

son2.hobbies.push('son2-basketball')
console.log('son2.hobbies: ', son2.hobbies) // ['son1-football', 'son2-basketball']
```

这是因为在`hobbies.push`方法内部会先通过获取的方式去获取`hobbies`的值，而`hobbies`在当前实例上并没有，因此获取的就是对应的原型上的值，然后对这个值进行操作。

再结合`hobbies`是一个引用类型的值（数组），而`push`操作并不会改变这个数组的引用，因此就会影响到另外的实例对`hobbies`的访问。

用下面的例子来验证我们的说法：

```js
// 直接通过赋值运算符来赋值
// 此时 son1 对象上会新增一个 hobbies 属性, 值为: ['son1-football']
son1.hobbies = ['son1-football']
console.log('son1.hobbies: ', son1.hobbies) // ['son1-football']

// son2 访问的依旧是原型对象上的 hobbies
console.log('son2.hobbies: ', son2.hobbies) // []
```



## 参考链接

https://es6.ruanyifeng.com/#docs/class#new-target-%E5%B1%9E%E6%80%A7

https://es6.ruanyifeng.com/#docs/class-extends

https://lxchuan12.gitee.io/js-extend/#%E9%9D%A2%E8%AF%95%E5%AE%98%E9%97%AE-js%E7%9A%84%E7%BB%A7%E6%89%BF

[JavaScript常用八种继承方案](https://juejin.cn/post/6844903696111763470)

[JS原型链与继承别再被问倒了](https://juejin.cn/post/6844903475021627400)