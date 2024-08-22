---
title: 常用 Object Api
---

# 常用 Object Api

## Object.preventExtensions

> `preventExtensions` 仅阻止添加自身的属性。

1. 禁止扩展对象，给对象添加属性（如果采用`obj.age= '123'`的方式新增属性，虽然不会报错，但也不会生效），如果采用`Object.defineProperty(obj, 'name', { value: 123 })`的方式新增一个属性就会抛出异常`TypeError`；
2. 对对象的原型是可以进行任何操作的（将该对象的原型指向另外一个对象这种操作除外）。`obj.__proto__ = {}`, 如果进行这个操作也会抛出异常`TypeError`；
3. 可以对属性进行删除，`delete obj.name === true`；
4. `Object.isExtensible(obj)`可以判断一个对象是否是可扩展的，常规方式新建的对象是可扩展的，比如：`let obj = {},  Object.isExtensible(obj) === true`；

```js
let obj = { name: "xzq" };

// 判断一个对象是否可扩展, 默认初始的一个对象新建的时候是可以扩展的
// Object.isExtensible(obj)
console.log("Object.isExtensible(obj): ", Object.isExtensible(obj)); // true

// 禁止 obj 进行扩展, 添加新属性, 但是可以改变原有属性的值或者配置
// 可以对 obj 的原型上添加新属性, 但是不能 obj.__proto__ = {}, 也就是不能将其原型对象指向另外一个对象
Object.preventExtensions(obj);

// 禁用扩展之后就为 false
console.log("Object.isExtensible(obj): ", Object.isExtensible(obj)); // false

obj.name = "xzqq"; // success

delete obj.name; // 可以删除值

obj.age = 18; // 采用这种方式添加值不报错, 但是也不会生效  obj: { name: 'xzq' }

// 采用 Object.defineProperty 来新增一个不存在的属性会报错
// TypeError: Cannot define property age, object is not extensible
// Object.defineProperty(obj, 'age', { value: 18 })

let objProto = obj.__proto__;
// 对原型的操作都是可以的, 除了将该对象的原型指向另外的对象
objProto.run = () => {
  console.log("奔跑");
};
objProto.name = "123";
objProto.name = "333";
Object.defineProperty(objProto, "age", { value: 18, enumerable: true });
console.log("objProto: ", objProto);

// 一个不可扩展的对象它的原型对象如果指向一个新的对象就会报错
// TypeError: #Object is not extensible
// obj.__proto__ = {}
```

## Object.seal

> `Object.seal()` 就是在 `Object.preventExtensions()` 的基础上，对该对象自身的所有属性遍历设置其 `configurable: false`， 也就是禁止配置该对象的属性。

1. 禁止扩展对象，且禁止配置一个对象的属性；

2. 对原有对象的属性的值进行修改是可以的， `Object.defineProperty(obj, 'name', { value: 333 }) `或者 `obj.name=333`都可以；

3. 禁止`delete`一个对象的属性，`delete obj.name === false`；

4. 需要注意的是，一个`configurable`为`false`的属性， 其他配置属性都不可修改，但是可以`Object.defineProperty(obj, 'name', { value: 333 })`可以通过这种方式修改`value`，并且能够将`writable`由`true`变为`false`，但是不能由`false`变为`true`；

5. MDN描述如下，当`configurable`为`false`时一个属性的行为；

   ![image-20210815211014921](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210815211014921.png)

```js
let obj = { name: "xzq" };

// 在 Object.preventExtensions(obj) 的基础上, 禁止去配置该对象的属性, 也就是不能用 Object.defineProperty(obj, 'name', {})
// 去配置该对象的属性, 也就是将 Object.defineProperty(obj1, 'name', { configurable: false }), 将 configurable 设置为 false 了

// 但是要记得的事, 并不影响原本属性值的修改
// 判断一个属性是否被 Object.seal()
// console.log('Object.isSealed(obj): ', Object.isSealed(obj));  true
// console.log('Object.isExtensible(obj): ', Object.isExtensible(obj))  // true
Object.seal(obj);
// Object.isExtensible(obj)
// console.log('Object.isSealed(obj): ', Object.isSealed(obj));  false
// console.log('Object.isExtensible(obj): ', Object.isExtensible(obj))  // false

obj.name = "123";

delete obj.name; // false 不允许删除

// 可以覆写该值
Object.defineProperty(obj, "name", { value: 333 });

// 默认情况 writable: true

// 可以由 false 变为 true, 不能由 true 变为 false
// success
Object.defineProperty(obj, "name", { writable: false });
// TypeError: Cannot redefine property: name
Object.defineProperty(obj, "name", { writable: true });

// Object.defineProperty(obj, 'name', { value: 555, writable: false })
console.log("obj: ", obj);

// 虽然不报错, 但是不生效 obj: { name: 333 }
obj.age = 18;
// Error, 该对象是禁止扩展的
// Object.defineProperty(obj, 'age', { value: 18 })

// 不影响对原型对象的新增, 修改, 删除等
obj.__proto__.name = "123";
obj.__proto__.name = "333";
obj.__proto__.age = "456";
delete obj.__proto__.name;

// 同样不允许原型对象指向新的对象
// obj.__proto__ = {}
```

## Object.freeze

> 在 `Object.preventExtensions` 的基础上对该对象自身的所有属性遍历设置其 `writable: false，configurable: false`， 也就是禁止对该属性禁止赋值操作，并且禁止配置。

