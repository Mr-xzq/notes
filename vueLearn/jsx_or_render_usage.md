# render/JSX 使用手册

## JSX 是什么

请看如下示例：

```jsx
const element = <h1>Hello, world!</h1>;
```

`element`变量存储的并不是字符串，而是一个可以描述`HTML`的对象。实际上`<h1>Hello, world!</h1>`最后会被转换成`vdom`。



它就被称之为`JSX`，是 `JavaScript` 语法的扩展，`JSX` 可以很好地描述 `UI` 应该呈现出它应有交互的本质形式。`JSX` 可能会使人联想到模板语言，但它具有 `JavaScript` 的全部功能。



在外表上与 `HTML` 类似，`JSX` 提供了一种使用许多开发人员熟悉的语法来构建组件渲染的方法。 `React` 组件通常使用 `JSX` 撰写，尽管它们并非必须如此（组件也可以使用纯 `JavaScript` 撰写）。



虽然最早是由 `React` 引入，但实际上 `JSX` 语法并没有定义运行时语义，并且能被编译成各种不同的输出形式。如果你之前使用过 `JSX` 语法，那么请注意 **Vue 的 JSX 编译方式与 React 中 JSX 的编译方式不同**，因此你不能在 `Vue` 应用中使用 `React` 的 `JSX` 编译。与 `React JSX` 语法的一些明显区别包括：

