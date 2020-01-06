// const loaderUtils = require('loader-utils');
const _ = require('lodash');
module.exports = function(source) {
  const template = _.template(source, { variable: 'data' });
  console.log(template);
  // return `
  //  module.exports = function (templateParams) {
  //    with(templateParams) {
  //      return (${template.source})()
  //    }
  //  }
  // `;

  return `
    var _ = require('!!lodash');
    module.exports = ${template.source}
  `;
};
