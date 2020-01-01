const PLUGIN_ID = 'AutoExternalWebpackPlugin'

class AutoExternalWebpackPlugin {
  constructor() { }
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(PLUGIN_ID, assetsTags => {
        console.log(assetsTags);

        return {
          ...assetsTags,
          body: [{
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
              src: 'http:baidu.com'
            }
          }, ...assetsTags.body]
        }
      })
    })
  }
}

module.exports = AutoExternalWebpackPlugin;