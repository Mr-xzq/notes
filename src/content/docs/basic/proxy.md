---
title: Proxy 基本概念和使用
---

[Object.defineProperty]: ./object-api#objectdefineproperty

# Proxy 基本概念和使用

## 基础概念

> 注意的是，只有访问代理对象（而不是访问被代理的原始对象），拦截操作才会生效。

`Proxy` 是一个代理对象，这个代理对象可以拦截对某个对象的操作，从而改变其行为。

`Proxy` 可以理解成，在目标对象之前架设一层**拦截** ，外界对该对象的访问，都必须先通过这层拦截。

因此提供了一种机制，可以对外界的访问进行过滤和改写。

`new Proxy(targetObj, handler)`，其构造器一共有两个参数，第一个参数是被代理的原始对象，第二个参数的类型也是一个对象，不过其中定义的属性是对原始对象拦截的行为。

例如：`new Proxy({}, { get(){}, set(){} ... })`

`Proxy` 目前一共提供 `13` 种支持的可拦截的行为，下面是 `Proxy` 支持的拦截操作一览，一共 13 种。

下文的`proxy`（首字母小写）指的都是通过`new Proxy()`生成的代理对象的实例。

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`；

- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值；

- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值；

- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值；

- **ownKeys(target)**：拦截

  - `Object.getOwnPropertyNames(proxy)`；
  - `Object.getOwnPropertySymbols(proxy)`；
  - `Object.keys(proxy)`；
  - `for...in`循环；

  返回一个代表对象属性的数组，并且该数组的成员类型只能是字符串或者`Symbol`，不然会有抛出异常；

- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象；

- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值；

- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值；

- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象；

- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值；

- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截；

- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`；

- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`；

参考：https://es6.ruanyifeng.com/#docs/proxy 。

## 使用入门

```js
// 这里的 target1 就是被代理的原始对象
const target1 = {
  name: "xzq",
};

// 这里的 handler1 就是对 target1 对象进行拦截的处理函数(也就是如何拦截, 拦截哪些操作)
// 如果 handler1 为空对象, 也就是没有提供任何拦截的行为, 那就等同于直接通向原对象。
const handler1 = {};

const target1Proxy = new Proxy(target1, handler1);

// 这里的 target1Proxy 就是 target1 的代理对象
// 最常见的就是拦截访问 target1 的属性的行为, 我们可以在 handler1 对象中定义 get 函数
// 这里可以大致理解为 Object.defineProperty(target1, { get() {} })
handler1.get = function (targetObj, propKey, receiver) {
  // targetObj 就是被代理的原始对象 target1
  // console.log('targetObj', targetObj)
  // propKey 就是访问的属性 key
  // console.log('propKey', propKey)
  // receiver 就是我们是直接从哪个对象上获取的该属性值, 这个后面再细讲
  // console.log('receiver', receiver)
  // 这里可以进行自定义的操作, 比如访问被代理原始对象的值
  return targetObj[propKey];
};

// 注意，要使得 Proxy 起作用，必须针对 Proxy 实例进行操作，而不是针对被代理的原始对象进行操作。
// 也就是这里我们需要访问代理对象, 而不是访问原始的被代理对象

// error
// let target1Name = target1.name

