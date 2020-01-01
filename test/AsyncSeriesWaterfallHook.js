const { AsyncSeriesWaterfallHook } = require('tapable')
// const { AsyncSeriesWaterfallHook } = require('../tapable')

let queue = new AsyncSeriesWaterfallHook(['name', 'age']);
console.time('cost');

// 测试同步
queue.tap('1', function (name, age) {
  console.log(1, name, age);
  return 'return1';
});
// queue.tap('2', function (data, age) {
//   console.log(2, data, age);
//   return 'return2';
// });
// queue.tap('3', function (data, age) {
//   console.log(3, data, age);
// });
// queue.callAsync('med', 5, err => {
//   console.log(err);
//   console.timeEnd('cost');
// });

// 测试异步回调
// queue.tapAsync('1', function (name, age, callback) {
//   setTimeout(function () {
//     console.log(1, name, age);
//     callback(null, 1);
//   }, 1000)
// });


queue.tapAsync('2', function (data, age, callback) {
  setTimeout(function () {
    console.log(2, data, age);
    callback(null, 2);
  }, 2000)
});
// queue.tapAsync('3', function (data, age, callback) {
//   setTimeout(function () {
//     console.log(3, data, age);
//     callback(null, 3);
//   }, 3000)
// });
// queue.callAsync('med', 5, (err, data) => {
//   console.log(err, data);
//   console.timeEnd('cost');
// });

// 测试promise
// queue.tapPromise('1', function (name) {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log(name, 1);
//       resolve(1);
//     }, 1000);
//   });
// });
// queue.tapPromise('2', function (data) {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log(data, 2);
//       resolve(2);
//     }, 2000);
//   });
// });
queue.tapPromise('3', function (data) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(data, 3);
      resolve(3);
    }, 3000);
  });
});
queue.promise('med', 5).then(err => {
  console.timeEnd('cost');
});