- 可以使用 `HTML attributes` 比如 `class` 和 `for` 作为 `props` - 不需要使用 `className` 或 `htmlFor`。
- 传递子元素给组件 (比如 `slots`) 的[方式不同](https://cn.vuejs.org/guide/extras/render-function.html#passing-slots)。

`Vue` 的类型定义也提供了 `TSX` 语法的类型推导支持。当使用 `TSX` 语法时，确保在 `tsconfig.json` 中配置了 `"jsx": "preserve"`，这样的 `TypeScript` 就能保证 `Vue JSX` 语法编译过程中的完整性。



基本`JSX`语法可以参考：

`React JSX`基本语法：https://zh-hans.reactjs.org/docs/introducing-jsx.html

但是需要注意的是`Vue`中的`JSX`和`React`中的`JSX`还有所不同，比如：

`Vue2 JSX`和`React JSX`的不同：https://github.com/vuejs/babel-plugin-transform-vue-jsx#difference-from-react-jsx

## 渲染函数 & JSX

### 基础

`Vue` 推荐在绝大多数情况下使用模板来创建你的 `HTML`。然而在一些场景中，你真的需要 `JavaScript` 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。

让我们深入一个简单的例子，这个例子里 `render` 函数很实用。假设我们要生成一些带锚点的标题：

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>
      <a href="">H1</a>
    </h1>
    <h2>
      <a href="">H2</a>
    </h2>
  </div>
</template>
```

对于上面的 HTML，你决定这样定义组件接口：

```vue
<!-- App.vue -->
<template>
	<AHeading :level="1"><a href="">H1</a></AHeading>
	<AHeading :level="2"><a href="">H2</a></AHeading>
</template>
```

如果用模板实现动态生成标题的组件时，你可能很快想到这样实现：

```vue
<!-- AHeading.vue -->
<template>
  <div>
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
});
</script>
```



但是你会发现，这里用模板并不是最好的选择：不但代码冗长，而且在每一个级别的标题中重复书写了 `<slot></slot>`，在要插入锚点元素时还要再次重复。

虽然模板在大多数组件中都非常好用，但是显然在这里它就不合适了。那么，我们来尝试使用 `render` 函数重写上面的例子：

> 所选的`Vue`示例版本为： `3.x`。

```vue
<!-- AHeadingPlus.vue -->
<script lang="jsx">
import { defineComponent, h } from 'vue';
export default defineComponent({
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
  render() {
    const defaultSlots = this.$slots.default;
    console.log(defaultSlots());
    // 非 jsx
    // return h(`h${this.level}`, defaultSlots());
    // jsx
    const DynamicTag = `h${this.level}`;
    return <DynamicTag>{defaultSlots()}</DynamicTag>;
  },
});
</script>
```

这里你就能看到`render`函数相比于`template`更加灵活的特性。

### 虚拟DOM

`Vue` 通过建立一个**虚拟 DOM** 来追踪自己要如何改变真实 `DOM`。请仔细看这行代码：

```js
return createVnode('h1', this.blogTitle)
```

`createVnode` 到底会返回什么呢？其实不是一个*实际的* `DOM` 元素。

它更准确的名字可能是 `createNodeDescription`，因为它所包含的信息会告诉 `Vue` 页面上需要渲染什么样的节点，包括及其子节点的描述信息。

我们把这样的节点描述为“虚拟节点 `(virtual node)`”，也常简写它为`VNode`。“虚拟 `DOM`”是我们对由 `Vue` 组件树建立起来的整个 `VNode` 树的称呼。



### createVNode

> `Vue2`中也称之为`createElement`
>
> 参考：
>
> [vue2 createElement](https://v2.cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)
>
> [vue3 createVNode](https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes)

`h()` 是 **hyperscript** 的简称——意思是“能生成 HTML (超文本标记语言) 的 `JavaScript`”。这个名字来源于许多虚拟 `DOM` 实现默认形成的约定。一个更准确的名称应该是 `createVNode()`，但当你需要多次使用渲染函数时，一个简短的名字会更省力。

`render`函数的返回值是`VNode`, `createVNode, h`函数的返回值也是`VNode`。

`JSX`可以看作是`createVNode, h`函数的另外一种表现形式，它也会被转换成`VNode`。

```jsx
// 下面三种写法可以看作同一个意思
render() {
  return h('div')
  
  return createVNode('div')
  
  return <div></div>
}
```



## template 对比渲染函数



`Vue`由模板到真实`DOM`的大致过程：

`template --> AST --> optimize AST(flag static node) --> render --> VNode --> mount --> DOM`

`Vue`由`render`到真实`DOM`的大致过程：

`render --> VNode --> mount --> DOM`



当`Vue`组件第一次被渲染到页面上时，执行的就是`mount`，如果不是第一次，那么就执行`patch`，来比较`oldVNode`和`newVNode`的差异，然后执行对应的`DOM`操作。

也就是说，只有`mount, patch`才是真正的`DOM`操作。



两种渲染流程的差异就是在编译过程：`template --> AST --> optimize AST(flag static node) `

一般它是由`@vue/complier-sfc`之类的`vue`提供的编译插件完成。



也许有人会说，在实际开发中，是不是直接通过`render`函数来写组件性能会比写`template`更好，其实不然，因为在如今的前端工程化中，如果你用到`vue-cli`或者`vite`集成了对应的`vue`开发套件，那么这个静态编译的流程会在提前到打包过程中完成，也就是说我们实际运行的代码中就是`render`函数。

反过来说，写`template`可能还会比`render`性能更好，因为它能提供更多的静态优化信息来完成`optimize AST(flag static node)`的过程，可以跳过`patch`过程中一些比较的节点。

`template`：

优点：更直观的展示，相比于`render`更优的性能；

缺点：没有`render`灵活；

`render`:

优点：具备完全的`JavaScript`编程能力，相比于`template`更加的灵活；

缺点：一般来说性能上不如`template`，有时候看起来不够直观；



## 渲染函数使用案例

### 插槽的定义与渲染

#### 概览

父组件传递插槽传递需要渲染的内容，子组件定义插槽和实际渲染父组件传递过来的插槽。

#### vue2

```vue
<!-- 
<template>
  <Message message="message">
    <template v-slot:default> message </template>
    <template v-slot:footer="slotProps"> {{ slotProps.text }} </template>
  </Message>
</template> 
-->

<script lang="jsx">
import { defineComponent, h } from 'vue';
import Message from './Message.vue';
export default defineComponent({
  components: {
    Message,
  },
  render() {
    // 非 jsx
    return h(Message, {
      // props
      props: {
        message: 'message',
      },
      // 父组件传递插槽
      scopedSlots: {
        default: () => 'message',
        footer: (slotProps) => slotProps.text,
      },
    });
    // jsx
    // return (
    //   <Message
    //     message="message"
    //     scopedSlots={{
    //       default: () => 'message',
    //       footer: (slotProps) => slotProps.text,
    //     }}
    //   ></Message>
    // );
  },
});
</script>
```



```vue
<!-- 
 <template>
  <div>
    <div><slot /></div>
    <div><slot name="footer" :text="message" /></div>
  </div>
</template>
 -->

