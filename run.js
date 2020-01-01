const webpack = require('webpack');
const config = require('./webpack.config')
const fs = require('fs');

const compiler = webpack(config)
compiler.run((err, stats) => {
  console.log(err);

  const statsObj = stats.toJson({
    chunks: true,
    errors: false,
    warnings: false,
    version: false,
    children: false,
    logging: false,
    assetsByChunkName: false,
    assets: false,
    entrypoints: false
  })
  fs.writeFileSync('stats.json', JSON.stringify(statsObj, undefined, 2), 'utf8')
})