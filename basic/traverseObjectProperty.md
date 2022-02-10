# 遍历对象属性常用方法

> 一般来说，方法都是不可枚举的，通过常规遍历方式是获取不到的。

## 遍历可枚举的属性

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性（不含 `Symbol` 属性）；
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名（不含 `Symbol` 属性）；
- `JSON.stringify()`：只串行化对象自身的可枚举的属性（不含 `Symbol` 属性）；
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性（含 `Symbol` 属性）；

## 遍历不可枚举的属性

+ `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 `Symbol` 属性，但是包括不可枚举属性）的键名；
+ `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 `Symbol`或字符串，也不管是否可枚举；

## 遍历包含继承的属性

+ `for...in`循环：只遍历对象自身的和继承的可枚举的属性（不含 `Symbol` 属性）。

  `Reflect.has(), xxx in obj`其实原理和上面一样，都能获得到自身的和继承的可枚举的属性；

## 只遍历自己的属性

- `Object.keys()`：返回对象自身的所有可枚举的属性的键名（不含 `Symbol` 属性）；
- `JSON.stringify()`：只串行化对象自身的可枚举的属性（不含 `Symbol` 属性）；
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性（含 `Symbol` 属性）；
- `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 `Symbol` 或字符串，也不管是否可枚举；
- `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 `Symbol` 属性，但是包括不可枚举属性）的键名；

## 遍历属性名为Symbol类型的属性

+ `Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 `Symbol` 属性的键名；
+ `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 `Symbol` 或字符串，也不管是否可枚举；

## 总结

+ 只有 `for...in, Reflect.has(), xxx in obj`等方式能够获取到自身的和继承的可枚举的属性；

+ `Reflect.ownKeys`遍历的最为彻底，它能获取到该对象自身（不包含继承）的所有属性，不管键名是 `Symbol` 或字符串，也不管是否可枚举。

  但是这样会导致获取到方法或者其他隐藏属性，所以不太好用；

+ 因此我们比较好用的一般就是`Object.keys()`，返回对象自身的所有可枚举的属性的键名；