<script lang="jsx">
import { defineComponent, h } from 'vue';
export default defineComponent({
  props: ['message'],
  render() {
    const slots = this.$scopedSlots;
    const defaultSlotsVNode = slots.default();

    // 作用域插槽向外界传递 slotProps
    const footerSlotProps = { text: this.message + 'footer' };
    const footerSlotsVNode = slots.footer(footerSlotProps);

    // 非 jsx
    return h('div', null, [
      h('div', null, defaultSlotsVNode),
      h('div', null, footerSlotsVNode),
    ]);
    // jsx
    // return (
    //   <div>
    //     <div>{defaultSlotsVNode}</div>
    //     <div>{footerSlotsVNode}</div>
    //   </div>
    // );
  },
});
</script>
```



#### vue3

```vue
<!-- 父组件, MessageFather.vue -->
<!-- 
<template>
  <Message message="message">
    <template v-slot:default> message </template>
    <template v-slot:footer="slotProps"> {{ slotProps.text }} </template>
  </Message>
</template> 
-->

<script lang="jsx">
import { defineComponent, h } from 'vue';
import Message from './Message.vue';
export default defineComponent({
  components: {
    Message,
  },
  render() {
    // 非 jsx
    // return h(
    //   Message,
    //   {
    //     // props
    //     message: 'message',
    //   },
    //   {
    //     // 父组件传递插槽
    //     default: () => 'message',
    //     footer: (slotProps) => slotProps.text,
    //   }
    // );
    // jsx
    return (
      <Message message="message">
        {{
          default: () => 'message',
          footer: (slotProps) => slotProps.text,
        }}
      </Message>
    );
  },
});
</script>
```



```vue
<!-- 子组件, Message.vue -->
<!-- 
<template>
  <div>
    <div><slot /></div>
    <div><slot name="footer" :text="message" /></div>
  </div>
</template>
-->

<script lang="jsx">
import { defineComponent, h } from 'vue';
export default defineComponent({
  props: ['message'],
  render() {
    const slots = this.$slots;
    const defaultSlotsVNode = slots.default();

    // 作用域插槽向外界传递 slotProps
    const footerSlotProps = { text: this.message + 'footer' };
    const footerSlotsVNode = slots.footer(footerSlotProps);

    // 非 jsx
    // return [h('div', defaultSlotsVNode), h('div', footerSlotsVNode)];
    // jsx
    return [<div>{defaultSlotsVNode}</div>, <div>{footerSlotsVNode}</div>];
  },
});
</script>
```



### JSX 中引用组件

#### 概览

1. 通过`JS`变量存储`Vue`组件对象，然后通过标签引用：

   + 通过导入模块的方式导入`Vue`组件对象，`import xx from 'xx.vue'`；
   + 通过`Vue3`提供的`const xx = resolveComponent(componentName)`的方式获取组件对象；

2. 直接通过标签引用，然后`Vue`会根据标签名按照`Vue`组件名查找的方式来寻找已注册组件（局部或者全局组件）；

   `Vue`根据标签来匹配已注册组件名的规则是：

   + 当使用 `PascalCase` (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。也就是说 `<my-component-name>` 和 `<MyComponentName>` 都是可接受的。注意，尽管如此，直接在 DOM (非 `template` 的方式) 中使用时只有 `kebab-case` 是有效的。

     `Vue.component('MyComponentName', { /* ... */ })`

   + 当使用 `kebab-case` (短横线分隔命名) 定义一个组件时，你也必须在引用这个自定义元素时使用 `kebab-case`，例如 `<my-component-name>`。

     `Vue.component('my-component-name', { /* ... */ })`

   参考：

   [vue2 组件名注意点](https://v2.cn.vuejs.org/v2/guide/components-registration.html#%E7%BB%84%E4%BB%B6%E5%90%8D%E5%A4%A7%E5%B0%8F%E5%86%99)

   [vue3 组件名注意点](https://cn.vuejs.org/guide/components/registration.html#component-name-casing)

3. 在`JSX`中通过`{VNode}`来引用：

   + 获取`Vue`组件对象之后，然后将其通过变量存储，它就会被转化为`VNode`，`const xxVNode = <Component></Component>; const res = <div>{xxVNode}</div>`；

#### vue2

```vue
// DynamicTagFather.vue
<script lang="jsx">
import { defineComponent } from '@vue/composition-api';
import DynamicTag from './DynamicTag.vue';
import dynamictag from './DynamicTag.vue';
export default defineComponent({
  components: {
    DynamicTagAlias: DynamicTag,
  },
  // h 作为 render 的参数
  render() {
    //  支持 Vue 组件名识别规则
    const dynamictagVNode = <dynamictag></dynamictag>;
    return (
      // @vue/babel-preset-jsx 不支持 Fragement 语法 <></>
      <div>
        {/* 标签名称能够识别为导入的 Vue 组件对象, 这个本质上也是一个存储 Vue 组件对象的变量 */}
        <DynamicTag></DynamicTag>
        {/* error, 对于变量是不支持别名解析的 */}
        <dynamic-tag></dynamic-tag>
        {/* 支持 Vue 组件名识别规则 */}
        {/* https://v2.cn.vuejs.org/v2/guide/components-registration.html#%E7%BB%84%E4%BB%B6%E5%90%8D%E5%A4%A7%E5%B0%8F%E5%86%99 */}
        {/* 标签名称能够识别为已经注册的 Vue 组件, 也就是说会去上下文中搜索注册的 Vue 组件(包括全局组件和局部组件) */}
        <DynamicTagAlias></DynamicTagAlias>
        {/* 和上面的相同, 同样能去搜索组件, 按照 Vue 组件名匹配规则 */}
        <dynamic-tag-alias></dynamic-tag-alias>
        {/* 标签名称能够识别为一个存储 Vue 组件对象的变量 */}
        <dynamictag></dynamictag>
        {/* VNode */}
        {dynamictagVNode}
      </div>
    );
  },
});
</script>
```



```vue
// DynamicTag.vue
<template>
  <h1>dynamicTag</h1>
