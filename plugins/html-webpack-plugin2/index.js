const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const ejs = require('ejs');
const PLUGIN_ID = 'HtmlWebpackPlugin';

class HtmlWebpackPlugin {
  apply(compiler) {
    // 监听文件输入钩子
    compiler.hooks.emit.tap(PLUGIN_ID, compilation => {
      // 获取所有的chunk
      let { chunks } = compilation.getStats().toJson();
      chunks = this.filterChunks(chunks);

      let assets = this.htmlWebpackPluginAssets(compilation, chunks);

      let html = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');

      // 根据静态资源生成标签对象
      const assetTags = this.generateHtmlTags(assets);

      // 将标签插入到html
      html = this.injectAssetsIntoHtml(html, assetTags);

      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length
      }
    })
  }

  injectAssetsIntoHtml(html, assetTags) {
    const $ = cheerio.load(html);
    const { head, body } = assetTags;
    const generateElement = item => {
      let str = `<${item.tagName}`;
      Object.keys(item.attributes).forEach(attr => {
        str += ` ${attr}=${item.attributes[attr]}`;
      })
      str += `></${item.tagName}>`
      return str
    };

    $('head').append(head.map(generateElement))
    $('body').append(body.map(generateElement))

    return $.html()
  }

  generateHtmlTags(assets) {
    const { js, css } = assets;
    const body = js.map(scriptPath => {
      return {
        tagName: 'script',
        attributes: {
          type: 'text/javascript',
          src: scriptPath
        }
      }
    })

    const head = css.map(stylePath => {
      return {
        tagName: 'style',
        attributes: {
          rel: 'stylesheet',
          href: stylePath
        }
      }
    })

    return {
      body,
      head
    }
  }

  htmlWebpackPluginAssets(compilation, chunks) {
    const assets = {
      js: [],
      css: []
    }

    chunks.forEach(chunk => {
      const chunkFiles = [].concat(chunk.files);
      const js = chunkFiles.find(chunkFile => /\.js$/.test(chunkFile))
      if (js) {
        assets.js.push(js)
      }
      const css = chunkFiles.filter(chunkFile => /\.css$/.test(chunkFile))
      if (css && css.length) {
        assets.css.push(...css)
      }

    })
    return assets;
  }

  filterChunks(chunks) {
    return chunks.filter(chunk => {
      // 获取chunk的name
      const [name] = chunk.names;
      const { initial } = chunk;
      if (!name || !initial) return false;
      return true
    })
  }
}

module.exports = HtmlWebpackPlugin;