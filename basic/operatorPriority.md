[operator priority]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
[operator priority 汇总表]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#汇总表

# 运算符优先级

> 参考：[运算符优先级(MDN)][operator priority]

## 优先级和结合性

示例如下，其中，`OP1` 和 `OP2` 都是操作符的占位符。

`a OP1 b OP2 c`；



如果 `OP1` 和 `OP2` 具有不同的优先级（具体可以参考下一个章节 [运算符优先级汇总表](#运算符优先级汇总表)）。

```js
console.log(3 + 10 * 2);   // 输出 23
console.log(3 + (10 * 2)); // 输出 23 因为这里的括号是多余的
console.log((3 + 10) * 2); // 输出 26 因为括号改变了优先级
```



那什么是结合性呢？

左结合（左到右）相当于把左边的子表达式加上小括号 `(a OP b) OP c`，右结合（右到左）相当于 `a OP (b OP c)`。赋值运算符是右结合的，所以你可以这么写：

```js
a = b = 5; // 相当于 a = (b = 5);
```

预期结果是 `a` 和 `b` 的值都会成为 `5`。这是因为赋值运算符的返回结果就是赋值运算符右边的那个值。

具体过程是：首先 `b` 被赋值为 `5`，然后 `a` 也被赋值为 `b = 5` 的返回值，也就是 `5`。



当多个运算符优先级相等时，这个时候就可以通过结合性来判断表达式的执行顺序了。

比如：

`6 / 3 / 2` 与 `(6 / 3) / 2` 是相同的，因为除法是左结合（左到右）的。而幂运算符是右结合（右到左）的，所以 `2 ** 3 ** 2` 与 `2 ** (3 ** 2)` 是相同的。

因此，`(2 ** 3) ** 2` 会更改执行顺序，它的执行结果也和原表达式`2 ** 3 ** 2`不同。前者是`8 ** 2 === 64`，后者是`2 ** 9 === 512`。



判断表达式的执行顺序还有一个规则，那就是运算符的优先级在结合性之前，比如：

求幂会先于除法，`2 ** 3 / 3 ** 2` 的结果是 `0.8888888888888888`，因为它相当于 `(2 ** 3) / (3 ** 2)`。

## 运算符优先级汇总表

参考：[运算符优先级汇总表(MDN)][operator priority 汇总表]

下面的表格将所有运算符按照优先级的不同从高（`19`）到低（`1`）排列。

请注意，下表中故意不包含[展开语法（Spread syntax）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax) —— 原因可以引用[Stack Overflow 上的一个回答](https://stackoverflow.com/a/48656377)，“[展开语法不是一个运算符](https://stackoverflow.com/q/44934828/1048572)，因此没有优先级。它是数组字面量和函数调用（和对象字面量）语法的一部分。”



<table class="fullwidth-table">
  <tbody>
    <tr>
      <th>优先级</th>
      <th>运算符类型</th>
      <th>结合性</th>
      <th>运算符</th>
    </tr>
    <tr>
      <td>19</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Grouping">分组</a></td>
      <td>n/a（不相关）</td>
      <td><code>( … )</code></td>
    </tr>
    <tr>
      <td rowspan="5">18</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#%E7%82%B9%E5%8F%B7%E8%A1%A8%E7%A4%BA%E6%B3%95">成员访问</a></td>
      <td>从左到右</td>
      <td><code>… . …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#%E6%96%B9%E6%8B%AC%E5%8F%B7%E8%A1%A8%E7%A4%BA%E6%B3%95">需计算的成员访问</a></td>
      <td>从左到右</td>
      <td><code>… [ … ]</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/new"><code>new</code></a>（带参数列表）</td>
      <td>n/a</td>
      <td><code>new … ( … )</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Guide/Functions">函数调用</a></td>
      <td>从左到右</td>
      <td><code>… ( <var>… </var>)</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining">可选链（Optional chaining）</a></td>
      <td>从左到右</td>
      <td><code>?.</code></td>
    </tr>
    <tr>
      <td>17</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/new"><code>new</code></a>（无参数列表）</td>
      <td>从右到左</td>
      <td><code>new …</code></td>
    </tr>
    <tr>
      <td rowspan="2">16</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators#%E8%87%AA%E5%A2%9E%E5%92%8C%E8%87%AA%E5%87%8F">后置递增</a></td>
      <td rowspan="2">n/a</td>
      <td><code>… ++</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators#%E8%87%AA%E5%A2%9E%E5%92%8C%E8%87%AA%E5%87%8F">后置递减</a></td>
      <td><code>… --</code></td>
    </tr>
    <tr>
      <td rowspan="10">15</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_NOT">逻辑非 (!)</a></td>
      <td rowspan="10">从右到左</td>
      <td><code>! …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT">按位非 (~)</a></td>
      <td><code>~ …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Unary_plus">一元加法 (+)</a></td>
      <td><code>+ …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Unary_negation">一元减法 (-)</a></td>
      <td><code>- …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators#%E8%87%AA%E5%A2%9E%E5%92%8C%E8%87%AA%E5%87%8F">前置递增</a></td>
      <td><code>++ …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators#%E8%87%AA%E5%A2%9E%E5%92%8C%E8%87%AA%E5%87%8F">前置递减</a></td>
      <td><code>-- …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof"><code>typeof</code></a></td>
      <td><code>typeof …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/void"><code>void</code></a></td>
      <td><code>void …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/delete"><code>delete</code></a></td>
      <td><code>delete …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/await"><code>await</code></a></td>
      <td><code>await …</code></td>
    </tr>
    <tr>
      <td>14</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Exponentiation">幂 (**)</a></td>
      <td>从右到左</td>
      <td><code>… ** …</code></td>
    </tr>
    <tr>
      <td rowspan="3">13</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Multiplication">乘法 (*)</a></td>
      <td rowspan="3">从左到右</td>
      <td><code>… * …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Division">除法 (/)</a></td>
      <td><code>… / …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Remainder">取余 (%)</a></td>
      <td><code>… % …</code></td>
    </tr>
    <tr>
      <td rowspan="2">12</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Addition">加法 (+)</a></td>
      <td rowspan="2">从左到右</td>
      <td><code>… + …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Subtraction">减法 (-)</a></td>
      <td><code>… - …</code></td>
    </tr>
    <tr>
      <td rowspan="3">11</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift">按位左移 (&lt;&lt;)</a></td>
      <td rowspan="3">从左到右</td>
      <td><code>… &lt;&lt; …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Right_shift">按位右移 (&gt;&gt;)</a></td>
      <td><code>… &gt;&gt; …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift">无符号右移 (&gt;&gt;&gt;)</a></td>
      <td><code>… &gt;&gt;&gt; …</code></td>
    </tr>
    <tr>
      <td rowspan="6">10</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Less_than">小于 (&lt;)</a></td>
      <td rowspan="6">从左到右</td>
      <td><code>… &lt; …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Less_than_or_equal">小于等于 (&lt;=)</a></td>
      <td><code>… &lt;= …</code></td>
    </tr>
    <tr>
      <td><a href="/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than">大于 (&gt;)</a></td>
      <td><code>… &gt; …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Greater_than_or_equal">大于等于 (&gt;=)</a></td>
      <td><code>… &gt;= …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/in"><code>in</code></a></td>
      <td><code>… in …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof"><code>instanceof</code></a></td>
      <td><code>… instanceof …</code></td>
    </tr>
    <tr>
      <td rowspan="4">9</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality">相等 (==)</a></td>
      <td rowspan="4">从左到右</td>
      <td><code>… == …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Inequality">不相等 (!=)</a></td>
      <td><code>… != …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality">一致/严格相等 (===)</a></td>
      <td><code>… === …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_inequality">不一致/严格不相等 (!==)</a></td>
      <td><code>… !== …</code></td>
    </tr>
    <tr>
      <td>8</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND">按位与 (&amp;)</a></td>
      <td>从左到右</td>
      <td><code>… &amp; …</code></td>
    </tr>
    <tr>
      <td>7</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR">按位异或 (^)</a></td>
      <td>从左到右</td>
      <td><code>… ^ …</code></td>
    </tr>
    <tr>
      <td>6</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR">按位或 (|)</a></td>
      <td>从左到右</td>
      <td><code>… | …</code></td>
    </tr>
    <tr>
      <td>5</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND">逻辑与 (&amp;&amp;)</a></td>
      <td>从左到右</td>
      <td><code>… &amp;&amp; …</code></td>
    </tr>
    <tr>
      <td rowspan="2">4</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR">逻辑或 (||)</a></td>
      <td>从左到右</td>
      <td><code>… || …</code></td>
    </tr>
    <tr>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator">空值合并 (??)</a></td>
      <td>从左到右</td>
      <td><code>… ?? …</code></td>
    </tr>
    <tr>
      <td>3</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator">条件（三元）运算符</a></td>
      <td>从右到左</td>
      <td><code>… ? … : …</code></td>
    </tr>
    <tr>
      <td rowspan="16">2</td>
      <td rowspan="16"><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators#赋值运算符">赋值</a></td>
      <td rowspan="16">从右到左</td>
      <td><code>… = …</code></td>
    </tr>
    <tr>
      <td><code>… += …</code></td>
    </tr>
    <tr>
      <td><code>… -= …</code></td>
    </tr>
    <tr>
      <td><code>… **= …</code></td>
    </tr>
    <tr>
      <td><code>… *= …</code></td>
    </tr>
    <tr>
      <td><code>… /= …</code></td>
    </tr>
    <tr>
      <td><code>… %= …</code></td>
    </tr>
    <tr>
      <td><code>… &lt;&lt;= …</code></td>
    </tr>
    <tr>
      <td><code>… &gt;&gt;= …</code></td>
    </tr>
    <tr>
      <td><code>… &gt;&gt;&gt;= …</code></td>
    </tr>
    <tr>
      <td><code>… &amp;= …</code></td>
    </tr>
    <tr>
      <td><code>… ^= …</code></td>
    </tr>
    <tr>
      <td><code>… |= …</code></td>
    </tr>
    <tr>
      <td><code>… &amp;&amp;= …</code></td>
    </tr>
    <tr>
      <td><code>… ||= …</code></td>
    </tr>
    <tr>
      <td><code>… ??= …</code></td>
    </tr>
    <tr>
      <td>1</td>
      <td><a href="/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_Operator">逗号 / 序列</a></td>
      <td>从左到右</td>
      <td><code>… , …</code></td>
    </tr>
  </tbody>
</table>




## new 带参数列表和不带参数列表

根据运算符优先级汇总表我们得知，`new ...(...)`带参数列表，比`new ...`不带参数的列表的优先级更高，这两者到底如何区分呢？

```js
function Person() {}
// new ... 不带参数列表
const person1 = new Person
// new ...(...) 带参数列表
const person2 = new Person()


Person.prototype.run = function() {}

// new ... 不带参数列表
new Person.run  // --> new (Person.run)

// new ...(...) 带参数列表
new Person.run() // --> (new (Person.run)())  这里要注意的是 run 后面的括号不能看作函数调用，而要看作 new ... (...) 带参数
```



因此这里我们总结一下，什么叫`new ...(...)`带参数列表呢？

只要`new`后面的表达式有一个括号`()`，那么这里就能看作`new ...(...)`带参数列表。

如果`new`后面的表达式没有括号`()`，那么这里就能看作`new ...`不带参数列表。

其中带参数列表的优先级比不带参数列表的优先级更高。



之前看过别的文章，有的说`new Person.run()`应该看作`new ...`不带参数列表，因此按照运算符的优先级划分，`'new ...`不带参数列表的优先级比 `... . ...` 访问对象属性， `...(...)` 函数调用都要低。

因此上述表达式等同于：`new ((Person.run)())`。

上述表达式执行顺序会划分为如下三步：

1. `const run = Person.run`；
2. `const res = run()`；
3. `new res --> new undefined`；

这里浏览器的报错就会变为：`Uncaught TypeError: undefined is not a constructor`。



但是你去实际运行一下`new Person.run()`就会发现实际报错是：

`Uncaught TypeError: Person.run is not a constructor`。



这里我们反推一下执行顺序就能知道这里的`new`应该看作`new ...(...)`带参数列表。

参考运算符优先级对照表得知，`new ...(...)`带参数列表的优先级和 `... . ...` 访问对象属性， `...(...)` 函数调用相同，那么这里就需要判断结合性。

首先得知`new ...(...)`带参数的结合性是`n\a`，也就是直接将其当作一个整体即可：

`new Person.run() --> (new Person.run())`；

也就是说这里最后的括号不能看作`...(...)` 函数调用，而应该看作`new ...(...)`带参数。



然后`... . ...` 访问对象属性的结合性是从左到右，因此可以看作：

`(new Person.run()) --> (new (Person.run)())`；

最终我们推测出该表达式的执行顺序为：

1. `const run = Person.run`；
2. `new run()`

因此报错就为`Uncaught TypeError: Person.run is not a constructor`。