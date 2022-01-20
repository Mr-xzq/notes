# 事件循环

## 为什么和是什么

### 为什么

首先我们知道，`JS`是单线程的，因为它最早是用来实现页面交互的，如果设计成多线程，那么在用户的操作过程中很可能会触发一些互斥操作（ 比如操作`DOM`造成渲染出错），而要处理这些边界情况，复杂度和易错程度将大大上升。

因此为了稳定和简化的目的，`JS`就被设计为了单线程。

那么随之而来，又遇见了一个问题，由于当前`JS`的是单线程的，那么执行就是按照执行栈的顺序逐步执行，那如果执行栈中的某一个步骤是耗时操作，或者直接就卡死了呢。

那就会导致整个`JS`的执行被卡住，并且`JS`执行所在的线程和`GUI`线程是互斥的，`JS`线程直接卡死了，但是它依旧会占据资源，也就导致了`GUI`线程被冻结而无法正常绘制界面。

为了解决上述的问题，这里就需要添加一层调度的逻辑，能够让`JS`执行异步操作并且能够去协调这些异步的任务，让其和同步任务能够很好的在一起执行，这种调度的逻辑从某种意义上来说就是事件循环。



### 是什么

有很多人不理解事件循环，就是因为搞不清楚事件循环本质是什么，它和`JS`的关系又是什么？

事件循环的本质是一个 `JS` 宿主环境协调各类事件的机制（一般来说，这些事件都是异步的），比如对于浏览器而言，就包括用户交互，脚本，渲染，网络等各类事件；但是对于`Node`而言，那主要就是协调`IO`，网络等各类事件。

也就是说事件循环并不是`JS`内部自己实现的，而是由它的宿主环境实现的，并且由于宿主环境各自的应用场景的不同，它们实现的事件循环也会略有差异。



## 浏览器的事件循环

### 事件循环执行流程

浏览器将`JS`中的执行的任务分为异步任务和同步任务，同步任务就会阻塞执行栈，异步任务一般不会阻塞执行栈，而是由渲染进程的其他线程处理，处理好之后再丢到队列中等待执行栈调用。

比如`xhr`直接交给异步网络请求线程处理，`setTimeout, setInterval`直接交给定时器线程处理等，等到这些耗时的任务有结果之后，事件处理线程会将这些任务的回调函数丢到一个队列中（事件队列）。

![JS执行流程](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:51:38-%E6%B5%8F%E8%A7%88%E5%99%A8-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F-01.png)

然后渲染主线程会维持一个无限循环，当`JS`执行栈为空时，这个循环就会去读取事件队列的首部（先进先出），将这个队列中的任务往执行栈中扔，当执行栈再次为空时，该循环开始读取下一个任务，无限往复。这就是事件循环。

![图片](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:51:47-%E6%B5%8F%E8%A7%88%E5%99%A8-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F-02.png)

![img](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:51:49-%E6%B5%8F%E8%A7%88%E5%99%A8-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F-03.png)

### 宏任务和微任务

但是这种还会有一些问题，目前任务队列中的任务是没有优先级之分的，所有被异步线程处理好之后的任务都被塞到任务队列中，等待执行栈的调用，无法进行额外的插队操作。

那如果我们有一些高优先级的任务要执行怎么办，比如类似 `MutationObserver`，它是用来监听`DOM`变化的`API`，一般这种`API`对实时性要求都特别高，如果我们还得耐心的等着任务队列中前面的任务执行完再执行这个，那可能会得到错误的结果。

因此浏览器对任务做出了划分，分别为宏任务和微任务；对队列也做出了划分，一个是宏任务队列，一个是微任务队列：

![图片](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:52:00-%E6%B5%8F%E8%A7%88%E5%99%A8-%E5%AE%8F%E4%BB%BB%E5%8A%A1%E5%92%8C%E5%BE%AE%E4%BB%BB%E5%8A%A1.png)

常见的宏任务：

1. `script` ，对于浏览器而言，`JS`脚本的执行就算一个宏任务，如果`HTML`中有多个脚本，那就算多个宏任务；
2. `setTimeout/setInterval`；
3. `setImmediate`(仅在`IE`的一些版本支持)；
4. `I/O`；
5. `UI Render`；
6. `postMessage`（可以结合`MessageChannel`）；

常见的微任务：

1. `Promise.then(catch, finally...)`；
2. `Object.observe`（已经废弃）；
3. `MutaionObserver`；

