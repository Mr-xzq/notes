---
title: 记一次 router.push 抛出未捕获的 NavigationDuplicated Promise Rejection 引发的思考
---

# 记一次 router.push 抛出未捕获的 NavigationDuplicated Promise Rejection 引发的思考

> vue-router@3.6.5
>
> 在 Vue Router 3.1.0 版本之后, 这个错误会以 `Promise rejection` 的形式抛出。
>
> NavigationDuplicated: Avoided redundant navigation to current location

## 示例

> 案例地址：https://stackblitz.com/edit/vitejs-vite-6r7qaeuj?file=src%2Fviews%2FJumpSameRoute.vue

代码示例：

```vue
<template>
    <div>
      <button @click="goSameRoute">
        跳转相同路由 button (使用 $router.push)
      </button>
        
      <router-link :to="currentPath">
        跳转相同路由 link (使用 router-link)
      </router-link>
    </div>
</template>

<script>
export default {
  data() {
    return {
      currentPath: '',
      error: null, // 使用 null 初始化错误，方便 v-if 判断
    };
  },
  mounted() {
    // 获取当前路由路径
    this.currentPath = this.$route.path;
    console.log('当前路径已设置为:', this.currentPath);
  },
  methods: {
    async goSameRoute() {
      this.error = null;

      try {
        await this.$router.push(this.currentPath);
      } catch (e) {
        // 捕获 NavigationDuplicated 错误
        if (e.name === 'NavigationDuplicated') {
          this.error = e;
          console.warn('✅ NavigationDuplicated 错误已成功捕获:', e.message);
        } else {
          // 捕获其他类型的错误
          this.error = e;
          console.error('⚠️ 发生了其他错误:', e);
        }

        throw e;
      }
    },
  },
};
</script>
```



如果通过 `router.push` 跳转相同路由会触发如下错误：

