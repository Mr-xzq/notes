---
title: 深入 Vue 响应式原理和简单实现
---

[mini vue]: https://github.com/cuixiaorui/mini-vue
[Vue Mastery]: https://www.bilibili.com/video/BV1rC4y187Vw?from=search&seid=4575081152272899376
[Vue3 响应式原理]: https://v3.cn.vuejs.org/guide/reactivity.html#%E4%BB%80%E4%B9%88%E6%98%AF%E5%93%8D%E5%BA%94%E6%80%A7
[ES6 Proxy]: https://es6.ruanyifeng.com/#docs/proxy
[ES6 Set and Map]: https://es6.ruanyifeng.com/#docs/set-map
[Difference between Map and WeakMap]: https://mp.weixin.qq.com/s/zji3NeHr-7ah6gIWDt5Ryg
[Vue2 reactive source code]: https://github.com/vuejs/vue/tree/dev/src/core/observer
[Vue3 reactive source code]: https://github.com/vuejs/vue-next/tree/master/packages/reactivity/src
[Vue2 reactive limit]: https://v3.cn.vuejs.org/guide/change-detection.html#vue-2-%E4%B8%AD%E6%9B%B4%E6%94%B9%E6%A3%80%E6%B5%8B%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9

# 深入 Vue 响应式原理和简单实现

> `Vue` 最独特的特性之一，就是其非侵入性的响应性系统。

## 什么是响应性

首先以一个`Excel`表格作为示范：

![excel_响应式展示](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220106/20:20:44-excel_%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B1%95%E7%A4%BA.gif)

这里将`C1`单元格设置为一个函数：`SUM(A1, B1)`，这里代表的意思就是`C1`单元格的值是`A1, B1`两个单元格的数值的求和。

上图也能看到，当`A1, B1`单元格值发生变化时，`C1`单元格的值会自动发生变化，不需要我们手动去重新赋值。这里所展示的特性就可以看作是响应性。

在 `JS`中如果我们简单的模拟一下上述的求和行为：

```ts
let A1 = 1;
let B1 = 1;
let C1 = A1 + B1;
console.log("C1", C1); // 2

A1 += 2;
console.log("C1", C1); // 2
```

这里会发现`C1`的值并没有发生自动变化，只有在我们进行手动重新赋值时，`C1`才会发生变化：

```ts
A1 += 2;
// 在 A1 发生改变之后, 对 C1 进行手动重新赋值
C1 = A1 + B1;
console.log("C1", C1); // 4, 发生了变化
```

那么在 `JS` 中如何实现当 `A1, B1`发生变化时，`C1`能够自动发生变化的效果呢？

如果想要实现这个效果，我们会遇到如下几个问题：

1. `A1, B1`发生变化时，我们要知道都有哪些值要自动变化；
2. 如何去发生这个变化，这个变化的具体行为是什么，并且让这个行为是可以被重复触发的；
3. 在什么时机去触发这些变化；

对于第一个问题：将这个问题换一个角度来看，可以看作是`A1, B1`发生变化之后产生的副作用都有哪些？其实这里又会产生一些新的问题，我们该如何收集这些副作用呢，在什么时机去收集这些副作用呢？

对于第二个问题：在`JS`中如何去封装一个动作，行为。显然这里可以通过函数对这些变化所导致的行为进行封装。然后在其需要的地方进行重新调用即可。这里你是否也会发现，这些函数其实就是`A1, B1`变化之后产生的副作用。

对于第三个问题：在`A1, B1`发生变化的时候去重新触发这些行为。

然后我们对上述例子进行第一步改造：

```ts
let A1 = 1;
let B1 = 1;
let C1;
function effect1() {
  C1 = A1 + B1;
}
function effect2() {
  C1 = A1 * 2 + B1;
}

effect1();
effect2();

A1 += 2;

// 在 A1 或者 B1 发生变化时重新触发副作用
effect1();
effect2();

B1 += 2;
effect1();
effect2();
```