那这两个任务队列，浏览器又是如何调度执行的呢？

为了能够让微任务高优先级执行，执行情况如下：

1. 执行流程以宏任务开始，因为`JS`的执行对于浏览器来说就是宏任务，当开始的宏任务执行完之后（当调用栈为空时）开始执行步骤`2`；

2. 检测微任务队列是否为空，若不为空，则取出一个微任务入栈执行，然后再次执行当前步骤直到当前微任务队列为空；当微任务队列为空时，开始执行下一轮事件循环，执行步骤`3`；
3. 检测宏任务队列是否为空，若不为空，则取出一个宏任务入栈执行，宏任务执行完之后，当前执行栈为空了，然后执行步骤`2`；若宏任务队列为空同样也是执行步骤`2`；
4. `2`和`3`这两个步骤反复循环；

![微任务和宏任务执行流程](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:52:04-%E6%B5%8F%E8%A7%88%E5%99%A8-%E5%BE%AE%E4%BB%BB%E5%8A%A1%E5%92%8C%E5%AE%8F%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B-01.png)

举一个例子：

```html
<script>
console.log('1')

setTimeout(function callback() {
  console.log('2')
}, 1000)

new Promise((resolve, reject) => {
  console.log('3')
  resolve()
}).then(res => {
  console.log('4')
})

console.log('5')
// 1 3 5 4 2
</script>

```

执行顺序如下图：

![浏览器-微任务-宏任务执行流程样例图](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:52:12-%E6%B5%8F%E8%A7%88%E5%99%A8-%E5%BE%AE%E4%BB%BB%E5%8A%A1-%E5%AE%8F%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%E6%A0%B7%E4%BE%8B%E5%9B%BE.gif)

1. 首先最先将整个`script`中的`JS`脚本当作一个宏任务开始执行；

2. 然后开始执行这个宏任务中的同步代码；

3. 将`console.log('1')`推入执行栈中，输出`1`之后，然后弹出执行栈；

4. 将`setTimeout`推入执行栈中，然后`setTimeout`中的`callback`被扔给了浏览器渲染进程的定时器处理线程，`1000ms`之后定时器处理线程会将其放到事件队列中等待执行栈调用，然后`setTimeout`弹出栈；

5. 将`new Promise(xxx)`推入执行栈中，然后`(resolve, reject => { console.log('3'); resolve() })`推入执行栈，`then(xxx)`被扔给异步线程处理，等待当前`Promise` 状态发生改变，然后才会被放入微任务队列等待执行栈调用；

   然后`console.log(3)`推入执行栈，输出`3`，`console.log('3')`弹出栈，

   `resolve()`推入执行栈，`Promise`状态发生改变，然后`then`中的`console.log('4')`被扔到微任务队列中等待执行栈调用，`resolve()`弹出栈，`new Promise(xxx)`弹出栈；

6. 将`console.log('5')`推入执行栈中，输出`5`之后，然后弹出执行栈；

7. 此时这个宏任务中的同步代码就执行完了，也就是说执行栈为空了，此时要开始检查微任务队列中是否还有任务没，发现里面有一个`console.log('4')`，将其推入执行栈，输出`4`之后，弹出栈，此时再次检查微任务队列发现已经没了；

8. 然后开始下一轮事件循环，此时开始检查宏任务队列，这里有一个`1000ms`之后被放入宏任务队列中的任务，从`setTimeout`之后就开始计时（也就是步骤`4`那一刻），当其被推入宏任务队列后，如果此时刚好执行栈和微任务队列又都是空的，那么就开始执行`callback`函数，将`callback`推入执行栈，然后将`console.log('2')`推入执行栈，输出`2`之后，`console.log(2)`弹出栈，`callback`弹出栈；

9. 流程完毕；

## Node 的事件循环

### Node 和浏览器任务体系的差异

浏览器与 `Node` 的事件循环是存在差异的，这主要是因为两者各自的应用场景不同。

浏览器端主要的应用场景是用户交互，页面渲染，网络请求等；而`Node`的应用场景则是文件`IO`，网络请求等，而不用考虑渲染相关。

因此两者的宏任务和微任务也有所差异：

浏览器端：

+ 宏任务：`setTimeout` 、`setInterval`，用户交互——鼠标、键盘，网络请求—— `ajax, fetch...`，`postMessage`等；
+ 微任务：`Promise.then(catch, finally)...`，`MutaionObserver`（监听`DOM`变化），`Object.observe`（已经废弃）等；

