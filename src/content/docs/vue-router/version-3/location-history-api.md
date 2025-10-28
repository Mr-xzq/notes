---
title: Location 和 History API 指南
---

# Location 和 History API 指南

## window.location

### Location 对象属性

> 以下以 URL `http://localhost:8080/path1/#/demo/8?name=xzq` 为例

```js
{
  hash: "#/demo/8?name=xzq",      // hash 值(# 及其后面的内容)
  host: "localhost:8080",         // 主机名 + 端口号
  hostname: "localhost",          // 主机名
  href: "http://localhost:8080/path1/#/demo/8?name=xzq",  // 完整 URL
  origin: "http://localhost:8080", // 协议 + 主机名 + 端口(只读)
  pathname: "/path1/",           // 路径
  port: "8080",                  // 端口号
  protocol: "http:",             // 协议
  search: "?name=xzq"            // 查询参数
}
```

### Location 对象方法

> 重要说明:
>
> - 以 `/` 开头的 URL 会被当作根路径处理
> - 不以 `/` 开头会被当作相对路径处理
> - assign()、replace()、reload() 都会触发页面重载

#### assign(url)

> 重要特性:
>
> - 会触发页面重新加载
> - 会计入 History 历史记录
> - 支持相对路径和绝对路径

示例 1: 相对路径

```js
// 当前历史记录长度为 1
window.history.length  // 1

window.location.assign('path2')
// 结果: http://localhost:8080/path1/path2
// 历史记录长度增加到 2
window.history.length  // 2
```

示例 2: 绝对路径

```js
// 当前 URL: http://localhost:8080/path1/#/demo/8?name=xzq
window.location.assign('/path2')
// 结果: http://localhost:8080/path2
```

#### replace(url)

> 重要特性:
>
> - 会触发页面重新加载
> - 不会计入历史记录
> - 替换当前 URL

```js
window.history.length  // 1
window.location.replace('./path2')
// 结果: http://localhost:8080/path1/path2
window.history.length  // 1 (长度不变)
```

#### toString()

> Location 对象的 toString 方法被重写,返回完整的 href 值

```js
// 等同于以下实现
function toString() {
  return window.location.href
}

// 使用示例
window.location + '' === window.location.href  // true
```

#### reload(force?: boolean)

> 重要特性:
>
> - force=false: 可能使用缓存
> - force=true: 强制从服务器重新加载
> - 默认值为 false

```js
// 普通刷新,可能使用缓存
window.location.reload()

// 强制刷新,忽略缓存
window.location.reload(true)
```

### Hash 的特殊说明

> 重要特性:
>
> - hash 变化不会导致页面重载
> - hash 变化会产生历史记录(除非前后 hash 相同)
> - 有多种方式可以修改 hash

```js
// 以下三种方式效果相同
// 原地址: http://localhost:8080/path1/path2

// 方式 1: 直接修改 href
window.location.href = '#hello'

// 方式 2: 使用 replace
window.location.replace('#hello')

// 方式 3: 直接修改 hash
window.location.hash = 'hello'

// 结果都是: http://localhost:8080/path1/path2#hello
```

## window.history

> History API 是 HTML5 引入的新标准,用于操作浏览器的会话历史记录

### History 对象属性

```js
{
  length: Number,            // 历史记录数量(只读)
  scrollRestoration: String, // 滚动行为('auto'|'manual')
  state: Object             // 当前历史记录的状态对象(只读)
}
```

### History 对象方法

> 重要说明:
>
> - pushState/replaceState/go/forward/back 不会触发页面重载
> - 所有操作都需要同源

### pushState(state, title[, url])

> 重要特性:
>
> - 向历史记录添加新状态
> - 不会触发页面重载
> - URL 必须同源
> - 不会触发 hashchange 事件

参数说明:

1. state: 任何可序列化的数据,与历史记录绑定
2. title: 大多数浏览器忽略,建议传空字符串
3. url(可选): 新的 URL,必须同源

```js
// 示例
// 初始 URL: http://localhost:8080
window.history.pushState(
  { key: '0' },  // 状态对象
  '',            // 标题(忽略)
  'demo1'        // 新 URL
)
// 结果: http://localhost:8080/demo1
```

### pushState vs location.hash 对比

> 重要区别:
>
> 1. 历史记录处理不同
> 2. URL 限制不同
> 3. 状态保存能力不同
> 4. 事件触发机制不同

```js
// 1. 历史记录示例
// hash 方式只在值不同时才创建历史记录
location.hash = '#demo'  // 创建记录
location.hash = '#demo'  // 相同 hash,不创建记录

// pushState 总是创建新记录
history.pushState({}, '', '#demo')  // 创建记录
history.pushState({}, '', '#demo')  // 仍然创建记录

// 2. URL 限制示例
// hash 可以跨域
location.hash = 'http://other-domain.com'  // 允许

// pushState 必须同源
history.pushState({}, '', 'http://other-domain.com')  // 报错!
```

### replaceState(state, title[, url])

> 重要特性:
>
> - 替换当前历史记录
> - 参数与 pushState 相同
> - 不会增加历史记录数量

```js
// 初始 URL: http://localhost:8080
window.history.replaceState(
  { name: 'xzq' },  // 新状态
  '',               // 标题
  'demo1'           // 新 URL
)
// 结果: http://localhost:8080/demo1
// history.length 保持不变
```

### replaceState vs location.replace 对比

> 主要区别:
>
> 1. replaceState 不重载页面,location.replace 会重载
> 2. replaceState 要求同源,location.replace 无此限制

