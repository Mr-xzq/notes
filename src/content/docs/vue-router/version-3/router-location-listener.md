---
title: Vue Router location 监听机制
---

# Vue Router location 监听机制

> vue-router@3.6.5

## 结论

1. Hash 模式：`supportsPushState ? 'popstate' : 'hashchange'`
2. History 模式：`'popstate'`



Vue Router 会根据不同的路由模式选择对应的监听方式，具体是由 `new VueRouter({ mode: 'hash | history' })` 中的 mode 来决定。

```ts
// src/history/hash.js
export class HashHistory extends History {
  // ...

  setupListeners () {
    // ...
    
    // 对于 hash mode，会查看当前环境是否支持 supportsPushState，来决定监听什么事件
    // 也就是说并不是简单的 hash mode 就用 haschange event
    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    window.addEventListener(
      eventType,
      handleRoutingEvent
    )
    // ...
  }
    
  // ...
}


// src/history/html5.js
export class HTML5History extends History {
  // ...

  setupListeners () {
    // ...
    
    // 对于 history mode，直接监听 popstate
    window.addEventListener('popstate', handleRoutingEvent)
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent)
    })
  }
    
  // ...
}

// src/util/push-state.js
export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent
  
  // 检查是否需要降级处理
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }
  
  return window.history && typeof window.history.pushState === 'function'
})()
```



## 触发场景

```js
// hashchange 事件
history.pushState(null, '', '#foo')   // 不触发
window.location.hash = 'foo'          // 触发

// popstate 事件
history.pushState(null, '', 'foo')    // 不触发
history.back()                        // 触发
history.forward()                     // 触发
history.go(2)                         // 触发
```



## 流程梳理

HashHistory 和 HTML5History 都继承 History(src/history/base.js)

```
这俩不存在先后顺序
const router = new VueRouter(options) --> 
Vue.use(VueRouter) --> install(Vue)

然后存在顺序
vue instance beforeCreate --> router.init --> history.transitionTo --> setupListeners --> history.setupListeners()  -->  window.addEventListener(eventType, handleRoutingEvent)
```



```ts
// src/install.js
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      // 一直向上找到 new Vue({router}) 的这个 vue instance, 一般情况下是根组件(this._routerRoot)
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        // 这里的 this 是 current vue instance
        // const router = new VueRouter(); Vue.use(VueRouter); new Vue({ router })
        this._router = this.$options.router
        // 这里会调用 router.init
        this._router.init(this)
        // 这里会让 _route 响应式, 其实我们访问的 $route 对应的就是这里的 _route
        // 我猜测在这里不用 Vue.set(xxx) 是因为 set 中有个判断 if (target._isVue || (ob && ob.vmCount)) 的判断不允许往 vue instance 动态设置响应式数据
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}


// src/router.js
export default class VueRouter {
  // ...
  constructor (options: RouterOptions = {}) {
    // ...

    let mode = options.mode || 'hash'
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  init (app: any /* Vue component instance */) {
    // ...

    const history = this.history

    // 初始就会先 transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function), 也就是说不管是  onComplete 或者 onAbort 都会调用 setupListeners --> history.setupListeners()
    if (history instanceof HTML5History || history instanceof HashHistory) {
      // ...
      const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }
    // ...
}

// We cannot remove this as it would be a breaking change
VueRouter.install = install
VueRouter.version = '__VERSION__'
VueRouter.isNavigationFailure = isNavigationFailure
VueRouter.NavigationFailureType = NavigationFailureType
VueRouter.START_LOCATION = START

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```



```ts
// src/history/base.js
export class History {
  // ...
  
  constructor (router: Router, base: ?string) {
    this.router = router
    
    // ...
  }
    
  // ...

  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route
    // catch redirect option https://github.com/vuejs/vue-router/issues/3201
    try {
      route = this.router.match(location, this.current)
    } catch (e) {
      this.errorCbs.forEach(cb => {
        cb(e)
      })
      // Exception should still be thrown
      throw e
    }
    const prev = this.current
    this.confirmTransition(
      route,
      () => {
        this.updateRoute(route)
        onComplete && onComplete(route)
        // ...
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
        // ...
      }
    )
  }
  
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    // ...
  }
  
}

// src/history/hash.js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    super(router, base)
    
    // ...
  }

  // setupListeners 在 vue app mount 之后才会调用，这样可以避免 hashchange 监听器被过早触发
  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  setupListeners () {
    if (this.listeners.length > 0) {
      return
    }

    const router = this.router
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      this.listeners.push(setupScroll())
    }

    const handleRoutingEvent = () => {
      const current = this.current
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), route => {
        if (supportsScroll) {
          handleScroll(this.router, route, current, true)
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath)
        }
      })
    }
    
    // 对于 hash mode，会查看当前环境是否支持 supportsPushState，来决定监听什么事件
    // 也就是说并不是简单的 hash mode 就用 haschange event
    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    window.addEventListener(
      eventType,
      handleRoutingEvent
    )
    this.listeners.push(() => {
      window.removeEventListener(eventType, handleRoutingEvent)
    })
  }
    
  // ...
}


// src/history/html5.js
export class HTML5History extends History {
  // ...

  constructor (router: Router, base: ?string) {
    super(router, base)
    // ...
  }

  setupListeners () {
    if (this.listeners.length > 0) {
      return
    }

    const router = this.router
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      this.listeners.push(setupScroll())
    }

    const handleRoutingEvent = () => {
      const current = this.current

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      const location = getLocation(this.base)
      if (this.current === START && location === this._startLocation) {
        return
      }

      this.transitionTo(location, route => {
        if (supportsScroll) {
          handleScroll(router, route, current, true)
        }
      })
    }
    
    // 对于 history mode，直接监听 popstate
    window.addEventListener('popstate', handleRoutingEvent)
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent)
    })
  }
    
  // ...
}

// src/util/push-state.js
export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent
  
  // 检查是否需要降级处理
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }
  
  return window.history && typeof window.history.pushState === 'function'
})()
```