这一步改造只解决了上述的第二个问题，就是将具体行为封装为了函数，然后在 `A1, B1`发生变化的时候进行重新触发其副作用。

这里又会有几个问题：

1. 当会触发的副作用变多时不方便维护，因此这里我们需要一个地方去收集副作用；
2. 流程都是手动的，我们需要让收集副作用的流程和触发副作用的流程变成自动的；

## 分析问题

> 在后文中，副作用可以看作为依赖。
>
> 这里该怎么理解呢？
>
> 一个值变化之后会产生一系列的副作用，那我们是不是可以看作这些副作用其实是依赖于这个值的变化的呢？
>
> 因此该值的副作用其实可以看作该值的依赖。

为了方便后文描述，这里我们举一个更加贴切的例子：

```ts
let product = {
  price: 10,
  count: 0,
};

let totalPrice;
let salePrice;

function effect1() {
  totalPrice = product.price * product.count;
  console.log("totalPrice: ", totalPrice);
}
function effect2() {
  salePrice = product.price * 0.9 * product.count;
  console.log("salePrice: ", salePrice);
}

effect1();
effect2();

product.count += 2;

effect1();
effect2();

product.price += 5;

effect1();
effect2();
```

这里我们需要解决收集依赖和触发的问题。

这里我们引入一个`Dep`类，通过它来收集依赖和触发依赖：

```ts
// 依赖类，它负责收集依赖（副作用），触发依赖（副作用）
class Dep {
  // 一个值会产生多个副作用，防止重复的依赖被收集
  public deps: Set<Function>;

  constructor() {
    // 赋予一个初始值
    this.deps = new Set();
  }

  // 收集依赖（副作用）
  depend(effect: Function) {
    if (effect) {
      this.deps.add(effect);
    }
  }

  // 触发所有收集的依赖（副作用）
  notify() {
    this.deps.forEach((effect) => effect());
  }
}
```

然后就可以将我们的例子变为：

```ts
let product = {
  price: 10,
  count: 0,
};
let totalPrice;
let salePrice;

function effect1() {
  totalPrice = product.price * product.count;
  console.log("totalPrice: ", totalPrice);
}
function effect2() {
  salePrice = product.price * 0.9 * product.count;
  console.log("salePrice: ", salePrice);
}

// 声明一个 dep 实例用来收集依赖和触发依赖
let dep = new Dep();

// 收集依赖
dep.depend(effect1);
dep.depend(effect2);

// 触发依赖
dep.notify();

product.count += 2;

dep.notify();

product.price += 5;

dep.notify();
```

到目前为止，我们已经解决了收集依赖和触发依赖的问题，但是流程依旧不是自动化的，我们期望的效果是：

1. 当有函数依赖`product.count, product.price`时，只要这个函数被调用，就自动被收集为专属他们的副作用（依赖），这里可以拆分为两点：

   1. 为它们（可以看作对象的每个属性）找一个唯一存储它们各自副作用（依赖）的位置；
   2. 在它们被获取时，副作用自动被收集进入存储副作用（依赖）的位置；

2. 而在它们对应值发生变化时，能够自动触发所有收集的副作用（依赖）；

那么在`JS`中有没有一种方法能够监听到触发值的变更和获取某个属性的值呢？答案是有的：

1. 在`ES5`中是`Object.defineProperty`将对象的属性转化为`get, set`来对属性的存取行为拦截；
2. 在`ES5`中还有一个计算属性（属性存取器）也能完成这个效果（`get, set`）；
3. 在`ES6`中是通过`Proxy`直接为一个对象生成一个代理对象，我们通过这个代理对象访问原始对象的所有行为都会被拦截；

第一种方案就是`Vue2`响应式的实现原理，而第三种方案就是`Vue3`响应式的实现原理，接下来我们就这两种方案分别模拟实现一下`reactive api`。

## 实现响应性

