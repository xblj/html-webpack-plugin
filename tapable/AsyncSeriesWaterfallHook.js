const Hook = require('./Hook');

class AsyncSeriesWaterfallHook extends Hook {
  callAsync(...args) {
    const { taps } = this;
    const cb = args.pop();
    let index = 0
    const next = (prevRes) => {
      if (index >= taps.length) {
        cb(null, prevRes)
        return;
      }
      const { fn, type } = taps[index];
      index++;
      if (prevRes) {
        args.splice(0, 1, prevRes)
      }
      if (type === 'sync') {
        const res = fn(...args);
        next(res)
      } else if (type === 'async') {
        fn(...args, (err, data) => {
          next(data)
        })
      } else {
        fn(...args).then(next).catch(cb)
      }
    }
    next(...args)
  }

  promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data)
      })
    })
  }
}

module.exports = AsyncSeriesWaterfallHook;