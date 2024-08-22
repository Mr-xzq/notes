---
title: Reflect
---

[traverseObjectProperty]: /basic/traverseObjectProperty
[proxy]: /basic/proxy

# Reflect

## 基本概念与使用

`Reflect`对象与 [Proxy][proxy] 对象一样，也是 `ES6` 为了操作对象而提供的新 `API`。

`Reflect`对象的设计目的有这样几个：

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。

   现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。

   也就是说，从`Reflect`对象上可以拿到语言内部的方法；

2. 修改某些`Object`方法的返回结果，让其变得更合理。

   比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误。

   而`Reflect.defineProperty(obj, name, desc)`则会返回`false`；

   ```js
   const obj = {};
   // 先设置 name 为不可配置
   Object.defineProperty(obj, "name", {
     configurable: false,
   });
   // 然后对 name 进行配置, 这里会抛出异常
   // 记住, 这里要配置是将配置项改为和其自身原本的值不同的值, 不然不会报错
   // 这样就不会报错
   // Object.defineProperty(obj, 'name', {
   //   writable: false
   // })

   // error
   // Cannot redefine property: name
   // Object.defineProperty(obj, 'name', {
   //   writable: true
   // })

   // 但是如果使用 Reflect 的方法
   // 不会报错, 只会有返回值, 定义失败返回 false
   // 相比于 Object.defineProperty 更加健壮
   const defineRes1 = Reflect.defineProperty(obj, "name", {
     writable: true,
   });
   // console.log('defineRes1: ', defineRes1);
   ```

3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为；

   ```js
   const obj1 = {};
   const obj1Proto = { name: "xzq" };
   Object.setPrototypeOf(obj1, obj1Proto);

   // 这里可以看出来, in 和 Reflect.has 行为相同, 都是判断一个属性在不在一个对象的属性中, 这些属性包括该对象的原型链上的属性
   // 'name' in obj1  // true
   // Reflect.has(obj1, 'name') // true

   // delete obj1.name
   // Reflect.deleteProperty(obj1, 'name')
   ```

4. `Reflect`对象的方法与 [Proxy][proxy] 对象的方法一一对应，只要是 [Proxy][proxy] 对象的方法，就能在`Reflect`对象上找到对应的方法。

   这就让 [Proxy][proxy] 对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。

   也就是说，不管 [Proxy][proxy] 怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

   [Proxy][proxy] 的 `handler`（拦截对象支持的拦截操作方法目前有 `13` 种），那么 `Reflect` 也有这 `13` 种静态方法，`Reflect.apply, Reflect.get, Reflect.set...`；

   ```js
   const obj2 = {
     name: "xzq",
     run(speed) {
       console.log(`当前速度为: ${speed}`);
     },
   };
   const obj2Proxy = new Proxy(obj2, {
     get(...args) {
       console.log("我拦截了 obj2 的 get 操作");
       return Reflect.get(...args);
     },
   });
   const obj2RunProxy = new Proxy(obj2.run, {
     apply(targetFunc, ctx, argArray) {
       console.log("我拦截了 obj2 的 run 方法");
       // error, 通过 Function.prototype.apply 无法执行函数
       // Function.prototype.apply(targetFunc, ctx, argArray)
       // 通过 Reflect.apply 来完成默认行为, 也就是执行原方法
       return Reflect.apply(targetFunc, ctx, argArray);
     },
   });

   // obj2Proxy.name
   // obj2RunProxy(1)
   ```

   注意点：这里的 `Reflect.apply` 其实很有用。

   比如：`Function.prototype.apply(targetFunc, ctx, argArray)` 是无法使用的。

   但是 `Reflect.apply(targetFunc, ctx, argArray)`却可以使用。

   这里我猜测是因为原生的 `apply`底层可能是需要判断 `this`，也就是判断调用者的类型是不是函数。

   因此 `Function.prototype.apply` 用不了，因为此时的调用者是 `Function.prototype` 它的类型是一个对象，而 `Reflect.apply` 缺绕开了这个限制，它的底层应该是有重写。

## 总结

1. 我们用 `Reflect` 时，可以将其类比为 `Object` 来用，只要是 `Object` 上面的关于语言内部的一些行为的方法，`Reflect` 上面基本都有对应的方法（虽然有的方法行为和命名可能不同，比如 `Reflect.ownKeys({}), Object.keys({})`）。

   关于这两者的区别详情请看：[遍历对象属性常用方法][traverseObjectProperty]；

2. 同时，要记得 [Proxy][proxy] 的 `handler` 对象上可以定义拦截的方法，`Reflect` 上也都有对应的方法，入参也相同，因此可以用 `Reflect`来完成 [Proxy][proxy] 中`handler`中的一些默认行为；

参考：https://es6.ruanyifeng.com/#docs/reflect
