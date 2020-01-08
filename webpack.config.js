const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPlugin = require('./plugins/html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const AutoExternalWebpackPlugin = require('./plugins/auto-external-webpack-plugin');
// const FlowWebpackPlugin = require('./plugins/flow-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'dist'
  },
  plugins: [
    // 打印compiler和compilation上的所有钩子调用顺序
    // new FlowWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('./index.html'),
      // filename: '[hash:8].html',
      filename: 'index.html',
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          foo: 'bar'
        };
      }
    })
    // new MiniCssExtractPlugin()
    // new AutoExternalWebpackPlugin({
    //   jquery: {
    //     variable: 'jQuery',
    //     src: 'https://cdn.bootcss.com/jquery/3.4.1/jquery.js'
    //   }
    // })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  }
};