</template>
```



#### vue3

```vue
// DynamicTagFather.vue
<script lang="jsx">
import { defineComponent, resolveComponent } from 'vue';
import DynamicTag from './DynamicTag.vue';
import dynamictag from './DynamicTag.vue';
export default defineComponent({
  components: {
    DynamicTagAlias: DynamicTag,
  },
  // h 作为 render 的参数
  render() {
    // vue3 提供的另外一种获取 vue 组件对象的方式,  遵循 Vue 组件名查找规则
    // 获取 vue 组件对象, 将其存储为一个变量
    const resolveDynamicTag = resolveComponent('DynamicTagAlias');

    // 支持 Vue 组件名识别规则
    const dynamictagVNode = <dynamictag></dynamictag>;

    return (
      // babel-plugin-jsx 支持 Fragement 语法 <></>
      <>
        <resolveDynamicTag></resolveDynamicTag>
        {/* 标签名称能够识别为导入的 Vue 组件对象, 这个本质上也是一个存储 Vue 组件对象的变量 */}
        <DynamicTag></DynamicTag>
        {/* 对于变量是不支持 Vue 组件名解析的方式 */}
        {/* Failed to resolve component: dynamic-tag */}
        <dynamic-tag></dynamic-tag>
        {/* 支持 Vue 组件名识别规则 */}
        {/* https://cn.vuejs.org/guide/components/registration.html#component-name-casing */}
        {/* 标签名称能够识别为已经注册的 Vue 组件, 也就是说会去上下文中搜索注册的 Vue 组件(包括全局组件和局部组件) */}
        <DynamicTagAlias></DynamicTagAlias>
        {/* 和上面的相同, 同样能去搜索组件, 按照 Vue 组件名匹配规则 */}
        <dynamic-tag-alias></dynamic-tag-alias>
        {/* 标签名称能够识别为一个存储 Vue 组件对象的变量 */}
        <dynamictag></dynamictag>
        {/* VNode */}
        {dynamictagVNode}
      </>
    );
  },
});
</script>
```



```vue
// DynamicTag.vue
<template>
  <h1>dynamicTag</h1>