// 这个操作就会被代理对象拦截到, 触发我们定义再 handler 对象中的 get 函数
// target1Proxy.name
```

后面我们就常用的三个拦截行为，`get, set, apply`进行详细的描述，其他的拦截行为可以参考：https://es6.ruanyifeng.com/#docs/proxy 。

## handler - get

` get` 方法用于拦截某个属性的读取操作，可以接受三个参数。

依次为目标对象、属性名和 `Proxy` 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

### 使用案例

1. 实现数组读取负数的索引；

   ```js
   // 返回代理对象
   function proxyArr(arr = []) {
     if (!Array.isArray(arr)) return;
     return new Proxy(arr, {
       // 拦截 get
       get(originArr, propKey, receiver) {
         let index = Number(propKey);
         index = index < 0 ? originArr.length + index : index;
         return originArr[index];
       },
     });
   }
   const arr1 = [1, 2, 3];
   // 数组的位置参数是 -1，就会输出数组的倒数第一个成员。
   const arr1Proxy = proxyArr(arr1);
   // arr1Proxy[-1] // 3
   ```

2. 实现属性的链式操作

   核心思路有两点：

   - 为了满足链式调用，且每次都能触发 `proxy` 实例的拦截行为，那么需要在需要链式调用的地方每次都要返回当前 `proxy` 实例；
   - 为了能够使得操作能够被保存起来，待到特定时机再返回结果，那么就需要设计一个缓存列表，将操作行为按照顺序缓存起来，待到需要时，再按顺序触发；

   ```js
   function pipe(val, pipeFunc = []) {
     // 达到下面的效果, 实现 pipe 函数
     const cacheFuncStack = [];
     const proxy = new Proxy(
       {},
       {
         get(originObj, propKey, receiver) {
           if (propKey === "get") {
             // 当访问到是 get 的属性 key 时, 循环触发缓存列表中的函数, 并最终返回该结果
             const res = cacheFuncStack.reduce((prev, cacheFunc) => {
               // 并且把上一次 get 的函数的调用结果(该属性值的类型是函数)作为下一次的入参
               return cacheFunc.call(null, prev);
             }, val);
             return res;
           } else {
             // 当访问到不是 get 的属性 key 时, 就会通过该 key 去 pipeFunc 取值, 如果该值是函数, 那么就将其缓存起来
             const func = pipeFunc[propKey];
             typeof func === "function" && cacheFuncStack.push(func);
             return proxy;
           }
         },
       },
     );
     return proxy;
   }

   const res = pipe(3, [
     (n) => n * 2,
     (n) => n * n,
     (n) => n.toString().split("").reverse().join(""),
   ])[0][1][2]["get"];
   console.log("res: ", res); // 63
   ```

### 第三个参数 receiver

`get` 的第三个参数 `receiver` 指的是直接的**读操作**所在的那个对象，也就是直接访问该属性的对象 （跟这个属性实际属于谁没关系）。

```js
const target3 = {
  name: "xzq",
};
const handler3 = {};
const target3Proxy = new Proxy(target3, handler3);
// target3Son 通过原型链继承 target3Proxy
const target3Son = Object.create(target3Proxy);

// target3Son 本身是没有 name 属性的, 因此访问的实际是 target3Proxy , 但是实际 name 属性是在 target3 上,
// 我们访问的却是代理对象, 因此访问属性的操作被拦截了, 返回的是 receiver
handler3.get = function (targetObj, propKey, receiver) {
  return receiver;
};
// name 实际上是在 target3 原始对象上, 但是由下面的例子可知, receiver 和 name 属性实际从哪里获取是没关系的
// 此时的 target3Son.name 的 receiver 应该是 target3Son, 是 target3Son 直接通过 . 运算符来访问的该属性
target3Son.name === target3; // false
target3Son.name === target3Proxy; // false
target3Son.name === target3Son; // true
```

### handler - get 的限制

当一个属性的描述符中的 `writable: false` 或者 `configurable: false`，那么 `proxy` 中的 `get` 可能会有问题。

```js
const target2 = {
  name: "xzq",
};

