const { SyncLoopHook } = require('tapable');

let hook = new SyncLoopHook(['name', 'age']);
let counter1 = 0;
let counter2 = 0;
hook.tap('1', () => {
  console.log(1, 'counter1', counter1);
  if (++counter1 == 1) {
    counter1 = 0;
    return;
  }
  return true;
});
hook.tap('2', () => {
  console.log(2, 'counter2', counter2);
  if (++counter2 == 2) {
    counter2 = 0;
    return;
  }
  return true;
});

hook.call('zs', 10);
