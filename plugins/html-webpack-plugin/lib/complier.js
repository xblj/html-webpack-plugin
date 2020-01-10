const path = require('path');
let str = 'a-loader!a-loader!path.js?query=2';
str = str.replace(
  /([!])([^/\\!?]+)($|\?[^!?\n]+$)/,
  (match, prefix, filepath, postfix) => {
    console.log(prefix, filepath, postfix);

    return prefix + path.resolve(filepath) + postfix;
  }
);
console.log(str);