> 接下来的实现都是以解析`Vue`的响应式原理为目的，因此都是抽取的最简实现，很多情况都没有考虑。如果想关注更多的细节，可以去研究源码。
>
> 1. [`Vue2`响应式源码][Vue2 reactive source code]；
> 2. [`Vue3`响应式源码][Vue3 reactive source code]；

### Vue2 响应性简单实现

#### 对对象的响应式转换处理

`reactive`实现：

```ts
function reactive(rawObj: object) {
  Object.keys(rawObj).forEach((rawKey) => {
    let originVal = rawObj[rawKey];

    // 该对象的每一个 rawKey 都有一个自己的闭包，该闭包上下文中存储的是 dep 和 originVal
    let dep = new Dep();

    Object.defineProperty(rawObj, rawKey, {
      get() {
        // 在获取值的时候收集依赖
        dep.depend();
        return originVal;
      },
      set(newVal) {
        // 在值发生变化的时候触发依赖
        if (newVal !== originVal) {
          // 记住先更新值，dep 的 deps 中存储的副作用访问的可能会是上一个值（旧值）
          originVal = newVal;
          dep.notify();
        }
      },
    });

    // 如果是对象，就进行嵌套转换
    if (isObject(originVal)) {
      reactive(originVal);
    }
  });
  return rawObj;
}
```

这里我们发现在调用`dep.depend()`时无法在和之前一样显式的将`effect`传入，因此这里我们可以将`effect`存到全局的上下文中，这样在不同的上下文中更方便的获取到`effect`。

这里引入一个`watchEffect`方法，它有两个作用：

1. 将 `effect` 放到外部，方便在触发响应式数据的 `get` 时收集到依赖；
2. 防止不期望的 `effect` 被收集，比如我们在 `console.log(product.price)` 时也会触发到响应式数据的 `get`。这样就能够只有被 `watchEffect` 探测的 `effect` 才会被收集，这个流程就可控了；

```ts
let activeEffect;
function watchEffect(effect: Function) {
  // 将 effect 放到外部
  activeEffect = effect;
  // 这里先立刻触发一次，这样就能够触发响应式数据的 get 来收集依赖
  effect();
  activeEffect = null;
}
```

然后 `Dep`类中的`depend`方法也应该改一下：

```ts
  depend() {
    // 增加一个判断, 防止不期望的 effect 被收集
    if(activeEffect) {
      this.deps.add(activeEffect)
    }
  }
```

最终这个例子可以变成：

```ts
let product = reactive({
  price: 10,
  count: 0,
});
let totalPrice;
let salePrice;

function effect1() {
  totalPrice = product.price * product.count;
  console.log("totalPrice: ", totalPrice);
}

// 通过先触发一次响应式数据的 get, 来让 effect1 作为依赖被收集
watchEffect(effect1);
// totalPrice:  0

function effect2() {
  salePrice = product.price * 0.9 * product.count;
  console.log("salePrice: ", salePrice);
}

// 通过先触发一次响应式数据的 get, 来让 effect2 作为依赖被收集
watchEffect(effect2);
// salePrice:  0

// product.price 有两个副作用(依赖), 分别是 effect1 和 effect2
product.price += 5;
// totalPrice:  0
// salePrice:  0

// product.count 有两个副作用(依赖), 分别是 effect1 和 effect2
product.count += 5;
// totalPrice:  75
// salePrice:  67.5
```

#### 对数组的响应式转换处理

这里采用的方式不是将数组每个属性转换为`get, set`，而是将需要转化的数组的方法进行重写，这些方法是那些会改变自身的方法（不改变引用）。

分别有：`'push', 'pop', 'unshift', 'shift', 'splice', 'reverse', 'sort'`。

`interceptArr`方法主要做了四件事：

1. 新建一个继承自`Array.prototype`的对象；

2. 重写数组的`'push', 'pop', 'unshift', 'shift', 'splice', 'reverse', 'sort'`的方法，在保证原有实现的同时，扩展了其实现：

   1. 对新增的值进行响应式转换；

   2. 并且在调用这些方法时，会触发`dep.notify`去触发所有副作用（依赖）；