// 当被代理对象的某属性值 writable, configurable 同时为 false 时, 那么在拦截其 get 方法时
// 只能返回其原有值(和原有值相同的值), 如果返回其他值会报错
Object.defineProperty(target2, "name", {
  writable: false,
  configurable: false,
});
const target2Proxy = new Proxy(target2, {
  // 无法定义 get 拦截, 会报错, 因为该属性 writable 和 configurable 为 false
  get(targetObj, propKey, receiver) {
    // 这样写却没问题
    // return targetObj[propKey]
    // 这样写也不会报错
    // return 'xzq'

    // 我们推理一下, 先看看上面和下面的区别, 上面的访问的是原值(获取的都是 'xzq'), 也就是得到的值, 和定义上在属性上的值是相同的
    // 而下面的值, 我们 return 'xxx' 和原始值 'xzq' 是不同的

    // 这样写就会报错, 我猜测访问时会对被代理对象的该属性进行操作, 比如 改变它的值, 或者对它进行配置之类的
    return "xxx";
  },
});
// 触发代理对象的 get 时报错
target2Proxy.name;
```

具体参考：[Object.defineProperty]。

## handler - set

` set`方法用来拦截某个属性的赋值操作。

可以接受四个参数，依次为目标对象、属性名、属性值和 赋值的原始对象（也就是到底是哪个对象直接赋的值, 一般来说是 `Proxy` 实例），其中最后一个参数可选。

### 使用案例

1. 假定 `Person` 对象有一个 `age` 属性，该属性应该是一个不大于 `200` 的整数，那么可以使用 `Proxy` 保证 `age` 的属性值符合要求；

   ```js
   class Person {
     constructor(name, age) {
       this.name = name;
       this.age = age;
     }
   }
   const person1 = new Person("xzq", 18);
   const validateAge = (age) => Number.isInteger(age) && age <= 200;
   const handlerPerson1 = {
     // 拦截 set
     set(targetObj, propKey, val, receiver) {
       if (propKey === "age" && !validateAge(val)) {
         throw new Error("age should be integet and < 200");
       }
       targetObj[propKey] = val;
       return true;
     },
   };
   const person1Proxy = new Proxy(person1, handlerPerson1);
   // person1Proxy.age = 200 // success
   // person1Proxy.age = 201 // error
   ```

2. 通过 `get, set`的配置，禁止对象内部私有属性被外部访问读写，私有属性名的第一个字符使用下划线开头，例如：`_xxx`；

   ```js
   const obj1 = {
     _name: "xzq",
     age: 18,
   };
   function proxyObjAccessToPrivate(obj) {
     return new Proxy(obj, {
       // 拦截 get
       get(target, propKey, receiver) {
         if (propKey.startsWith("_")) {
           throw new Error("do not access to get privite field");
         }
         return target[propKey];
       },
       // 拦截 set
       set(target, propKey, val, receiver) {
         if (propKey.startsWith("_")) {
           throw new Error("do not access to set privite field");
         }
         target[propKey] = val;
         return true;
       },
     });
   }
   const obj1Proxy = proxyObjAccessToPrivate(obj1);
   // success
   // obj1Proxy.age = 12
   // error
   // obj1Proxy._name = 'xxx'
   ```

### 第四个参数 receiver

`set` 的第四个参数 `receiver` 指的是直接的**写操作**所在的那个对象，也就是直接访问该属性的对象 （跟这个属性实际属于谁没关系）。

```js
const obj2 = {
  name: "xzq",
};
const obj2Proxy = new Proxy(obj2, {
  set(targetObj, propKey, val, receiver) {
    targetObj[propKey] = receiver;
  },
});

// 这里直接的操作者是 obj2Proxy 对象
// obj2Proxy.name = 'xxx'
// obj2Proxy.name === obj2Proxy // true

const obj2ProxySon = Object.create(obj2Proxy);
// 因为 obj2ProxySon 对象本身是没有 name 属性的, 然后通过原型链访问的 obj2Proxy 的 name 属性
// 这里可以发现 receiver 指向的是直接给 name 赋值的对象(跟这个属性实际属于谁没关系), 也就是所谓的直接操作者

// 这里的直接操作者是 obj2ProxySon 对象
obj2ProxySon.name = "xxx";
obj2ProxySon.name === obj2Proxy; // false
obj2ProxySon.name === obj2ProxySon; // true
```

### handler-set 的限制

如果目标对象自身的某个属性不可写，那么 `set` 方法中对原始对象值改变的操作不会生效，这里也不会报错，这是由于 `writable: false`的特性。

具体参考：[Object.defineProperty]。

```js
const obj3 = {
  name: "xzq",
};
const obj3Proxy = new Proxy(obj3, {
  set(targetObj, propKey, val, receiver) {
    // 这里依旧会有输出, 说明操作依旧被代理对象拦截到
    console.log("set: ", val); // set: abc
    // 只不过由于 writable 为 false, 因此对原对象的赋值操作没有失效罢了
    targetObj[propKey] = val;
    return true;
  },
});
// 如果 writable 为 false, 那么 obj3Proxy 的 set 就会失效,
Object.defineProperty(obj3, "name", {
  writable: false,
});
// obj3Proxy.name = 'abc'
// obj3Proxy.name // 'xzq'
```

在严格模式下（这里的严格模式最好声明在脚本顶端），`set`中必须有返回值，且返回值必须是 `true`，不然会抛异常。

```js
// 注意，set 代理应当返回一个布尔值。严格模式下，set 代理如果没有返回 true，就会报错。
// 严格模式下，set 代理返回 false 或者 undefined，都会报错。
// 这里开启严格模式需要在全局开启, 也就是当前脚本的顶部 'use strict'
// 如果在 function 中声明严格模式, 这里就没这个效果

