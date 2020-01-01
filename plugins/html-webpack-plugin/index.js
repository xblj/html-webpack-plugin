const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { SyncWaterfallHook } = require('tapable')
const PLUGIN_ID = 'HtmlWebpackPlugin';

class HtmlWebpackPlugin {
  constructor(options) {
    this.options = {
      template: path.resolve(__dirname, 'template.ejs'),
      ...options
    }
  }
  apply(compiler) {
    const { template } = this.options;
    compiler.hooks.compilation.tap(PLUGIN_ID, compilation => {
      // 生成资源后，添加到html文件之前
      compilation.hooks.htmlWebpackPluginAlterAssetTags = new SyncWaterfallHook(['pluginArgs'])
    });

    // 监听compiler的emit钩子
    compiler.hooks.emit.tapAsync(PLUGIN_ID, (compilation, callback) => {
      const chunkOnlyConfig = {
        // 所有代码块
        chunks: true,
        // 所有输出的文件资源
        assets: false,
        cached: false,
        children: false,
        chunkModules: false,
        chunkOrigins: false,
        errorDetails: false,
        hash: false,
        modules: false,
        reasons: false,
        source: false,
        timings: false,
        version: false,
      }
      // 获取所有的代码块
      let { chunks } = compilation.getStats().toJson(chunkOnlyConfig);
      // 需要过滤出不需要写入到html文件中的代码块
      chunks = this.filterChunks(chunks);

      // 根据chunks获取所有的静态资源
      let assets = this.htmlWebpackPluginAssets(compilation, chunks);
      // 获取html模板
      let htmlTpl = ejs.render(fs.readFileSync(template, 'utf8'));
      // 获取style和script标签
      let assetTags = this.generateHtmlTags(assets);
      assetTags = compilation.hooks.htmlWebpackPluginAlterAssetTags.call(assetTags)

      // 将style和script标签插入到html中
      const html = this.injectAssetsIntoHtml(htmlTpl, assets, {
        body: assetTags.body,
        head: assetTags.head
      });

      // 将html添加到compilation的输入资源中
      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length
      }
      callback()
    })
  }

  /**
   * 
   * 将资源插入到html中
   */
  injectAssetsIntoHtml(html, assets, assetTags) {
    const $ = cheerio.load(html);
    const { body, head } = assetTags;
    const generateElement = item => {
      let str = `<${item.tagName}`;
      Object.keys(item.attributes).forEach(key => {
        str += ` ${key}=${item.attributes[key]}`;
      })
      str += `></${item.tagName}>`;
      return $(str);
    }
    $('head').append(head.map(generateElement))

    $('body').append(body.map(generateElement))
    // 最终的html
    return $.html();
  }

  /**
   * 生成html标签的对象
   */
  generateHtmlTags(assets) {
    const scripts = assets.js.map(scriptPath => ({
      tagName: 'script',
      attributes: {
        type: 'text/javascript',
        src: scriptPath
      }
    }))
    const styles = assets.css.map(stylePath => ({
      tagName: 'link',
      attributes: {
        href: stylePath,
        rel: 'stylesheet'
      }
    }))

    return {
      head: [].concat(styles),
      body: [].concat(scripts)
    }
  }

  /**
   * 过滤不需要的chunks
   */
  filterChunks(chunks) {
    return chunks.filter(chunk => {
      const [chunkName] = chunk.names
      // 没有名字和不是初次加载的代码块不需要写入到页面中
      if (!chunkName || !chunk.initial) return false;
      return true
    })
  }

  /**
   * 
   */
  htmlWebpackPluginAssets(compilation, chunks) {
    const assets = {
      chunks: {},
      js: [],
      css: []
    }
    chunks.forEach(chunk => {
      const [chunkName] = chunk.names;
      assets.chunks[chunkName] = {};
      // 处理非根路径资源
      const chunkFiles = [].concat(chunk.files).map(chunkFile => this.getOutputName(compilation, chunkFile))
      // 获取所有的js文件
      const js = chunkFiles.find(chunkFile => /\.js$/.test(chunkFile));
      if (js) {
        assets.chunks[chunkName] = {
          size: chunk.size,
          entry: js,
          hash: chunk.hash
        }
        assets.js.push(js)
      }

      // const css = chunkFiles.filter(chunkFile => /\.css$/.test(chunkFile));
      // assets.chunks[chunkName].css = css;
      // assets.css = assets.css.concat(css)

    })

    return assets;
  }

  getOutputName(compilation, chunkFile) {
    const { publicPath = '/' } = compilation.outputOptions
    return `${publicPath}/${chunkFile}`.replace('//', '/')
  }
}

module.exports = HtmlWebpackPlugin;