3. 然后将这些方法放到我们新建的对象上来覆盖它原生继承自`Array.prototype`上的方法；

4. 将这个新建的对象作为原型，来替换被转换的数组的原型；

```ts
// 封装一下 Object.defineProperty, 默认定义的就是不可枚举的属性
// 可以用它来定义私有属性 _xxx, 或者定义方法, 这两者一般不可枚举
function def(
  obj: object,
  key: string | symbol,
  value,
  enumerable: boolean = false,
) {
  Object.defineProperty(obj, key, {
    enumerable: enumerable,
    value: value,
  });
}

function interceptArr(arr) {
  const dep: Dep = arr._dep;
  // 拦截改变原数组的方法
  const targetMethods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice",
    "reverse",
    "sort",
  ];
  // 创建一个基于 Array.prototype 的对象，将这个对象作为我们要替换的原型
  const arrPrototype = Object.create(Array.prototype);
  targetMethods.forEach((methodName) => {
    const orgMethod = Array.prototype[methodName];
    // 对 orgMethod 进行重写得到 replaceMethod
    const replaceMethod = function (...args) {
      const orgRes = orgMethod.apply(arr, args);
      let inserted;
      switch (methodName) {
        case "push":
        case "unshift":
          inserted = args.slice(0);
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      // 对新增的值也进行响应式转换
      if (inserted) {
        reactiveArr(inserted);
      }
      // 通知依赖
      dep.notify();
      console.log("拦截的方法" + methodName);
      // 返回原来的结果
      return orgRes;
    };
    // 将重写好的方法添加到我们构造的原型上

    // 方法默认是不允许枚举的
    // 如果不是为了定义这个 enumerable, 我们这里可以直接 arrPrototype[methodName] = function() {}
    def(arrPrototype, methodName, replaceMethod);
  });

  // 替换原型
  Object.setPrototypeOf(arr, arrPrototype);
}
```

然后定义一个`reactiveArr`方法：

```ts
function reactiveArr(rawArr: any[]) {
  // 重写 rawArr 的从 Array.prototype 的方法(建议别采用污染原型链的方式)
  // 重写其方法
  interceptArr(rawArr);
  // 其实这里和对象的操作差不多，Object.keys(xxx)
  // 遍历每个元素，如果发现有对象或者数组，则对其进行嵌套转换
  rawArr.forEach((ele) => reactive(ele));
}
```

其实经过上面的实现你会发现，对数组采用的是这种`hack`的方法进行的伪响应式转换，它并没有将数组的每个元素都转换成`get, set`，这也就是为什么你直接通过`arr[index] = 'xx'`进行赋值时不会触发副作用了。

最终得到一个简单的优化过后的`reactive`方法：

```ts
function reactive<T extends object>(rawObj: T): T {
  Object.keys(rawObj).forEach((rawKey) => {
    let originVal = rawObj[rawKey];

    // 该对象的每一个 rawKey 都有一个自己的闭包，该闭包上下文中存储的是 dep 和 originVal
    let dep = new Dep();

    Object.defineProperty(rawObj, rawKey, {
      get() {
        // 在获取值的时候收集依赖
        dep.depend();
        return originVal;
      },
      set(newVal) {
        // 在值发生变化的时候触发依赖
        if (newVal !== originVal) {
          // 记住先更新值，dep 的 deps 中存储的副作用访问的可能会是上一个值（旧值）
          originVal = newVal;
          dep.notify();
        }
      },
    });

    // 如果不是引用值类型
    if (!isObject(originVal)) return;

    // 方便别的地方可以获取到这个 _dep（比如 拦截数组的操作需要通过 _dep 来进行 notify），进行收集依赖或者触发依赖
    // 不然只有通过传参的方式来让别的地方获取这个 _dep，太过繁琐
    if (!originVal._dep || !(originVal._dep instanceof Dep)) {
      // 让这个私有属性无法枚举, 不然会出现很多边界情况
      // 比如会将其当作常规属性进行响应式处理从而出现无限递归
      // originVal._dep = dep
      def(originVal, "_dep", dep);
    }
    // 嵌套转换
    if (Array.isArray(originVal)) {
      reactiveArr(originVal);
    } else {
      reactive(originVal);
    }
  });
  return rawObj;
}
```