`Node`端：

+ 宏任务：`setTimeout` 、`setInterval` 、`setImmediate`等；
+ 微任务：`Promise.then(catch, finally)...`，`process.nextTick`等；

而且还有一点很重要的是`Node`本身是用来设计给服务器用的，服务器对性能，时间等的精确程度要求比浏览器更加细腻一点，因此如果直接用浏览器那一套`Event Loop`来用肯定是不行的，略显粗糙。

浏览器的事件队列对于优先级的划分只有两层，那就是微任务，宏任务；宏任务和宏任务，微任务和微任务之间是没有额外划分的。

而这里我们的`Node`在具有宏任务，微任务的前提下，对宏任务和微任务自身也做了优先级的划分，它们各自执行在事件循环的不同阶段。

### 事件循环分阶段执行顺序

通过 `Node` 的官方文档可以得知，其事件循环的顺序分为以下六个阶段，每个阶段都会处理专门的任务（优先级从高到低）：

1. `Timers Callback`：涉及到时间，肯定越早执行越准确，所以这个优先级最高很容易理解，比如`setTimeout, setInterval`的回调函数就是在这个阶段进行处理的；

2. `Pending Callback`：处理网络、`IO` 等异常时的回调，有的 `*niux(linux, ...)` 系统会等待发生错误的上报，所以得处理下，例如`TCP`异常；

3. `Idle, Prepare`：`Node`内部使用，不用做过多的了解；

4. `Poll Callback`：处理 `IO` 的 `data`，网络的 `connection`，服务器主要处理的就是这个；

   例如：

   ```js
   const { readFile } = require('fs')
   const { resolve } = require('path')
   readFile(
     resolve(__dirname, 'helloWorld.txt'), 
     { encoding: 'utf-8' }, 
     (err, data) => {
     if(err) return
     console.log(data)
    }
   )
   ```

5. `Check Callback`：执行` setImmediate` 的回调；

6. `Close Callback`：关闭资源的回调，优先级最低，比如 `socket.destroy()`；



以上六个阶段，我们需要重点关注的只有四个，分别是： `Timers Callback, Poll Callback, Check Callback, Close Callback`。

这四个阶段都有各自的宏任务队列，我们分别将其称为`timers queue, poll queue, check queue, close callbacks queue`；

然后存在两个微任务队列，分别是 `next tick queue, other microtask queue`，其中`next tick queue`是`Node`为`process.nextTick`单独提供的微任务队列，优先级比其他微任务更高。即若同时存在 `process.nextTick` 和 `promise.then(catch, finally...)`，则会先执行前者；

也就是说`Node`的事件循环执行顺序大致如下图：



![图片](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:52:25-node-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E9%98%B6%E6%AE%B5%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F-01.png)

![图片](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20220120/17:52:28-node-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E9%98%B6%E6%AE%B5%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F-02.png)

这里有一点我们需要关注，`Node.js` 的 `Event Loop` 并不是浏览器那种一次执行一个宏任务，然后执行所有的微任务，然后开启下一轮事件循环；而是执行完一定数量的宏任务，再去执行所有的微任务，然后进入下一个阶段的宏任务队列，然后再开始；

大致执行顺序：

1. 先执行`timers queue`中一定数量的宏任务，执行完之后；
2. 清空微任务队列：`next tick queue --> other microtask queue`，清空完之后，或者直接微任务队列本身就没有微任务，进入下一个阶段；
3. 执行`poll queue`中一定数量的宏任务，执行完之后；
4. 重复步骤`2`；
5. 执行`check queue`中一定数量的宏任务，执行完之后；
6. 重复步骤`2`；
7. 执行`close callbacks queue`中一定数量的宏任务，执行完之后；
8. 重复步骤`2`；
9. 一轮事件循环结束，开启下一轮，进入步骤`1`；

注意：上述步骤是针对`Node 11`之前，在 `Node 11`之后，对宏任务队列的执行有所改变，从之前的一次执行一定数量的宏任务改为一次只执行一个宏任务，然后就去清空微任务中的队列；

### 常见问题

#### 一定数量的宏任务特指什么

这里的一定数量的宏任务你是否有一定的疑惑，接下来我举一个例子你就明白了：

```js
setTimeout(()=>{
  console.log('timer1');
  Promise.resolve().then(function() {
      console.log('promise1');
  });
}, 500);

setTimeout(()=>{
  console.log('timer2');
  Promise.resolve().then(function() {
      console.log('promise2');
  });
}, 500);
```

