const path = require('path');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
// const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');

module.exports.compileTemplate = function(
  template,
  context,
  outputFilename,
  compilation
) {
  const outputOptions = {
    filename: outputFilename,
    publicPath: compilation.outputOptions.publicPath || ''
  };

  const compilerName = getCompilerName(context, outputFilename);
  // 创建子编译对象
  const childCompiler = compilation.createChildCompiler(
    compilerName,
    outputOptions
  );

  childCompiler.context = context;
  new NodeTemplatePlugin(outputOptions).apply(childCompiler);
  new NodeTargetPlugin().apply(childCompiler);
  // new LibraryTemplatePlugin('HTML_WEBPACK_PLUGIN_RESULT', 'var').apply(
  //   childCompiler
  // );

  new SingleEntryPlugin(this.context, template, undefined).apply(childCompiler);
  new LoaderTargetPlugin('node').apply(childCompiler);
  // childCompiler.hooks.compilation.tap('html-webpack-plugin', compilation => {
  //   if (!compilation.cache[compilerName]) {
  //     compilation.cache[compilerName] = {};
  //   }
  //   compilation.cache = compilation.cache[compilerName];
  // });

  return new Promise((resolve, reject) => {
    childCompiler.runAsChild((err, entries, childCompilation) => {
      if (err) {
        reject(err);
      } else {
        const outputName = compilation.mainTemplate.hooks.assetPath.call(
          outputOptions.filename,
          {
            hash: childCompilation.hash,
            chunk: entries[0]
          }
        );
        resolve({
          hash: entries[0].hash,
          outputName,
          content: childCompilation.assets[outputName].source()
        });
      }
    });
  });
};

/**
 *
 * @param {string} context
 * @param {string} filename
 * @returns {string} 'html-webpack-plugin for "index.html"
 */
function getCompilerName(context, filename) {
  const absolutePath = path.resolve(context, filename);
  const relativePath = path.relative(context, absolutePath);
  return (
    'html-webpack-plugin for "' +
    (absolutePath.length < relativePath.length ? absolutePath : relativePath) +
    '"'
  );
}