这里有个细节需要注意，那就是我们需要在`interceptArr`方法中去触发或者收集依赖的话就需要获取到专属于这个属性的`dep`对象，因此我们在`reactive`增加了一步将 `dep`实例作为嵌套对象或者数组的`_dep`属性，这样就让`interceptArr`方法可以获取到`dep`实例了。

然后执行这个例子：

```ts
let obj = reactive({
  arr: [],
});
watchEffect(() => {
  let arr = obj.arr;
  console.log("arr", arr[0], arr[1], arr[2]);
});
// 对于新增的属性是无法监听到它的变化的
obj.arr[0] = "xxx";
// push pop 进行了重写，因此可以监听到这两个方法
obj.arr.push(1);
obj.arr.pop();
```

#### reactive 总结

- 优点：

  1. 闭包中天生自带一个对于当前属性来说独一无二的上下文来存储每个属性的`dep`，不需要我们额外去设计；
  2. 采用`ES5`中的`Object.defineProperty API`，兼容性较好；

- 缺点：

  1. 闭包产生的内存泄漏，会在响应式数据的数量变多时，产生过多的内存消耗和性能影响；

  2. 需要显式的为所有的属性进行转换，正是这个特性导致如果后续我们新增属性或者删除属性，不止是新增和删除行为我们监听不到，而且对于新增的属性来说，它也不再是响应式的；

     ```ts
     let product = {
       price: 0,
     };
     // 由于原先并没有一个被转化为响应式属性的 newField1 存在, 因此也就无法触发它的 get, set。从而能够让这个 effect3 被收集，或者在赋值时被触发
     function effect3() {
       console.log("newField1", (product as any).newField1);
     }
     watchEffect(effect3);

     // 这里并不会有输出
     (product as any).newField1 = "new Field1";
     delete (product as any).newField1;

     // delete 更为特殊, 即使当前属性已经被转换为了响应式属性，但是由于 delete 不会触发 set, 因此也就无法触发副作用的重新运行
     watchEffect(() => console.log("price", product.price));
     delete product.price;
     ```

     然后我们知道，数组本身就可以看作一个属性增减比较频繁的对象，也正是因此，这里的常规的转换方案无法对其进行使用。我们需要额外对其进行一些`hack`实现，但是即使如此，也依旧有无法覆盖到的情况。

     [参考`Vue2`响应式转换的限制][Vue2 reactive limit]。

  3. 转换模式是：`eager-transform`，在第一次转换时就需要将所有的属性都遍历到，无论这个对象有多大，嵌套层级有多深；

### Vue3 响应性简单实现

#### 对对象或者数组的响应式转换处理

> 无论是对象（`Plain Object`）还是数组都使用的是 `Proxy`进行的转换处理。

因为这里我们不再是遍历对象 `key` 的方式来转换`get, set`来实现响应式，因此无法通过闭包为每个对象的 `key` 简历自己存放依赖的地方。

那么如何将其存放到一个合适的地方呢？

目前我们知道，收集依赖的地方是在属性的 `get` 中，而在 `proxyHandler` 的 `get` 中的能够获取的信息是该对象本身，和访问的当前 `key`。

那么能不能通过这两个信息来作为 `map` 的键，来为每一个响应式对象的每个属性都找到一个唯一的存放依赖的地方，然后将其依赖存放其中呢？

答案是这可以的，首先这里最外层我们利用 `weakMap`，原因是 `weakMap` 的 `key` 只能是 `object` 类型，并且他有一个`Map`所不具备的特性，`weakMap`是弱引用键值对类型，也就是说如果它的键（`object`）如果不再有别的人引用的话，那么该 `weakMap` 的这对键值对都会被垃圾回收，这样可以最大程度上的节省空间。
而 `Map` 却不会，`Map`是强引用键值类型，如果将一个对象作为`Map`的键，即使这个对象在外界已经没有人引用了，`Map`依旧会持有这个键值对。