</template>
```



### 事件

#### 公共代码

```vue
// Event.vue
<template>
  <div>
    <h1>Custom Event</h1>
    <button @click="triggerEventByName('click')">
      trigger event name: click
    </button>
    <button @click="triggerEventByName('on-click')">
      trigger event name: on-click
    </button>
    <button @click="triggerEventByName('onClick')">
      trigger event name: onClick
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Event',
  setup(props, { emit }) {
    const triggerEventByName = (eventName) => {
      emit(eventName, eventName);
    };

    return {
      triggerEventByName,
    };
  },
});
</script>
```



#### vue2

```vue
<script lang="jsx">
import Event from './components/Event.vue';
import { h } from 'vue';
export default {
  name: 'EventApp',
  setup() {
    const handleClickByListenrType = (listenEventName, realEventName) => {
      console.log(
        `listenEventName: ${listenEventName} -->  vue real emit event name:  ${realEventName}`
      );
    };

    // render 函数的方式
    return () =>
      h(Event, {
        on: {
          click: () => handleClickByListenrType('vOn:click', 'click'),
          'on-click': () =>
            handleClickByListenrType('vOn:on-click', 'on-click'),
          onClick: () => handleClickByListenrType('vOn:onClick', 'onClick'),
        },
        nativeOn: {},
      });

    // jsx 的方式
    // return () => (
    //   <div>
    //     <Event
    //       vOn:click={() => handleClickByListenrType('vOn:click', 'click')}
    //       vOn:on-click={() =>
    //         handleClickByListenrType('vOn:on-click', 'on-click')
    //       }
    //       vOn:onClick={() => handleClickByListenrType('vOn:onClick', 'onClick')}
    //       on-click={() => handleClickByListenrType('on-click', 'click')}
    //       on-on-click={() =>
    //         handleClickByListenrType('on-on-click', 'on-click')
    //       }
    //       onClick={() => handleClickByListenrType('onClick', 'click')}
    //       onOnClick={() => handleClickByListenrType('onOnClick', 'onClick')}
    //     ></Event>
    //   </div>
    // );
  },
};
</script>
```



#### vue3

```vue
<script lang="jsx">
import { defineComponent } from 'vue';
import { h } from 'vue';
import Event from './components/Event.vue';
export default defineComponent({
  name: 'EventApp',
  setup() {
    const handleClickByListenrType = (listenEventName, realEventName) => {
      console.log(
        `listenEventName: ${listenEventName} -->  vue real emit event name:  ${realEventName}`
      );
    };
    // 由于 Event 上没有声明对应的 emits, 因此根据 vue3 文档的描述, vue3 会将其同时作为原生事件添加到 Event 模板中的根元素上
    // 参考: https://v3-migration.vuejs.org/zh/breaking-changes/v-on-native-modifier-removed.html#_3-x-%E8%AF%AD%E6%B3%95
    // https://cn.vuejs.org/guide/components/attrs.html#v-on-listener-inheritance

    // 因此你会发现如果被添加到根元素上的原生事件名是合法的话，那么就会触发两次
    // 比如第一个 onClick 会给 Event 的根元素 div 上调用 window.addEventListener('click')
    // 比如第二个 onOnClick 会给 Event 的根元素 div 上调用 window.addEventListener('on-click'), 记住这里不是 window.addEventListener('onClick')

    // 在 vue3 中对 emit(eventName) 做了很多的处理, 比如 emit('click'), emit('on-click') emit('onClick') 都能触发 父组件的 onClick: handleClick
    // return () =>
    //   h(Event, {
    //     onClick: () =>
    //       handleClickByListenrType('onClick', 'click; on-click; onClick'),
    //     onOnClick: () => handleClickByListenrType('onOnClick', 'onClick'),
    //   });

    // 在 vue3 的 jsx 中对 emit(eventName) 也做了很多的处理, 比如 emit('click'), emit('on-click') emit('onClick') 都能触发 父组件的 onClick: handleClick
    // 但是有区别的是这里不接受监听 kebab 的事件名称, 也就是说 on-click 不会被 emit('on-click') 或者 emit('onClick') 触发
    return () => (
      <>
        <Event
          on-click={() => handleClickByListenrType('on-click', '无法触发')}
          on-on-click={() =>
            handleClickByListenrType('on-on-click', '无法触发')
          }
          onClick={() =>
            handleClickByListenrType('onClick', 'click; onClick; on-click')
          }
          onOnClick={() => handleClickByListenrType('onOnClick', 'onClick')}
        ></Event>
      </>
    );
  },
});
</script>
```



## Vue2 和 Vue3 的差异

> 参考：https://v3-migration.vuejs.org

### slots

> 参考：
>
> [vue2 render - slots](https://v2.cn.vuejs.org/v2/guide/render-function.html#%E6%8F%92%E6%A7%BD)
>
> [vue3 render - slots](https://cn.vuejs.org/guide/extras/render-function.html#rendering-slots)
>
> https://v3-migration.vuejs.org/breaking-changes/slots-unification.html

#### 概览

相比于`vue2`, `vue3`中统一了普通插槽和作用域插槽:

1. 在`vue3`中移除了`this.$scopedSlots`，现在统一改为了`this.$slots`;

2. `vue3`中`this.$slots`对象中属性的值现在都是函数，函数的返回值才是具体的插槽对应的`VNode`；

   而`vue2`中`this.$slots`对象中属性的值直接就是插槽对应的`VNode`，只有在`this.$scopedSlots`中才和`vue3`中`this.$slots`行为表现一致；

因此最佳实践就是在`vue2`中使用`this.$scopedSlots`，在`vue3`中使用`this.$slots`。



#### Vue2 示例

```vue
<!-- MessageFather.vue 父组件传递插槽 -->
<!-- <template>
  <Message message="message">
    在子组件中通过 $slots 引用 
    <template v-slot:default> message </template>
    在子组件中通过 $scopedSlots 引用 
    <template v-slot:footer="slotProps"> {{ slotProps.text }} </template>
  </Message>
