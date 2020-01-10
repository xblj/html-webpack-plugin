// const btn = document.createElement('button');
// btn.innerText = '点我';

// btn.onclick = function() {
//   import('./async').then(res => {
//     const div = document.createElement('div');
//     div.innerText = res.default;
//     document.body.append(div);
//   });
// };

// document.body.append(btn);

import $ from 'jquery';

const btn = $('<button>点我</button>');
btn.click(() => {
  import('./async').then(res => {
    const div = $(`<div>${res.default}</div>`);
    $(document.body).append(div);
  });
});
$(document.body).append(btn);
