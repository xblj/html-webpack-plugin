const fs = require('fs');
const path = require('path');
const header = `
|对象|钩子|类型|参数|
|---|---|---|---|
`;
let flowStr = header;
function logHooks(name, hooks) {
  return hookName => {
    const hook = hooks[hookName];
    if (hook.tap) {
      hook.tap('FlowWebpackPlugin', () => {
        const constructorName = Object.getPrototypeOf(hook).constructor.name;
        const args = hook._args.length ? hook._args : '无';
        const str = `|${name}|${hookName}|${constructorName}|${args}|\n`;
        flowStr += str;
        if (hookName === 'done') {
          fs.writeFileSync(
            path.resolve(process.cwd(), 'flow.md'),
            flowStr,
            'utf8'
          );
          flowStr = header;
        }
      });
    }
  };
}

class FlowWebpackPlugin {
  apply(compiler) {
    const { hooks } = compiler;
    Object.keys(hooks).forEach(logHooks('compiler', hooks));

    compiler.hooks.compilation.tap('FlowWebpackPlugin', compilation => {
      const { hooks: compilationHooks } = compilation;
      Object.keys(compilationHooks).forEach(
        logHooks('compilation', compilationHooks)
      );
    });
  }
}

module.exports = FlowWebpackPlugin;