![image-20251027155442282](https://cdn.jsdelivr.net/gh/Mr-xzq/PicBed/img/20251027/17:09:07-vue-router-3-NavigationDuplicated.png)

但是通过 `<router-link></router-link>` 不会触发这个错误。



## 为什么 push 会产生这个问题

当尝试跳转到相同路由时, Vue Router 会中断导航并抛出错误。这个判断发生在 `confirmTransition` 的开始阶段:

```ts
// src/router.js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 如果 onComplete 和 onAbort 都没有传递, 那么 push 返回的就是一个 Promise
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.push(location, resolve, reject)
    })
  } else {
    this.history.push(location, onComplete, onAbort)
  }
}

// src/history/base.js
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  // ...

  // 这里的 onAbort 函数, router.push(location: RawLocation, onComplete?: Function, onAbort?: Function) 可以传递进来。如果没有传递的话，默认传进来的就是一个 reject 函数，这个函数会让 push 返回的 Promise 变为 rejected 状态
  const abort = err => {
    // changed after adding errors with
    // https://github.com/vuejs/vue-router/pull/3047 before that change,
    // redirect and aborted navigation would produce an err == null
    if (!isNavigationFailure(err) && isError(err)) {
      if (this.errorCbs.length) {
        this.errorCbs.forEach(cb => {
          cb(err)
        })
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn(false, 'uncaught error during route navigation:')
        }
        console.error(err)
      }
    }
    onAbort && onAbort(err)
  }
  
  // 1. 检查是否是相同路由
  if (isSameRoute(route, current)) {
    this.ensureURL()
    return abort(createNavigationDuplicatedError(current, route))
  }
  
  // ...
}

// src/util/route.js
export function isSameRoute (a: Route, b: ?Route): boolean {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}
```


## 如何解决

常见的处理方式是重写 push 和 replace 来 catch 异常：

```ts
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// 重写 push 方法
VueRouter.prototype.push = function push(...args) {
  return originalPush.apply(this, args).catch(err => {
    // 如果是重复导航错误，则忽略
    if (err.name === 'NavigationDuplicated') {
      return Promise.resolve(err)
    }
    // 其他错误则继续抛出
    return Promise.reject(err)
  })
}

// 重写 replace 方法
VueRouter.prototype.replace = function replace(...args) {
  return originalReplace.apply(this, args).catch(err => {
    if (err.name === 'NavigationDuplicated') {
      return Promise.resolve(err)
    }
    return Promise.reject(err)
  })
}
```


## 为什么 RouterLink 没这个问题

```ts
const noop = () => {}

// ...

export default {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    // ...
  },
  render (h: Function) {
    const router = this.$router
    const current = this.$route
    const { location, route, href } = router.resolve(
      this.to,
      current,
      this.append
    )

   // ...

    // push (location: RawLocation, onComplete?: Function, onAbort?: Function)
    // 这里的 replace 和 push 只传递了两个参数，也就是说传递了 onComplete，那么 push 就不会返回 Promise
    // 因此即使跳转 same route，也不会抛出 NavigationDuplicated Error
    const handler = e => {
      if (guardEvent(e)) {
        if (this.replace) {
          router.replace(location, noop)
        } else {
          router.push(location, noop)
        }
      }
    }

    const on = { click: guardEvent }
    if (Array.isArray(this.event)) {
      this.event.forEach(e => {
        on[e] = handler
      })
    } else {
      on[this.event] = handler
    }

    // ...

    return h(this.tag, data, this.$slots.default)
  }
}
```



## push 跳转流程梳理

调用链路:

```
router.push() -> History.transitionTo() -> History.confirmTransition()
```

### router.push

这里的 history instance 有不同的实现，具体是根据 `new VueRouter({ mode: 'hash | history' })` 中的 mode 来决定 

HashHistory 和 HTML5History 都继承 History(src\history\base.js)

```ts
// src/router.js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 如果 onComplete 和 onAbort 都没有传递, 那么 push 返回的就是一个 Promise
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.push(location, resolve, reject)
    })
  } else {
    this.history.push(location, onComplete, onAbort)
  }
}
```



#### HashHistory.push

```ts
// src/history/hash.js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    // ...
  }

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  setupListeners () {
    // ...
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        replaceHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  go (n: number) {
    window.history.go(n)
  }

  ensureURL (push?: boolean) {
    // ...
  }

  getCurrentLocation () {
    // ...
  }
}
```



#### HTML5History.push

```ts
export class HTML5History extends History {
  constructor (router: Router, base: ?string) {
    // ...
  }

  setupListeners () {
    // ...
  }

  go (n: number) {
    window.history.go(n)
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  ensureURL (push?: boolean) {
    // ...
  }

  getCurrentLocation (): string {
    // ...
  }
}
```



### History.transitionTo

```ts
// src/history/base.js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 1. 匹配路由
  const route = this.router.match(location, this.current)
  
  // 2. 确认转换
  this.confirmTransition(
    route,
    () => {
      // 3. 更新当前路由
      this.updateRoute(route)
      // 4. 执行 onComplete 回调
      onComplete && onComplete(route)
      // 5. 更新 URL
      this.ensureURL()
      // 6. 触发全局的 afterEach 钩子
      this.router.afterHooks.forEach(hook => {
        hook && hook(route, this.current)
      })
    },
    err => {
      onAbort && onAbort(err)
    }
  )
}
```



### History.confirmTransition

```ts
// src/history/base.js
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  
  // 1. 检查是否是相同路由
  if (isSameRoute(route, current)) {
    this.ensureURL()
    return abort(createNavigationDuplicatedError(current, route))
  }
  
  // 2. 解析需要更新的路由组件
  const {
    updated,
    deactivated,
    activated
  } = resolveQueue(this.current.matched, route.matched)
  
  // 3. 按顺序执行路由守卫队列
  const queue: Array<?NavigationGuard> = [].concat(
    extractLeaveGuards(deactivated),    // 组件内离开守卫
    this.router.beforeHooks,            // 全局 beforeEach 守卫
    extractUpdateHooks(updated),        // 组件内更新守卫
    activated.map(m => m.beforeEnter),  // 路由配置内的 beforeEnter
    resolveAsyncComponents(activated)   // 解析异步路由组件
  )
  
  // 4. 执行守卫队列
  runQueue(queue, iterator, () => {
    // 5. 执行 beforeRouteEnter 守卫
    const enterGuards = extractEnterGuards(activated)
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
      onComplete(route)
    })
  })
}
```