// 因此这里的最佳实践还是在 set 中 return true
// 在脚本(js 文件)顶端声明, 开启该脚本全局严格模式
"use strict";

const obj4 = {
  name: "xzq",
};
function proxyObj4(obj) {
  return new Proxy(obj, {
    set(targetObj, propKey, val, receiver) {
      console.log("1");
      targetObj[propKey] = val;
      // 如果没有 return true 就会报错
      // error
      // return false
      // error
      // return undefined
      // success
      return true;
    },
  });
}
const obj4Proxy = proxyObj4(obj4);
obj4Proxy.name = "abc";
```

## handler - apply

> 要注意的是，这里的 `new Proxy(xxx, { apply(){} })`，中的第一个参数 `xxx` 应该是一个函数，也就是被代理者的类型应该是一个函数。

`handler-apply`方法拦截函数的调用、`call`和`apply`操作。

`handler-apply`方法可以接受三个参数，分别是目标函数、目标对象的上下文对象`this`和目标对象的参数数组。

这样就比较容易实现装饰者模式, 对某个方法进行增强。

### 使用案例

1. 给一个求和函数 `sum`，在不改变内部`sum`内部代码的情况下，让其结果翻倍。

   ```js
   const sum1 = function (...args) {
     console.log("sunm1");
     return args.reduce((prev, cur) => prev + cur, 0);
   };
   // 对一个方法进行代理
   const doubleSum1Proxy = new Proxy(sum1, {
     apply(targetFunc, ctx, args) {
       // 这里不能直接通过  Function.prototype.call 或者 Function.prototype.apply, 因为 call或者 apply 的调用者只能是方法
       // 它们内部的实现应该对 this 有过判断
       // error
       // return Function.prototype.apply(targetFunc, ctx, args)
       console.log("前置操作...");
       const res = targetFunc.apply(ctx, args);
       console.log("后置操作...");
       return res;
     },
   });
   ```

2. 封装一个 `aop`的切面函数，改函数需要满足的功能：能够指定前置，后置，环绕切面函数，并且还能改变原函数的参数。

   ```js
   // 封装一下, 对一个方法进行指定拦截
   function aopFunction(func, aopOptions = {}) {
     if (typeof func !== "function") return;
     const beforeAop =
       typeof aopOptions.beforeAop === "function" ? aopOptions.beforeAop : null;
     const afterAop =
       typeof aopOptions.afterAop === "function" ? aopOptions.afterAop : null;
     const aroundAop =
       typeof aopOptions.aroundAop === "function" ? aopOptions.aroundAop : null;
     const changeArgs =
       typeof aopOptions.changeArgs === "function"
         ? aopOptions.changeArgs
         : null;
     return new Proxy(func, {
       apply(targetFunc, ctx, args) {
         const originArgs = args;
         if (changeArgs) {
           args = changeArgs(args);
         }
         beforeAop && beforeAop.apply(ctx, [originArgs, args]);
         aroundAop && aroundAop.apply(ctx, [originArgs, args]);
         const res = targetFunc.apply(ctx, args);
         afterAop && afterAop.apply(ctx, [originArgs, args]);
         aroundAop && aroundAop.apply(ctx, [originArgs, args]);
         return res;
       },
     });
   }
   function demo1Func(...args) {
     console.log("demo1Func-arg1", args);
   }
   const demo1AopFunctionOptions = {
     beforeAop() {
       console.log("beforeAop");
     },
     afterAop() {
       console.log("afterAop");
     },
     aroundAop() {
       console.log("aroundAop");
     },
     changeArgs(args) {
       // 其实可以直接 push args, 因为 args 是引用值类型, 所以传进来的直接就是引用地址, 但是个人感觉一个有副作用的函数不太棒
       const cloneArgs = [...args];
       cloneArgs.push("changeArgs");
       return cloneArgs;
     },
   };
   const demo1FuncProxy = aopFunction(demo1Func, demo1AopFunctionOptions);
   demo1FuncProxy("1111");
   ```

## Proxy.revocable()

生成 `Proxy` 实例的方式除了 `new Proxy(target, handler)` 之外。

还可以通过 `const { proxy, revoke } = Proxy.revocable(target, handler)` 来生成，在对返回值的

解构中, `proxy` 是对应的代理对象的实例, 而 `revoke` 是一个函数，可以取消和它对应的 `Proxy` 实例。

```js
const { proxy, revoke } = Proxy.revocable(
  { name: "xzq" },
  {
    get(targetObj, propKey, receiver) {
      console.log("拦截 get 获取属性", propKey);
      return Reflect.get(targetObj, propKey, receiver);
    },
  },
);

