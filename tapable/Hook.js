class Hook {
  constructor() {
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push({
      type: 'sync',
      fn
    })
  }

  tapAsync(name, fn) {
    this.taps.push({
      type: 'async',
      fn
    })
  }

  tapPromise(name, fn) {
    this.taps.push({
      type: 'promise',
      fn
    })
  }

  callAsync() {
    throw new Error('子类未实现该方法')
  }

  promise() {
    throw new Error('子类未实现该方法')
  }
}

module.exports = Hook;