对于浏览器而言，它的事件循环的执行顺序为执行一个宏任务，然后就去清空微任务队列，然后在开始执行下一个宏任务，

1. 最先开始的是一个宏任务，那就是执行这个`JS`脚本代码，将两个`setTimeout`的回调扔进定时器线程处理，然后去清空微任务队列中的任务，发现里面微任务队列已经为空，开始下一轮事件循环；
2. 等待`500ms`后，定时器处理线程将两个回调放到宏任务队列中，然后`JS`执行栈先调用第一个`setTimeout`的回调，先输出`timer1`，然后执行`Promise`，将其扔给异步线程处理，等待`Promise`状态发生变化，后面立即调用`resolve`，于是状态立即发生变化，于是异步线程将`then(xx)`扔进微任务队列中，`setTimeout`回调执行完了，然后检查微任务队列，发现里面有`then(xx)`，输出`promise1`；
3. 差不多重复步骤`2`，然后输出`timer2, promise2`；

因此它的执行结果为：

`timer1, promise1, timer2, promise2`

对于`Node 11`之后的版本执行结果和浏览器中执行结果相同。

但是针对`Node 11`之前的版本呢，它是执行一定数量的宏任务，比如这里的定时器的回调是在`timer queue`中，`Node`可能先将这两个回调执行完之后，然后再清空微任务队列，因此结果可能为：

`timer1, timer2, promise1, promise2`

#### setTimeout 一定比 setImmediate 早吗

根据`Node`对事件循环阶段的划分，`setTimeout`是属于`timer`阶段的宏任务，而`setImmediate `是属于`check`阶段的宏任务，它们处在不同的宏任务队列，这里我们将其分别称之为：`timer queue, check queue`；

理论上来说，按照事件循环执行顺序，`timer queue`比`check queue`执行要早，接下来看一段代码：

```js
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})
```

这里多次执行，却出现了两种结果：

1. `setTimeout, setImmediate`（正常执行顺序）；
2. `setImmediate, setTimeout`（异常）；

这是为什么呢？

原因是因为`setTimeout`的计时并不是精确的，往往会晚于计时，比如即使指定为`0ms`，它的时间也是大于`0ms`的，这就意味着，`setTimeout(callback, 0)`的`callback`并不一定会在当前事件循环的`timer queue`中，而是在下一轮事件循环中。

因此出现第二种执行结果的原因就是`setImmediate`的回调所在的`check queue`的事件循环要早于`setTimeout`的回调所在的`timer queue`的事件循环。

那如何解决上述问题呢？让两者在同一轮事件循环被读取调用即可。

方案 `1`：

```js
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})


// 让同步执行的代码的时间大于 `setTimeout` 时间精确度的误差
let start = Date.now()
while(Date.now() - start < 20){}
```

我们虽然无法改变`setTimeout`的计时误差，让其精确进入任务队列，但是我们可以延迟下一轮事件循环的开始时机。

这个延迟的时间只要能够让下一轮事件循环开始执行`timer queue`之前，将`setTimeout`的回调扔到`timer queue`中即可，这样就能让其它就能和`setImmediate`的回调在同一轮事件循环被执行调用。



方案 `2`：

```js
const { readFile } = require('fs')
const { resolve } = require('path')
readFile(resolve(__dirname, 'helloWorld.txt'), { encoding: 'utf-8' }, (err, data) => {
  if (err) return
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

这里我们知道，`IO`的`data`是在事件循环的`poll`阶段执行的，此时当前事件循环已经过了`timer`阶段，因此只有在下一轮事件循环才会再次执行`timer`。

这样也就达到了让`setTimeout`的回调和`setImmediate`的回调在同一个事件循环中执行的效果。

但是这里的前提是：两轮事件循环的间隔，要大于`setTimout`的计时误差（事件循环一般也有一个启动时间，这个时间一般情况下是大于`setTimout`的计时误差）。



## 参考

[多图生动详解浏览器与Node环境下的Event Loop](https://mp.weixin.qq.com/s/VZwAZcmAJGWeWrqRbiveaw)

[JavaScript 事件循环：从起源到浏览器再到 Node.js](https://mp.weixin.qq.com/s/JfoIBPp8KkYPXFK_IZC7yA)

[浏览器和 Node.js 的 EventLoop 为什么这么设计](https://mp.weixin.qq.com/s/gWeWV8VSRc-_NuYRCM-kTQ)