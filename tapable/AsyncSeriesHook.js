// const { AsyncSeriesHook } = require('tapable')
const Hook = require('./Hook');

class AsyncSeriesHook extends Hook {
  callAsync(...args) {
    const cb = args.pop();
    const next = (index) => {
      if (index >= this.taps.length) {
        return cb()
      }
      const { fn, type } = this.taps[index];
      index++
      if (type === 'sync') {
        // 同步注册的监听函数同步调用
        fn(...args);
        next(index);
      } else if (type === 'async') {
        // 异步注册的函数通过回调调用下一个监听函数
        fn(...args, (err) => {
          if (err) return cb(err)
          next(index)
        })
      } else {
        // Promise
        fn(...args).then(() => next(index)).catch(cb)
      }
    }
    next(0)
  }

  promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err) => {
        if (err) {
          return reject(err)
        }
        resolve(null)
      })
    })
  }
}

module.exports = AsyncSeriesHook;