这里我们内层用`Map`，也就是将`Map`作为`weakMap`的值，`Map`中的键是一个响应式对象的属性名，而它的值就是对应的存放它的副作用（依赖）的位置。

关于`WeakMap`和`Map`具体可以参考：[浅析 `Map` 和 `WeakMap` 区别以及使用场景][Difference between Map and WeakMap]。

![proxyMap 示意图](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220106/20:21:06-proxyMap%20%E7%A4%BA%E6%84%8F%E5%9B%BE.jpg)

收集依赖：

```ts
// 收集依赖
// 根据 target 和 key 找到一个一一对应存储依赖（副作用）的位置
// function depend() {}
function track(target: object, key: string | symbol) {
  if (activeEffect) {
    // 分别将 target 和 key 作为键值嵌套存储依赖
    let depsMap: Map<string | symbol, Set<Function>> = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let deps: Set<Function> = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect);
  }
}
```

触发依赖：

```ts
// 触发依赖
// function notify() {}
function trigger(target: object, key: string | symbol) {
  // 寻找存放依赖的位置
  const depsMap: Map<string | symbol, Set<Function>> = targetMap.get(target);
  if (!depsMap) return;
  const deps: Set<Function> = depsMap.get(key);
  if (!deps) return;
  deps.forEach((effect) => effect());
}
```

`reactive`简单实现：

```ts
let targetMap = new WeakMap();

let activeEffect;

// 函数重载
// 让类型在重载上，我们真正的实现只用关心实现即可
function reactive<T extends object>(raw: T): T;
function reactive(raw) {
  const proxyHandler: ProxyHandler<object> = {
    // 在 get 中进行按需转换(针对嵌套对象)
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);
      // 针对嵌套对象，当只有在获取该值时才对其进行响应式转换
      // lazy-transform
      if (isObject(result)) {
        result = reactive(result);
      }
      track(target, key);
      return result;
    },
    set(target, key, newVal, receiver) {
      const originValue = target[key];
      const result = Reflect.set(target, key, newVal, receiver);
      if (originValue !== newVal) {
        trigger(target, key);
      }
      return result;
    },
    // delete 操作不会触发 set, 而会触发这里的 deleteProperty, 因此单独对 delete 操作进行处理
    deleteProperty(target, key) {
      // 先获取原始值
      const originVal = target[key];
      // 然后执行默认行为
      const res = Reflect.deleteProperty(target, key);
      // 如果删除的属性存在
      if (!isEmpty(originVal)) {
        trigger(target, key);
      }
      return res;
    },
  };

  return new Proxy(raw, proxyHandler);
}
```

使用测试：

```ts
const product = reactive({
  name: {
    first: "first",
    last: "last",
  },
});

let productFullName;
watchEffect(() => {
  productFullName = product.name.first + product.name.last;
  console.log("productFullName: ", productFullName);
});
// productFullName:  firstlast

// 嵌套对象的属性的变更也会触发 set
product.name.first = "firstxxx";
// productFullName

product.name = {
  first: "xx",
  last: "xxx",
};
// productFullName:  xxxxx

watchEffect(() => {
  console.log("count", product.count);
  // 即使原先对象上没有 foo 属性，但是由于这里我们是对对象行为层面的代理(而不是针对已知的 key),因此依旧会触发 get set
  console.log("foo", (product as any).foo);
});
// 删除属性，虽说不会触发 set, 但是 Proxy 是可以对对象的 delete 行为进行拦截的, 还有 ownKey ... 行为，只要在 proxyHandler 进行定义 deleteProperty 即可
delete product.count;
// 新增属性，触发了 set
(product as any).foo = "xxx";
```

#### reactive 总结

