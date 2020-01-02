import $ from 'jquery';
import './style.css';

import('./async').then(res => {
  console.log(res.default);
});

console.log($);
