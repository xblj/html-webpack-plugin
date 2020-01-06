const path = require('path');
const cheerio = require('cheerio');
const { SyncWaterfallHook } = require('../../tapable');
const childCompiler = require('./lib/compiler');

const PLUGIN_ID = 'HtmlWebpackPlugin';
class HtmlWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      template: path.join(__dirname, './template.html'),
      filename: 'index.html',
      ...options
    };
  }

  apply(compiler) {
    let compilationPromise;
    this.options.template = this.getFullTemplatePath(
      this.options.template,
      compiler.context
    );
    compiler.hooks.compilation.tap(PLUGIN_ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags = new SyncWaterfallHook(
        ['assetTags']
      );
    });

    compiler.hooks.make.tapAsync(PLUGIN_ID, (compilation, callback) => {
      compilationPromise = childCompiler
        .compileTemplate(
          this.options.template,
          compiler.context,
          this.options.filename,
          compilation
        )
        .then(compilationResult => {
          this.childCompilerHash = compilationResult.hash;
          this.childCompilationOutputName = compilationResult.outputName;
          callback();
          // 编译之后的代码
          return compilationResult.content;
        });
    });

    compiler.hooks.emit.tapAsync(PLUGIN_ID, (compilation, callback) => {
      // const applyPluginsAsyncWaterfall = this.applyPluginsAsyncWaterfall(
      //   compilation
      // );

      let { chunks } = compilation.getStats().toJson();
      // 过滤不需要写入html文件中的chunk
      chunks = this.filterChunks(chunks);

      // 根据过滤后的chunks组装对应的css和js资源:30
      const assets = this.htmlWebpackPluginAssets(chunks);

      (async () => {
        // 等待子编译完成
        let compiledTemplate = await compilationPromise;
        // 直接返回html文件，省略
        let compilationResult = this.evaluateCompilationResult(
          compilation,
          compiledTemplate
        );

        // 执行模板函数，替换模板中的变量
        let html = this.executeTemplate(
          compilationResult,
          chunks,
          assets,
          compilation
        );

        // 根据资源生成要插入到html文件中的标签
        let assetTags = this.generateHtmlTags(assets);

        // 将标签插入到html中
        html = this.injectAssetTagsIntoHtml(html, assetTags);

        // 将需要输出到文件系统的添加到assets上
        compilation.assets[this.childCompilationOutputName] = {
          source: () => html,
          size: () => html.length
        };

        callback();
      })();
    });
  }

  getTemplateParameters(compilation, assets) {
    const { templateParameters } = this.options;
    if (typeof templateParameters === 'function') {
      return templateParameters(compilation, assets, this.options);
    }
    if (typeof templateParameters === 'object') {
      return templateParameters;
    }
    return {};
  }

  /**
   * 执行模板函数，将配置里面的变量插入到html中
   */
  executeTemplate(templateFunction, chunks, assets, compilation) {
    const templateParams = this.getTemplateParameters(compilation, assets);
    const html = templateFunction(templateParams);
    return html;
  }

  evaluateCompilationResult(compilation, source) {
    source = source.replace('var HTML_WEBPACK_PLUGIN_RESULT =', '');
    return eval(source);
  }

  injectAssetTagsIntoHtml(html, assetTags) {
    const { head, body } = assetTags;
    const $ = cheerio.load(html);
    const generateElement = item => {
      let str = `<${item.tagName}`;
      Object.keys(item.attributes).forEach(attr => {
        str += ` ${attr}=${item.attributes[attr]}`;
      });
      if (item.selfClose) {
        // 自闭合标签
        str += ' />';
      } else {
        str += `></${item.tagName}>`;
      }
      return $(str);
    };

    $('head').append(head.map(generateElement));
    $('body').append(body.map(generateElement));

    return $.html();
  }

  generateHtmlTags(assets) {
    const { js, css } = assets;
    const head = css.map(stylePath => {
      return {
        tagName: 'link',
        selfClose: true,
        attributes: {
          href: stylePath,
          rel: 'stylesheet'
        }
      };
    });

    const body = js.map(scriptPath => {
      return {
        tagName: 'script',
        selfClose: false,
        attributes: {
          src: scriptPath,
          type: 'text/javascript'
        }
      };
    });

    return {
      head,
      body
    };
  }

  htmlWebpackPluginAssets(chunks) {
    const assets = {
      js: [],
      css: []
    };

    chunks.forEach(chunk => {
      const { files } = chunk;
      const filterFile = reg => file => reg.test(file);
      const js = files.filter(filterFile(/\.js$/));
      const css = files.filter(filterFile(/\.css$/));
      if (js.length) {
        assets.js.push(...js);
      }

      if (css.length) {
        assets.css.push(...css);
      }
    });
    return assets;
  }

  filterChunks(chunks) {
    return chunks.filter(chunk => {
      const {
        names: [chunkName],
        initial
      } = chunk;
      if (!chunkName || !initial) return false;
      return true;
    });
  }

  getFullTemplatePath(template, context) {
    if (template.indexOf('!') === -1) {
      // 若果没有设置加载模板的loader，那么就使用默认的loader
      template = `${require.resolve('./lib/loader.js')}!${path.resolve(
        context,
        template
      )}`;
    }
    // 将相对路径修改为绝对路径
    return template.replace(
      /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
      (match, prefix, filepath, postfix) =>
        prefix + path.resolve(filepath) + postfix
    );
  }

  applyPluginsAsyncWaterfall(compilation) {
    return (eventName, requiresResult, pluginArgs) => {
      return compilation.hooks[eventName].promise(pluginArgs);
    };
  }
}

module.exports = HtmlWebpackPlugin;
