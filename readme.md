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

> 异步串行钩子，监听函数会一个一个依次执行

```js
class AsyncSeriesHook {
  constructor() {
    this.taps = [];
  }

  /**
   * 同步注册
   */
  tap(name, fn) {
    this.taps.push({
      type: 'sync',
      fn,
    });
  }

  /**
   * 异步注册
   */
  tapAsync(name, fn) {
    this.taps.push({
      type: 'async',
      fn,
    });
  }

  /**
   * promise注册
   */
  tapPromise(name, fn) {
    this.taps.push({
      type: 'promise',
      fn,
    });
  }

  /**
   * 异步回调
   */
  callAsync(...args) {
    const cb = args.pop();
    const next = index => {
      if (index >= this.taps.length) {
        return cb();
      }
      const { fn, type } = this.taps[index];
      index++;
      if (type === 'sync') {
        // 同步注册的监听函数同步调用
        fn(...args);
        next(index);
      } else if (type === 'async') {
        // 异步注册的函数通过回调调用下一个监听函数
        fn(...args, err => {
          if (err) return cb(err);
          next(index);
        });
      } else {
        // Promise
        fn(...args)
          .then(() => next(index))
          .catch(cb);
      }
    };
    next(0);
  }

  /**
   * 通过promise调用
   */
  promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, err => {
        if (err) {
          return reject(err);
        }
        resolve(null);
      });
    });
  }
}
```

- 测试用例

```js
const queue = new AsyncSeriesHook(['name']);
const id = 'async';
queue.tap(id, function(name, cb) {
  console.log('tap', name);
});

queue.tapPromise(id, function(name) {
  console.log('tapPromise', name);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
});

queue.tapAsync(id, function(name, cb) {
  console.log('tapAsync', name);
  cb();
});

queue.promise('haha').then(res => {
  console.log('over');
});

queue.callAsync('haha', err => {
  console.log('over');
});
```