- 优点：

  1. `lazy(demand)-transform`，在`get`中进行嵌套转换，也就是说对于嵌套对象如果你不获取的话，是不会为其生成代理对象的；

  2. `get, set`的拦截层面是在对象级别，我们访问的其实是代理对象，然后代理对象通过`Reflect.xxx`来访问原始对象。也正是因为这样，不管该对象有多少属性，或者后面会不会有新增属性，只要我们访问的是代理对象，那么该行为都可以被拦截到；

     不需要对数组进行额外处理，因为数组也是一种对象，比如`push`方法它内部会对这个对象新增属性，该行为是会被拦截到的，只要你访问的是代理对象；

  3. `Proxy`目前一共支持`13`种拦截行为，包括`get, set, deleteProperty, has...`等，因此`Vue3`的响应式能够对这些行为进行响应式的支持；

- 缺点：

  1. 兼容性不太好，`IE`浏览并未对其实现，并且由于 `ES5` 的限制，`ES6` 新增的 `Proxy` 无法被转译成`ES5`，或者通过`Polyfill`提供兼容；

#### ref 简单实现

根据之前的响应式原理我们知道，核心都是解决三个问题：

1. 为每一个需要转化的数据找一个唯一的地方存储它的副作用（依赖）；
2. 在获取值时收集副作用（依赖）；
3. 在更新值时触发副作用（依赖）；

不管怎么做都绕不开一个行为，那就是需要拦截值的 `get, set`。

拦截值目前有三种方案：

1. `ES5`的`Object.defineProperty`；
2. `ES5`的计算属性（属性读写器）；
3. `ES6`的`Proxy`来生成代理对象；

无论是通过哪一种转换方案，都是需要依赖目标是一个对象，因此这里会发现如果要将一个原始类型的值转换为响应式，那就需要为其包裹一个对象。

而这里的`ref`采用的是上述第二种方案：`ES5` 的计算属性（属性读写器）：

```ts
// 在实际使用中你会发现它的参数可以是对象, 也可以是原始类型的值
// 内部会区分处理
function ref(val) {
  // 如果参数是一个引用值类型, 在内部直接用 reactive 处理, 并返回它的代理对象
  if (isObject(val)) {
    return reactive(val);
  } else {
    // 这里虽说也可以通过 reactive 来实现, 但是显然没必要，因为在实际处理中，reactive 做了很多其他的处理，在这里显然没必要
    // const wrapper = reactive({
    //   value: val
    // })
    // return wrapper

    const wrapper = {
      get value() {
        // 收集副作用（依赖）
        track(wrapper, "value");
        return val;
      },
      set value(newVal) {
        if (newVal !== val) {
          // 记得在值更新之后在触发副作用（依赖），这样能确保副作用拿到的是最新的值
          val = newVal;
          trigger(wrapper, "value");
        }
      },
    };
    return wrapper;
  }
}
```

测试案例：

```ts
let count = ref(0);

watchEffect(() => {
  console.log("count", count.value);
});

let price = ref(5);

watchEffect(() => {
  console.log("price", price.value);
});
```

#### computed 简单实现

实际使用中：

```ts
let count = ref(0);
let price = ref(5);

let getter = () => count.value * price.value;
let totalPrice = computed(getter);

watchEffect(() => {
  console.log("totalPrice", totalPrice.value);
});

count.value += 5;
price.value += 5;
```

这里我们期望的效果是：

1. `count.value`或者`price.value`发生变化时，`totalPrice.value`能够自动发生变化；
2. `totalPrice.value`发生变化时，能够触发`() => console.log(xxx)`这个副作用；

那么这里有两个问题需要解决：

1. 如何让`totalPrice.value`能够收集副作用（依赖）和触发副作用（依赖）；
2. 如何在`getter` 中的值发生变化的时候，让 `totalPrice.value` 自动发生变化；

