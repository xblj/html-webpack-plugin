// import $ from 'jquery';
// import './style.css';

// const btn = document.createElement('button');
// btn.innerText = '点我';

// btn.onclick = function() {
//   import('./async').then(res => {
//     console.log(res.default);
//   });
// };

// document.body.append(btn);

const btn = $('<button>点我</button>');
btn.click(function() {
  // import('./async').then(res => {
  //   console.log(res.default);
  // });
  console.log(12);
  
});
$('body').append(btn);