// 正常拦截
proxy.name;

// 取消代理
revoke();

// 抛出异常, Cannot perform 'get' on a proxy that has been revoked
// proxy.name
```

参考：https://es6.ruanyifeng.com/#docs/proxy#Proxy-revocable 。

## Proxy 中的 this

> 注意是：
>
> 1. 只有函数中才有 `this` 这个概念；
> 2. 调用某对象的函数，也是先获取这个函数（这里会触发`get`），然后再去调用该函数；

注意两个点：

1. `proxy` 中 `handler` 中的 `this` 指向 `handler` 对象；

   ```js
   const handler1 = {
     get(targetObj, propKey, receiver) {
       console.log(this === handler1);
       return Reflect.get(targetObj, propKey, receiver);
     },
   };
   const proxy1 = new Proxy({ name: "xzq" }, handler1);

   // 输出 true
   proxy1.name;
   ```

2. 被代理对象方法中的 `this` 指向该属性的直接调用者；

   ```js
   const originObj1 = {
     name: "xzq",
     run(speed) {
       console.log("originObj1: ", this === proxyOriginObj1);
       console.log(`奔跑速度为: ${speed}`);
     },
   };
   const proxyOriginObj1 = new Proxy(originObj1, {
     get(targetObj, propKey, receiver) {
       return Reflect.get(targetObj, propKey, receiver);
     },
   });
   // 这里我们得知, 在调用对象的方法之前, 也会先触发 get 先获取该方法, 然后再调用

   // 这里是由代理对象调用的该方法(和这个方法实际属于谁无关), 原始对象中的 this 指向直接调用者, 此刻指向代理对象 proxyOriginObj1
   // proxyOriginObj1.run(1)
   // 直接调用者换成原始对象, 因此此刻 run 方法中的 this, 指向 originObj1 原始对象
   // originObj1.run(2)
   ```

   正是因为这个原因，在被代理对象中的一些方法如果对 `this` 指向有限制的话，那么就会出现错误：

   ```js
   const date1 = new Date();
   const date1ProxyHandler = {
     get(targetObj, propKey, receiver) {
       // 修正原始对象方法中 this 丢失的问题
       // if(propKey === 'getDate' && typeof targetObj[propKey] === 'function' ) {
       //   return Reflect.get(targetObj, propKey, receiver).bind(targetObj)
       // }
       // 如果只有下面这行, 那么会导致 error
       return Reflect.get(targetObj, propKey, receiver);
     },
   };
   const date1Proxy = new Proxy(date1, date1ProxyHandler);
   // 抛出异常: TypeError: this is not a Date object。
   // 导致错误的原因是, 此时 getDate 方法内部的 this 指向了 date1Proxy 代理对象, 而不是原来的 date1 实例对象
   date1Proxy.getDate();
   ```

参考：https://es6.ruanyifeng.com/#docs/proxy#this-%E9%97%AE%E9%A2%98 。
