const { AsyncSeriesHook } = require('../tapable');

const queue = new AsyncSeriesHook(['name']);

const id = 'async';
queue.tap(id, function(name) {
  console.log('tap', name);
});

queue.tapPromise(id, function(name) {
  console.log('tapPromise', name);
  return new Promise(resolve => {
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
  console.log(res);
});
