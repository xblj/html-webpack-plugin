const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 16:8
const PLUGIN_ID = 'HtmlWebpackPlugin';
class HtmlWebpackPlugin {
  apply(compiler) {
    //异步钩子，但是我们的逻辑没有异步操作的话，可以直接写成同步调用
    compiler.hooks.emit.tap(PLUGIN_ID, compilation => {
      let { chunks } = compilation.getStats().toJson();
      // 过滤不需要写入html文件中的chunk
      chunks = this.filterChunks(chunks);

      // 根据过滤后的chunks组装对应的css和js资源
      const assets = this.htmlWebpackPluginAssets(chunks);

      // 获取html摸板内容
      const temp = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');

      // 根据资源生成要插入到html文件中的标签
      const assetTags = this.generateHtmlTags(assets);

      // 将标签插入到html中
      const html = this.injectAssetTagsIntoHtml(temp, assetTags);

      // 将需要输出到文件系统的添加到assets上
      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length
      }

    })
  }

  injectAssetTagsIntoHtml(html, assetTags) {
    const { head, body } = assetTags
    const $ = cheerio.load(html);
    const generateElement = item => {
      let str = `<${item.tagName}`
      Object.keys(item.attributes).forEach(attr => {
        str += ` ${attr}=${item.attributes[attr]}`
      })
      str += `></${item.tagName}>`
      return $(str);
    };

    $('head').append(head.map(generateElement))
    $('body').append(body.map(generateElement))

    return $.html()
  }

  generateHtmlTags(assets) {
    const { js, css } = assets;
    const head = css.map(stylePath => {
      return {
        tagName: 'style',
        attributes: {
          href: stylePath,
          rel: 'stylesheet'
        }
      }
    })

    const body = js.map(scriptPath => {
      return {
        tagName: 'script',
        attributes: {
          src: scriptPath,
          type: 'text/javascript'
        }
      }
    })

    return {
      head,
      body
    }
  }

  htmlWebpackPluginAssets(chunks) {
    const assets = {
      js: [],
      css: [],
    }

    chunks.forEach(chunk => {
      const { files } = chunk;
      const js = files.find(file => /\.js$/.test(file));
      const css = files.filter(file => /.css$/.test(file));
      if (js) {
        assets.js.push(js)
      }

      if (css.length) {
        assets.css.push(css);
      }

    })
    return assets;
  }

  filterChunks(chunks) {
    return chunks.filter(chunk => {
      const { names: [chunkName], initial } = chunk;
      if (!chunkName || !initial) return false
      return true;
    })
  }
}

module.exports = HtmlWebpackPlugin;