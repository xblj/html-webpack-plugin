const path = require('path');
const HtmlWebpackPlugin = require('./plugins/html-webpack-plugin3')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoExternalWebpackPlugin = require('./plugins/auto-external-webpack-plugin')
const FlowWebpackPlugin = require('./plugins/flow-webpack-plugin');

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
    // new FlowWebpackPlugin(),
    // new HtmlWebpackPlugin(),
    // new MiniCssExtractPlugin(),
    // new AutoExternalWebpackPlugin({
    //   react: {
    //     variable: 'React',
    //     src: 'http://react.com',
    //   },
    //   'react-dom': {
    //     variable: 'ReactDOM',
    //     src: 'http://react-dom.com'
    //   }
    // })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  }
}