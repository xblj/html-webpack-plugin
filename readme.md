# webpack 插件原理简述

webpack 插件机制就是发布订阅模式，大体的方式就是：

1. 创建：首先在内部对象上的`hooks`对象上创建相应的钩子
1. 监听：然后再适当的时机将自己的方法注册到钩子，等待 webpack 调用
1. 触发：webpack 在编译的过程中，调用对于的钩子

## tapable

webpack 的插件都是基于`tapable`实现的

## tapable 的类型

- 同步`sync`
- 异步`async`
  - 并行`series`
  - 串行`parallel`

| 类型 | 说明 |
| --- | --- |
| Basic | 不关心监听函数的返回值 |
| Bail | 监听的函数有返回值则不会再调用后续的监听函数 |
| Waterfall | 上一个监听函数的返回值会交给下一个监听函数 |
| Loop | 如果监听函数返回`true`则这个监听函数会反复执行，直到返回 undefined |

## AsyncSeriesHook

> 异步并行钩子，根据注册函数顺序依次调用，不关心监听函数的返回值

- [实现](./tapable/AsyncSeriesHook.js)
- [测试用例](./test/AsyncSeriesHook.js)

## AsyncSeriesWaterfallHook

> 异步并行瀑布流钩子，根据注册函数顺序依次调用，上一个监听函数的返回值会作为下一个监听函数的入参

- [实现](./tapable/AsyncSeriesWaterfallHook.js)
- [测试用例](./test/AsyncSeriesWaterfallHook.js)

## 流程

![流程图](./images/流程图.jpg)