</template> -->

<script lang="jsx">
import { defineComponent } from '@vue/composition-api';
import Message from './Message.vue';
export default defineComponent({
  components: {
    Message,
  },
  render(h) {
    // 非 jsx
    return h(
      Message,
      {
        // props
        props: {
          message: 'message',
        },
        // 父组件传递插槽, 子组件通过 this.$scopedSlots 引用
        scopedSlots: {
          // 通过作用域插槽的方式传递具名插槽
          // default: () => 'message',
          footer: (slotProps) => slotProps.text,
        },
        // 通过普通插槽传递具名插槽, 子组件通过 this.$slots 引用
        // 它会将子组件当作对应的插槽插入到子组件中
        slot: 'default',
      },
      'message'
    );
    // jsx
    // return (
    //   <Message
    //     message="message"
    //     // 父组件传递插槽, 子组件通过 this.$scopedSlots 引用
    //     scopedSlots={{
    //       // 通过作用域插槽的方式传递具名插槽
    //       // default: () => 'message',
    //       footer: (slotProps) => slotProps.text,
    //     }}
    //     // 通过普通插槽传递具名插槽, 子组件通过 this.$slots 引用
    //     // // 它会将子组件当作对应的插槽插入到子组件中
    //     slot="default"
    //   >
    //     message
    //   </Message>
    // );
  },
});
</script>
```



```js
// Message.vue  子组件引用插槽

console.log(this.$slots)
{
  default: [VNode]
}

console.log(this.$scopedSlots)
{
  default: () => VNode,
  footer: (slotPorps) => VNode
}
```





#### Vue3 示例

```vue
<!-- MessageFather.vue 父组件传递插槽 -->

<!-- 
<template>
  <Message message="message">
    在子组件中通过 $slots 引用 
    <template v-slot:default> message </template>
    在子组件中通过 $slots 引用 
    <template v-slot:footer="slotProps"> {{ slotProps.text }} </template>
  </Message>
</template> 
-->

<script lang="jsx">
import { defineComponent, h } from 'vue';
import Message from './Message.vue';
export default defineComponent({
  components: {
    Message,
  },
  render() {
    // 非 jsx
    return h(
      Message,
      {
        // props
        message: 'message',
        // difference about vue2.x, vue3 dont`t have these option
        // slot: 'default',
        // scopedSlots: {
        //   // 通过作用域插槽的方式传递具名插槽
        //   default: () => 'message',
        //   footer: (slotProps) => slotProps.text,
        // },
      },
      {
        // 父组件传递插槽
        default: () => 'message',
        footer: (slotProps) => slotProps.text,
      }
    );
    // jsx
    // return (
    //   <Message message="message">
    //     {{
    //       default: () => 'message',
    //       footer: (slotProps) => slotProps.text,
    //     }}
    //   </Message>
    // );
  },
});
</script>
```



```js
// Message.vue  子组件引用插槽