1. 禁止扩展一个对象，也就是不能新建属性；
2. 禁止将已存在属性更改值，`obj: { name: '123' }; obj.name = '234'`；
3. 禁止配置一个属性，`Object.defineProperty(obj, 'name', {...})`；
4. 禁止删除一个属性，`delete obj.name`；
5. 同样不影响对原型的操作，当然还是不允许将原型指向一个新的对象；
6. 这里的冻结只是浅层次的冻结，`obj: { school: {} }; obj.school.name = 'aaa'`，这个操作是可以的，如果属性值是一个对象，而我们的更改不会影响这个对象的引用关系即可；
7. 冻结之后：`Object.isExtensible(obj) === fasle; Object.isSealed(obj) === true; Object.isFrozen(obj) === true  `；

```js
let obj = { name: "xzq", school: {} };

console.log("Object.isExtensible(obj): ", Object.isExtensible(obj)); // true
console.log("Object.isSealed(obj): ", Object.isSealed(obj)); // false
console.log("Object.isFrozen(obj): ", Object.isFrozen(obj)); // false

// 禁止该对象扩展，配置，更改值, 当然, 并不影响对其原型的操作, 除了将其原型指向新的对象
// descriptors: { writable: false, configurable: false }
// isExtensible(obj): false
Object.freeze(obj);

console.log("Object.isExtensible(obj): ", Object.isExtensible(obj)); // false
console.log("Object.isSealed(obj): ", Object.isSealed(obj)); // true
console.log("Object.isFrozen(obj): ", Object.isFrozen(obj)); // true

// 这里我们知道其 configurable 为 false, 本来是可以设置 value 和将 writable 由 false 变为 true 的, 但是现在这里的 writable 也为 false
// 所以不能改变 writable, 也不能设置 value 了

// TypeError: Cannot redefine property: name
// Object.defineProperty(obj, 'name', { writable: true })

// 非严格模式下不会报错, 但是也不会有产生影响  obj: { name: 'xzq' }
obj.name = "123";

// 新增属性

// 非严格模式下不会报错, 但是也不会有产生影响  obj: { name: 'xzq' }
obj.age = 18;

// TypeError: Cannot define property age, object is not extensible
// Object.defineProperty(obj, 'age', { value: 18 })

// 不会生效, 也就是不能删除已存在属性
delete obj.name;

// 要记住这里的冻结也只是浅层的冻结, 比如
obj.school.level = "小学";
// 这里不会报错的原因就是这个对象并没有改变, 引用的地方没有改变

// 如果要进行深层冻结, 可以递归遍历 deepFreeze

// 不影响对原型的操作
// obj.__proto__.name = 'haha'
// obj.__proto__.name = '123'
// delete obj.__proto__.name

// 除了将原型指向新的对象
// obj.__proto__ = {}

console.log(obj);
```

## preventExtensible, seal, freeze 总结

这里我们可以发现`Object.preventExtensible(); Object.seal(); Object.freeze()`的关系是层层递进的：

1. `Object.preventExtensible()`禁止对象扩展，不影响对原型的操作，除了将原型指向新的对象；
2. `Object.seal()`在`Object.preventExtensible()`的基础上，将该对象的属性的配置项（描述符）：`{ configurable: false }`设置为false，也就是禁止配置该属性；
3. `Object.freeze()`在`Object.preventExtensible()`的基础上，将该对象将该对象的属性的配置项（描述符）：`{ configurable: false; writable: false }`，也就是禁止配置该属性，也禁止改写这个对象的属性的值；
4. 上面的操作都不影响对其原型的更改，除了将原型指向一个新的引用`obj.__proto__ = {}`；

补充：

1. 通过`let obj = {}; Object.defineProperty(obj, 'age', { value: 18 })`配置一个属性的话，如果没有显示指定对象描述符的话，那么类似于`{ configurable: false, writable: false, enumerable: false }`这些`boolean`类型的描述符都是`false`，也就是禁止配置更改和枚举；
2. 如果通过`let obj = {}; obj.age= 18`， 那么他的描述符是 `{ configurable: true, writable: true, enumerable: true}`这些`boolean`类型的描述符都是`true`，也就是可以配置更改和枚举；
3. 存取描述符`{ get(){}, set(){} }`和数据描述符中的`{ writable: boolean, value: xxx }`是互斥了，这两组同时只能存在一组；
4. 关于`enumerable: boolean`，代表一个属性是否可以枚举，也就是是否可以被`for...in; Object.keys()`等常规方式遍历出来；

## Object.defineProperty

### 描述符默认值

- 拥有布尔值的键 `configurable`、`enumerable` 和 `writable` 的默认值都是 `false`；
- 属性值和函数的键 `value`、`get` 和 `set` 字段的默认值为 `undefined`；

### 描述符的类别

- 存取描述符：`get, set`；

- 数据描述符： `value, writable, enumerable, writable `；

其中 `get, set` 和 `value, writable` 不能同时存在。

### 注意点

当设置 `configurable` 为 `false` 的注意点：

![image-20210815211014921](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/image-20210815211014921.png)

由该图总结一下，当 `configurable: false` 时：

1. 不能再接着用 `Object.defineProperty`对其描述符进行变化性配置，也就是说如果和原来的配置相同，则没问题；
2. 有一个特殊的就是可以单向将 `writable` 改为 `false`，比如: `writable: true --> false`，反过来则不可以；

当 `writable: false`时：

1. 对值的改变不会生效，但是也不会报错；

参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
