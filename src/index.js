
const btn = document.createElement('button');
btn.innerText = '点我';

btn.onclick = function() {
  import('./async').then(res => {
    console.log(res.default);
  });
};

document.body.append(btn);