```js
// location.replace 可以跨域
location.replace('http://www.baidu.com')  // 成功跳转

// replaceState 必须同源
history.replaceState({}, '', 'http://www.baidu.com')  // 报错!
```

### go(num)

> 重要特性:
>
> - 支持正负整数作为参数
> - 超出范围时静默失败
> - 通常不触发页面重载

```js
// 前进 2 步
history.go(2)

// 后退 1 步
history.go(-1)

// 刷新当前页
history.go(0)  // 或 history.go()

// 超出范围不报错
history.go(999)  // 静默失败
```

### forward() 和 back()

> 相当于 go(1) 和 go(-1) 的快捷方式

```js
// 这两组调用等价
history.forward()  ===  history.go(1)
history.back()    ===  history.go(-1)
```

## 监听路由机制

### hashchange 事件

> 触发条件:
>
> - URL 的 hash 部分(# 后面的内容)发生变化
> - 通过 history.go() 等方法导致的 hash 变化也会触发
> - pushState/replaceState 不会触发

```js
// 监听 hash 变化
window.addEventListener('hashchange', (event) => {
  console.log('新 URL:', event.newURL)
  console.log('旧 URL:', event.oldURL)
})
```

### popstate 事件

> 触发条件:
>
> - 通过浏览器前进/后退按钮切换历史记录
> - 调用 history.go()/back()/forward()
> - pushState/replaceState 不会触发

```js
window.addEventListener('popstate', (event) => {
  // event.state 包含历史记录的状态对象
  console.log('当前状态:', event.state)
})
```

## Location API 在 SPA 中的特殊说明

> 在单页应用（SPA）中，一些 Location API 的行为会与传统网页有所不同

### location.href 行为差异

```js
// 在传统网页中
location.href = location.href  // 会触发页面刷新

// 在 Vue Router 等 SPA 中
location.href = location.href  // 不会触发页面刷新

// 如果需要在 SPA 中强制刷新页面，应使用：
window.location.reload()
```

### 原因说明

SPA 框架（如 Vue Router）会拦截 URL 变化，当检测到目标 URL 与当前 URL 相同时，框架会阻止默认的导航行为


## 总结

### Location API 特点

- 大多数操作会导致页面重载
- 支持跨域 URL 操作
- hash 相关操作不触发重载

### History API 特点

- 操作不会导致页面重载
- 严格要求同源
- 可以保存状态数据
- 提供更细粒度的历史记录控制

### 历史栈操作详解

#### Location API 对历史栈的影响

```js
// 1. location.href 赋值
// - 新 URL 与当前 URL 不同时，会增加历史栈
// - 新 URL 与当前 URL 相同时，会刷新页面，但不增加历史栈
location.href = '/page1'  // 增加历史栈
location.href = location.href  // 仅刷新页面

// 2. location.replace
// - 替换当前历史记录，历史栈长度不变
location.replace('/page2')  // 历史栈长度不变

// 3. location.hash 修改
// - 新 hash 与当前 hash 不同时，增加历史栈
// - 新 hash 与当前 hash 相同时，不增加历史栈且不刷新
location.hash = '#/home'  // 增加历史栈
location.hash = '#/home'  // 不增加历史栈

// 4. location.reload
// - 不影响历史栈长度
location.reload()  // 历史栈长度不变
```

#### History API 对历史栈的影响

```js
// 1. history.pushState
// - 总是增加历史栈，即使 URL 与当前 URL 相同
// - 不会刷新页面
history.pushState(null, '', '/page1')  // 增加历史栈
history.pushState(null, '', '/page1')  // 仍然增加历史栈

// 2. history.replaceState
// - 替换当前历史记录，历史栈长度不变
// - 不会刷新页面
history.replaceState(null, '', '/page2')  // 历史栈长度不变

// 3. history.back/forward/go
// - 仅在历史记录间移动，不改变历史栈长度
history.back()    // 历史栈长度不变
history.forward() // 历史栈长度不变
history.go(2)     // 历史栈长度不变
```

#### 特殊情况说明

```js
// 1. 跨域导航
// - 会清空当前域名下的历史栈
location.href = 'https://other-domain.com'  // 新域名下历史栈重置为 1

// 2. 在历史记录中间位置进行新的导航
// - Location API：会删除当前位置后的所有记录
// - pushState：会删除当前位置后的所有记录
history.back()  // 回到历史记录中间位置
location.href = '/new-page'  // 删除之后的记录
// 或
history.pushState(null, '', '/new-page')  // 删除之后的记录

// 3. 路由相同但参数不同的情况
// location hash：
location.hash = '#/user?id=1'  // 增加历史栈
location.hash = '#/user?id=2'  // 增加历史栈

// pushState：
history.pushState(null, '', '/user?id=1')  // 增加历史栈
history.pushState(null, '', '/user?id=2')  // 增加历史栈

// 4. 刷新页面
// - 保持历史栈不变
// - 保留状态对象（state）
location.reload()  // 历史栈长度和状态保持不变
```

#### 关键区别总结

1. **相同路径行为**：
   - `location.hash`：相同 hash 不增加历史栈
   - `pushState`：总是增加历史栈，即使路径相同

2. **页面刷新**：
   - Location API（除 hash 外）：会触发页面刷新
   - History API：不触发页面刷新

3. **历史栈处理**：
   - `location.replace`：替换记录并刷新页面
   - `replaceState`：替换记录但不刷新页面

4. **参数变化**：
   - 只要完整 URL 不同（包括参数），Location API 和 History API 都会处理为新的历史记录