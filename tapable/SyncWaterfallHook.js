const Hook = require('./Hook');

class SyncWaterfallHook extends Hook {
  call(...args) {
    let index = 0;
    const { taps } = this;
    let prevResult = args;
    while (index < taps.length) {
      const { fn } = taps[index++];
      const res = fn(...prevResult);
      if (res) {
        prevResult.splice(0, 1, res);
      }
    }
    return prevResult[0];
  }
}

module.exports = SyncWaterfallHook;
