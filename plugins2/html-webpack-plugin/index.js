const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const ID = 'HtmlWebpackPlugin';
class HtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap(ID, compilation => {
      let { chunks } = compilation.getStats().toJson();
      chunks = this.filterChunks(chunks);
      const assets = this.htmlWebpackPluginAssets(chunks);
      let assetTags = this.generateHtmlTags(assets);
      // 读取模板
      const temp = fs.readFileSync(
        path.resolve(__dirname, 'template.html'),
        'utf8'
      );
      const html = this.injectAssetTagsIntoHtml(temp, assetTags);

      // 将html添加到 输出系统中
      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length
      };
    });
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
    const head = css.map(item => {
      return {
        tagName: 'link',
        selfClose: true,
        attributes: {
          href: item,
          rel: 'stylesheet'
        }
      };
    });

    const body = js.map(item => {
      return {
        tagName: 'script',
        selfClose: false,
        attributes: {
          src: item,
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
      files.forEach(file => {
        if (/\.js$/.test(file)) {
          assets.js.push(file);
        }
        if (/\.css$/.test(file)) {
          assets.css.push(file);
        }
      });
    });

    return assets;
  }
  filterChunks(chunks) {
    return chunks.filter(chunk => {
      const {
        names: [chunkName],
        initial
      } = chunk;
      return !!chunkName && initial;
    });
  }
}

module.exports = HtmlWebpackPlugin;
