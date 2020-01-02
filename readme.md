# webpack 插件原理简述

webpack 插件机制就是发布订阅模式，大体的方式就是：

1. 创建：首先在内部对象上的`hooks`对象上创建相应的钩子

   - 创建`compilation`钩子，[compiler.hooks](./webpack-source/webpack/lib/Compiler.js)line:66

1. 监听：然后再适当的时机将自己的方法注册到钩子，等待 webpack 调用
   - 监听`compilation`钩子， [compiler.hooks.compilation.tap](./webpack-source/webpack/lib/SingleEntryPlugin.js) line:30
1. 触发：webpack 在编译的过程中，调用对于的钩子
   - 触发`compilation`钩子 [compiler.hooks.compilation.call](./webpack-source/webpack/lib/webpack.js) line:631

## 插件书写规范

插件结构很简单，就两条规则：

1. 定义一个类
2. 类有一个`apply`方法

```js
class HelloWebpackPlugin {
  apply(compiler) {
    // todo
  }
}
```

## tapable

webpack 的插件都是基于`tapable`实现的

- tapable 的类型

  - 同步`sync`
  - 异步`async`
    - 串行`series`
    - 并行`parallel`

  | 类型 | 说明 |
  | --- | --- |
  | Basic | 不关心监听函数的返回值 |
  | Bail | 监听的函数有返回值则不会再调用后续的监听函数 |
  | Waterfall | 上一个监听函数的返回值会交给下一个监听函数 |
  | Loop | 如果监听函数返回`true`则这个监听函数会反复执行，直到返回 undefined |

  ![所有钩子](./images/tapable.jpg)

- AsyncSeriesHook

  > 异步并行钩子，根据注册函数顺序依次调用，不关心监听函数的返回值

  - [实现](./tapable/AsyncSeriesHook.js)
  - [测试用例](./test/AsyncSeriesHook.js)

- AsyncSeriesWaterfallHook

  > 异步并行瀑布流钩子，根据注册函数顺序依次调用，上一个监听函数的返回值会作为下一个监听函数的入参

  - [实现](./tapable/AsyncSeriesWaterfallHook.js)
  - [测试用例](./test/AsyncSeriesWaterfallHook.js)

- syncWaterfallHook

  > 同步瀑布流钩子，根据注册函数顺序依次调用，上一个监听函数的返回值会作为下一个监听函数的入参

  - [实现](./tapable/syncWaterfallHook.js)
  - [测试用例](./test/syncWaterfallHook.js)

## 流程

![流程图](./images/流程图.jpg)

[钩子执行流程](./flow.md)

## stats 对象

> 调用 `compiler.run`的回调函数能拿到一个[stats](./stats.json)对象，里面存放了整个编译过程的所有的信息，比较常用的有如下三个：

| 字段    | 含义                   |
| ------- | ---------------------- |
| modules | 记录了所有解析后的模块 |
| chunks  | 记录了所有 chunk       |
| assets  | 记录了所有要生成的文件 |

## 实现 html-webpack-plugin

本实现借鉴[https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)的实现思路，并未完全按照前者实现，也不试用与生产环境，仅仅只为了学习 webpack 插件。

思路：

1. 我们要在构建之后新产生一个`index.html`文件，那么我们必须在 webpack 输出文件到输出目录的时候告诉 webpack 我们需要将`index.html`添加到输出目录中。
2. 那如何告诉 webpack 呢？

   - webpack 的输出文件都会挂载`compilation.assets`上，如果需要添加或者删除文件，可以直接对该属性进行操作，添加文件：

   ```js
   compilation.assets['index.html'] = {
     // content表示index.html文件内容
     source: () => content,
     size: () => content.length,
   };
   ```

3. 知道了如何在输出目录中添加文件，那上面时候添加呢？

   - webpack 在将所有文件编译完成之后会触发`compiler`对象上的`emit`钩子，这是修改增删文件的最后时机，所以我们可以在这个钩子内进行添加

   ```js
   class HtmlWebpackPlugin {
     apply(compiler) {
       compiler.hooks.emit.tap('HtmlWebpackPlugin', compilation => {
         compilation.assets['index.html'] = {
           // content表示index.html文件内容
           source: () => content,
           size: () => content.length,
         };
       });
     }
   }
   ```

4. `content`内容怎么来呢？

   1. 我们可以根据一个[模板](plugins/html-webpack-plugin/template.html)来生成一个基本的 html 内容结构，然后再将`js`和`css`文件添加到内容中

   ```js
   class HtmlWebpackPlugin {
     apply(compiler) {
       compiler.hooks.emit.tap('HtmlWebpackPlugin', compilation => {
         // 获取html摸板内容
         const content = fs.readFileSync(
           path.resolve(__dirname, 'template.ejs'),
           'utf8'
         );
         compilation.assets['index.html'] = {
           // content表示index.html文件内容
           source: () => content,
           size: () => content.length,
         };
       });
     }
   }
   ```

   2. 所有输出的代码块都在`stats`对象的`chunks`属性(可以通过`compilation.getStats().toJson()`拿到)上，我们根据`chunks`的信息，筛选出首屏加载的`js`和`css`文件

   ```js
   class HtmlWebpackPlugin {
     apply(compiler) {
       compiler.hooks.emit.tap('HtmlWebpackPlugin', compilation => {
         // 获取html摸板内容
         const content = fs.readFileSync(
           path.resolve(__dirname, 'template.ejs'),
           'utf8'
         );

         let { chunks } = compilation.getStats().toJson();
         // 过滤不需要写入html文件中的chunk
         chunks = this.filterChunks(chunks);

         compilation.assets['index.html'] = {
           // content表示index.html文件内容
           source: () => content,
           size: () => content.length,
         };
       });
     }
   }
   ```

   3. 然后就比较简单了，就是各种组装`js`和`css`标签

### 参考

[webpack4.0 源码分析之 Tapable](https://juejin.im/post/5abf33f16fb9a028e46ec352)
