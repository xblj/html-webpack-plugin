const stats = {
  // 编译过程中出现的错误
  errors: [
    "./src/index.js\nModule not found: Error: Can't resolve 'jquery' in '/Users/xiebing/learn/share/html-webpack-plugin/src'\nresolve 'jquery' in '/Users/xiebing/learn/share/html-webpack-plugin/src'\n  Parsed request is a module\n  using description file: /Users/xiebing/learn/share/html-webpack-plugin/package.json (relative path: ./src)\n    Field 'browser' doesn't contain a valid alias configuration\n    resolve as module\n      /Users/xiebing/learn/share/html-webpack-plugin/src/node_modules doesn't exist or is not a directory\n      /Users/xiebing/learn/share/node_modules doesn't exist or is not a directory\n      /Users/xiebing/learn/node_modules doesn't exist or is not a directory\n      /Users/xiebing/node_modules doesn't exist or is not a directory\n      /Users/node_modules doesn't exist or is not a directory\n      /node_modules doesn't exist or is not a directory\n      looking for modules in /Users/xiebing/learn/share/html-webpack-plugin/node_modules\n        using description file: /Users/xiebing/learn/share/html-webpack-plugin/package.json (relative path: ./node_modules)\n          Field 'browser' doesn't contain a valid alias configuration\n          using description file: /Users/xiebing/learn/share/html-webpack-plugin/package.json (relative path: ./node_modules/jquery)\n            no extension\n              Field 'browser' doesn't contain a valid alias configuration\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery doesn't exist\n            .wasm\n              Field 'browser' doesn't contain a valid alias configuration\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.wasm doesn't exist\n            .mjs\n              Field 'browser' doesn't contain a valid alias configuration\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.mjs doesn't exist\n            .js\n              Field 'browser' doesn't contain a valid alias configuration\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.js doesn't exist\n            .json\n              Field 'browser' doesn't contain a valid alias configuration\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.json doesn't exist\n            as directory\n              /Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery doesn't exist\n[/Users/xiebing/learn/share/html-webpack-plugin/src/node_modules]\n[/Users/xiebing/learn/share/node_modules]\n[/Users/xiebing/learn/node_modules]\n[/Users/xiebing/node_modules]\n[/Users/node_modules]\n[/node_modules]\n[/Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery]\n[/Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.wasm]\n[/Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.mjs]\n[/Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.js]\n[/Users/xiebing/learn/share/html-webpack-plugin/node_modules/jquery.json]\n @ ./src/index.js 14:0-23 16:12-13 19:16-17 20:4-5 23:0-1"
  ],
  // 编译过程中出现的警告
  warnings: [],
  version: '4.41.5',
  // 编译时的hash
  hash: '1b193593f68646f870aa',
  // 编译用时
  time: 86,
  // 构建时间
  builtAt: 1578643518045,
  // 资源路径
  publicPath: '',
  outputPath: '/Users/xiebing/learn/share/html-webpack-plugin/dist',
  // chunk对应的输出文件名称
  assetsByChunkName: {
    main: 'bundle.js'
  },
  // 所有输出文件
  assets: [
    {
      name: '0.bundle.js',
      size: 425,
      chunks: [0],
      chunkNames: [],
      info: {},
      emitted: true
    },
    {
      name: 'bundle.js',
      size: 9790,
      chunks: ['main'],
      chunkNames: ['main'],
      info: {},
      emitted: true
    }
  ],
  filteredAssets: 0,
  // 入口点
  entrypoints: {
    main: {
      chunks: ['main'],
      assets: ['bundle.js'],
      children: {},
      childAssets: {}
    }
  },
  namedChunkGroups: {
    main: {
      chunks: ['main'],
      assets: ['bundle.js'],
      children: {},
      childAssets: {}
    }
  },
  // 所有的chunk，每个chunks会对应一个文件
  chunks: [
    {
      id: 0,
      // 是否会参与编译，从缓存中读取的不需要进行编译
      rendered: true,
      initial: false,
      // 是否是入口
      entry: false,
      size: 24,
      names: [],
      files: ['0.bundle.js'],
      hash: '87b6c7a6dfb498e35c69',
      siblings: [],
      parents: ['main'],
      children: [],
      childrenByOrder: {},
      // 当前的chunk包含的module，module就是我们写的每个文件
      modules: [
        {
          id: './src/async.js',
          identifier:
            '/Users/xiebing/learn/share/html-webpack-plugin/src/async.js',
          name: './src/async.js',
          index: 1,
          index2: 1,
          size: 24,
          cacheable: true,
          built: true,
          optional: false,
          prefetched: false,
          chunks: [0],
          issuer: '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          issuerId: './src/index.js',
          issuerName: './src/index.js',
          issuerPath: [
            {
              id: './src/index.js',
              identifier:
                '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
              name: './src/index.js'
            }
          ],
          failed: false,
          errors: 0,
          warnings: 0,
          assets: [],
          reasons: [
            {
              moduleId: './src/index.js',
              moduleIdentifier:
                '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
              module: './src/index.js',
              moduleName: './src/index.js',
              type: 'import()',
              userRequest: './async',
              loc: '18:2-19'
            }
          ],
          providedExports: ['default'],
          optimizationBailout: [],
          depth: 1,
          source: "export default 'async';\n"
        }
      ],
      filteredModules: 0,
      // 是在哪里导入引入这个chunk的
      origins: [
        {
          moduleId: './src/index.js',
          module: '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          moduleIdentifier:
            '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          moduleName: './src/index.js',
          loc: '18:2-19',
          request: './async',
          reasons: []
        }
      ]
    },
    {
      id: 'main',
      rendered: true,
      initial: true,
      entry: true,
      size: 554,
      names: ['main'],
      files: ['bundle.js'],
      hash: 'b2fadd06e41cb1e53ce9',
      siblings: [],
      parents: [],
      children: [0],
      childrenByOrder: {},
      modules: [
        {
          id: './src/index.js',
          identifier:
            '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          name: './src/index.js',
          index: 0,
          index2: 0,
          size: 554,
          cacheable: true,
          built: true,
          optional: false,
          prefetched: false,
          chunks: ['main'],
          issuer: null,
          issuerId: null,
          issuerName: null,
          issuerPath: null,
          failed: false,
          errors: 0,
          warnings: 0,
          assets: [],
          reasons: [
            {
              moduleId: null,
              moduleIdentifier: null,
              module: null,
              moduleName: null,
              type: 'single entry',
              userRequest: './src/index.js',
              loc: 'main'
            }
          ],
          providedExports: [],
          optimizationBailout: [],
          depth: 0,
          source:
            "// const btn = document.createElement('button');\n// btn.innerText = '点我';\n\n// btn.onclick = function() {\n//   import('./async').then(res => {\n//     const div = document.createElement('div');\n//     div.innerText = res.default;\n//     document.body.append(div);\n//   });\n// };\n\n// document.body.append(btn);\n\nimport $ from 'jquery';\n\nconst btn = $('<button>点我</button>');\nbtn.click(() => {\n  import('./async').then(res => {\n    const div = $(`<div>${res.default}</div>`);\n    $(document.body).append(div);\n  });\n});\n$(document.body).append(btn);\n"
        }
      ],
      filteredModules: 0,
      origins: [
        {
          module: '',
          moduleIdentifier: '',
          moduleName: '',
          loc: 'main',
          request: './src/index.js',
          reasons: []
        }
      ]
    }
  ],
  // 所有的模块
  modules: [
    {
      id: './src/async.js',
      identifier: '/Users/xiebing/learn/share/html-webpack-plugin/src/async.js',
      name: './src/async.js',
      index: 1,
      index2: 1,
      size: 24,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [0],
      issuer: '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
      issuerId: './src/index.js',
      issuerName: './src/index.js',
      issuerPath: [
        {
          id: './src/index.js',
          identifier:
            '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          name: './src/index.js'
        }
      ],
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [
        {
          moduleId: './src/index.js',
          moduleIdentifier:
            '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
          module: './src/index.js',
          moduleName: './src/index.js',
          type: 'import()',
          userRequest: './async',
          loc: '18:2-19'
        }
      ],
      providedExports: ['default'],
      optimizationBailout: [],
      depth: 1,
      source: "export default 'async';\n"
    },
    {
      id: './src/index.js',
      identifier: '/Users/xiebing/learn/share/html-webpack-plugin/src/index.js',
      name: './src/index.js',
      index: 0,
      index2: 0,
      size: 554,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: ['main'],
      issuer: null,
      issuerId: null,
      issuerName: null,
      issuerPath: null,
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [
        {
          moduleId: null,
          moduleIdentifier: null,
          module: null,
          moduleName: null,
          type: 'single entry',
          userRequest: './src/index.js',
          loc: 'main'
        }
      ],
      providedExports: [],
      optimizationBailout: [],
      depth: 0,
      source:
        "// const btn = document.createElement('button');\n// btn.innerText = '点我';\n\n// btn.onclick = function() {\n//   import('./async').then(res => {\n//     const div = document.createElement('div');\n//     div.innerText = res.default;\n//     document.body.append(div);\n//   });\n// };\n\n// document.body.append(btn);\n\nimport $ from 'jquery';\n\nconst btn = $('<button>点我</button>');\nbtn.click(() => {\n  import('./async').then(res => {\n    const div = $(`<div>${res.default}</div>`);\n    $(document.body).append(div);\n  });\n});\n$(document.body).append(btn);\n"
    }
  ],
  filteredModules: 0,
  logging: {
    'webpack.buildChunkGraph.visitModules': {
      entries: [],
      filteredEntries: 5,
      debug: false
    }
  },
  children: []
};