// 这里的 $slots 是一个 Proxy 对象
console.log(this.$slots)
{
  default: () => VNode,
  footer: (slotPorps) => VNode
}

console.log(this.$scopedSlots) // undefined
```



### 渲染函数

> 参考：https://v3-migration.vuejs.org/breaking-changes/render-function-api.html

#### 概览

1. `h`现在作为`vue`的导出，而不是作为`render(h)`的参数；
2. `Vue3`中，`h(xx, props, xx)`的第二个参数`props`相比于`Vue2`变的扁平化了；

#### Vue2 示例

```vue
<!-- SubmitButtonFather.vue -->
<!-- 
  <template>
    <div>
      <SubmitButton type="primary" :text-size="16">确认</SubmitButton>
    </div>
  </template> 
-->

<script>
import { defineComponent } from '@vue/composition-api';
import SubmitButton from './SubmitButton.vue';
export default defineComponent({
  components: {
    SubmitButton,
  },
  // h 作为 render 的参数
  render(h) {
    return h(SubmitButton, {
      props: {
        type: 'primary',
        textSize: 16,
      },
      scopedSlots: {
        default: () => '确认',
      },
    });
  },
});
</script>
```



```vue
<!-- SubmitButton.vue -->
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'SubmitButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    textSize: {
      type: Number,
      default: 14,
    },
  },
  render(h) {
    const slots = this.$scopedSlots;
    const defaultSlotsVNode = slots.default?.();
    return h(
      'button',
      {
        staticClass: 'button',
        class: { 'is-primary': this.type === 'primary' },
        staticStyle: { color: 'black' },
        style: { fontSize: this.fontSize + 'px' },
        attrs: { id: 'confirm-button-id' },
        on: { click: () => console.log('confirm') },
        key: 'confirm-button-key',
      },
      defaultSlotsVNode
    );
  },
});
</script>

<style scoped>
.is-primary {
  background-color: blue;
  color: white !important;
}
</style>
```



#### Vue3 示例

```js
<!-- SubmitButtonFather.vue -->
<!-- 
  <template>
    <div>
      <SubmitButton type="primary" :text-size="16">确认</SubmitButton>
    </div>
  </template> 
-->

<script>
import { defineComponent } from '@vue/composition-api';
import SubmitButton from './SubmitButton.vue';
export default defineComponent({
  components: {
    SubmitButton,
  },
  render(h) {
    return h(SubmitButton, {
      props: {
        type: 'primary',
        textSize: 16,
      },
      scopedSlots: {
        default: () => '确认',
      },
    });
  },
});
</script>
```



```vue
<!-- SubmitButton.vue -->
<script>
// h 作为 vue 的导出
import { defineComponent, h } from 'vue';
export default defineComponent({
  name: 'SubmitButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    textSize: {
      type: Number,
      default: 14,
    },
  },
  render() {
    const slots = this.$slots;
    const defaultSlotsVNode = slots.default?.();
    return h(
      'button',
      {
        class: ['button', { 'is-primary': this.type === 'primary' }],
        style: [{ color: 'black' }, { fontSize: this.textSize + 'px' }],
        id: 'confirm-button-id',
        onClick: () => console.log('confirm'),
        key: 'confirm-button-key',
      },
      defaultSlotsVNode
    );
  },
});
</script>

<style scoped>
.is-primary {
  background-color: blue;
  color: white !important;
}
</style>
```



## Vue2, Vue2.7, Vue3 如何集成 JSX 和 setup

### Vite

#### Vue2

```json5
// package.json
{
    "dependencies": {
        // setup
        "@vue/composition-api": "^1.6.0",
        "vue": ">=2.0.0 <2.7.0"
    },
    "devDependencies": {
        "vite": "^3.1.0",
        // jsx
        "vite-plugin-vue2": "^2.0.2",
        "vue-template-compiler": ">=2.0.0 <2.7.0"
    }
}
```



```js
// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin as vue2 } from 'vite-plugin-vue2';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname),
    plugins: [
      vue2({
        jsx: true,
        jsxOptions: {
          // https://github.com/vuejs/jsx-vue2/tree/dev/packages/babel-preset-jsx#vuebabel-preset-jsx
          // Cannot read properties of undefined (reading '$createElement')
          compositionAPI: true,
        },
      }),
    ],
  };
});