```ts
function computed(getter: Function) {
  let originVal = getter();

  // 解决第一个问题:

  // 先通过 ref 获取一个响应式的对象, 使其能够收集和触发副作用(依赖)
  const refOriginVal = ref(originVal);

  // 解决第二个问题:

  // 将 getter 包装一下, 将 wrapGetter 作为 refOriginVal 的副作用被收集, 这样每次触发副作用时, 都会重新给 refOriginVal.value 赋值
  const wrapGetter = () => {
    refOriginVal.value = getter();
  };

  // 将 wrapGetter 变为副作用(activeEffect)
  watchEffect(wrapGetter);

  return refOriginVal;
}
```

## 响应性实现总结

这里会发现，不管是`Vue2`，还是`Vue3`，它们的响应式核心就是解决三个问题：

1. 如何去为每个响应式的数据找一个唯一的地方去收集副作用（依赖）；
2. 何时和如何收集所有副作用（依赖）；
3. 何时和如何去触发所有副作用（依赖）；

然后解决方案就是：

`Vue2`:

1. 在遍历对象 `key` 并通过 `Object.defineProperty`将其转换为 `get, set`的过程中产生的闭包上下文中的`dep`实例中存储依赖；
2. `get`中收集依赖；
3. `set`中触发依赖；

`Vue3`:

1. 分别将对象本身和对象的属性作为`key`，通过`WeakMap`和`Map`来定义一个唯一的地方存储副作用（依赖）；
2. `get`中收集依赖；
3. `set`中触发依赖；

只不过它们两个实现转化`get, set`的方式不一样，`Vue2`中用的是`es5`中的`Object.defineProperty`，而`Vue3`中用的是`es6`的`Proxy`。

这两种转换方案的不同使得它们有很多差异：

`Vue2`：

1. `eager-transform`，在第一次转换时就需要将所有的属性都遍历到，无论这个对象有多大，嵌套层级有多深；

2. `get, set`的拦截层面是在属性级别，需要显式的用`Object.defineProperty`将每个属性转换，对于未转换的就无能为力了，这也是为什么它对新增属性无法做到监听的原因；

   因此还需要对数组进行额外的`hack`处理（重写`push, pop, slice, splice...`等方法）；

3. 由于`Object.defineProperty`的限制，它只能对`get, set`行为进行拦截，无法对`delete`或者其他行为进行拦截；

4. `Object.defineProperty`的兼容性比较好；

   ![defineProperty 兼容性](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220106/20:21:16-defineProperty%20%E5%85%BC%E5%AE%B9%E6%80%A7.jpg)

`Vue3`:

1. `lazy(demand)-transform`，在`get`中进行嵌套转换，也就是说对于嵌套对象如果你不获取的话，是不会为其生成代理对象的；

2. `get, set`的拦截层面是在对象级别，我们访问的其实是代理对象，然后代理对象通过`Reflect.xxx`来访问原始对象。也正是因为这样，不管该对象有多少属性，或者后面会不会有新增属性，只要我们访问的是代理对象，那么该行为都可以被拦截到；

   不需要对数组进行额外处理，因为数组也是一种对象，比如`push`方法它内部会对这个对象新增属性，该行为是会被拦截到的，只要你访问的是代理对象；

3. `Proxy`目前一共支持`13`种拦截行为，包括`get, set, deleteProperty, has...`等，因此`Vue3`的响应式能够对这些行为进行响应式的支持；

4. 在一些浏览器，比如`IE`上兼容性不太好；

   ![Proxy 兼容性](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220106/20:21:18-Proxy%20%E5%85%BC%E5%AE%B9%E6%80%A7.jpg)

   并且由于 `ES5` 的限制，`ES6` 新增的 `Proxy` 无法被转译成`ES5`，或者通过`Polyfill`提供兼容；

​

## 参考链接

[mini vue]

[跟尤雨溪一起解读Vue3源码【中英字幕】- Vue Mastery][Vue Mastery]

[Vue3 响应式原理]

[ES6 Proxy]

[ES6 Set and Map]

[浅析 Map 和 WeakMap 区别以及使用场景][Difference between Map and WeakMap]