```



```js
// main.js
import Vue from 'vue';
import App from './App';
import vueCompositionApi from '@vue/composition-api';

Vue.use(vueCompositionApi);

new Vue({
  components: {
    App,
  },
  render: (h) => h(App),
}).$mount('#app');
```



#### Vue2.7

```json5
// package.json
{
    "dependencies": {
        "vue": "~2.7.0"
    },
    "devDependencies": {
        "@vitejs/plugin-vue2": "^1.1.2",
        // jsx
        "@vitejs/plugin-vue2-jsx": "^1.0.2",
        "vite": "^3.1.0"
    }
}
```



```js
// vite.config.js
import { defineConfig } from 'vite';
import vue2Dot7 from '@vitejs/plugin-vue2';
import vue2Dot7Jsx from '@vitejs/plugin-vue2-jsx';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [vue2Dot7(), vue2Dot7Jsx()],
  };
});
```



```js
// main.js
import Vue from 'vue';
import App from './App.vue';

new Vue({
  components: {
    App,
  },
  render: (h) => h(App),
}).$mount('#app');
```



#### Vue3

```json5
// package.json
{
    "dependencies": {
        "vue": "^3.2.38"
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^3.1.0",
        // jsx
        "@vitejs/plugin-vue-jsx": "^2.0.0",
        "vite": "^3.1.0"
    }
}
```





```js
// vite.config.js
import { defineConfig } from 'vite';
import vue3 from '@vitejs/plugin-vue';
import vue3Jsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue3(), vue3Jsx()],
});
```



```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
const rootVueInstance = app.mount('#app');
```



### 总结

`Vue2`解析`JSX`的语法转换插件是：

1. 对于`Babel 7.x`，[@vue/babel-preset-jsx](https://github.com/vuejs/jsx-vue2/tree/dev/packages/babel-preset-jsx)；
2. 对于`Babel 6.x`，[vuejs/babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)；

`Vue3`解析`JSX`的语法转换插件是：[babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx);



我们使用的插件就是对这些`JSX`语法插件进行的封装来适配不同的构建工具罢了。



## 总结

`Vue3`对`JSX`的支持更加的完善，功能更加的强大，`Vue2`对于`JSX`的支持相比于`Vue3`还是有一点差距。

案例代码地址：

`Vue2`: https://stackblitz.com/edit/vitejs-vite-ntqe4g?file=src/main.js

`Vue2.7`: https://stackblitz.com/edit/vitejs-vite-fjbmgu?file=src/main.js

`Vue3`: https://stackblitz.com/edit/vitejs-vite-koursf?file=src/main.js



## 常见问题

在 `jsx` 中使用 `v-model` 或者绑定响应式局部变量时，会出现值的变化无法导致视图出现更新的情况，反过来却可以：

[实际运行效果](https://stackblitz.com/edit/vitejs-vite-geua3r?file=src/App.vue)

```vue
<template>
  <IncreaseButton></IncreaseButton>
  <button @click="func">+1</button>

  <!-- 在模板中绑定变量，双向绑定一切正常 -->
  <div>input: <input v-model="num" /></div>
  <!-- 在 jsx 中绑定变量，只能单向，模板中的 input 输入值可以触发更新，但是如果直接改变 如果直接改变绑定的变量的值却无法触发视图更新 -->
  <div>demo1Input: <demo1 /></div>

  <div>num: {{ num }}</div>
  <div>obj.num: {{ obj.num }}</div>
</template>

<script lang="jsx" setup>
import { ref, reactive } from 'vue';

const obj = reactive({
  num: 0,
});

const num = ref(0);
const func = () => {
  num.value++;
  obj.num++;

  console.log('num.value: ', num.value);
  console.log('obj.num: ', obj.num);
};
const bindNum = (e) => {
  num.value = e.target.value;
  obj.num = e.target.value;
};

// 怀疑是变量无法被 render 函数无法正常的被收集作为这些 jsx 中使用的响应式变量的依赖
// 因此值变化的时候无法触发 render，从而触发视图更新, demo1 中展示的值一直没有发生变化
// 参考: https://github.com/vitejs/vite-plugin-vue2-jsx/issues/7#issuecomment-1241954326
const demo1 = <input value={num.value} onInput={bindNum} />;
const IncreaseButton = <button onClick={func}>+1</button>;
</script>
```

