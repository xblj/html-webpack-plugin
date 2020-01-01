function logHooks(name, hooks) {
  return hookName => {
    const hook = hooks[hookName];
    if (hook.tap) {
      hook.tap('FlowWebpackPlugin', () => {
        console.log(`|${name}|${hookName}|${Object.getPrototypeOf(hook).constructor.name}|${hook._args}|`)
      })
    }
  }
}

class FlowWebpackPlugin {
  apply(compiler) {
    const { hooks } = compiler;
    Object.keys(hooks).forEach(logHooks('compiler', hooks));

    compiler.hooks.compilation.tap('FlowWebpackPlugin', compilation => {
      const { hooks: compilationHooks } = compilation;
      Object.keys(compilationHooks).forEach(logHooks('compilation', compilationHooks))
    })
  }
}

module.exports = FlowWebpackPlugin;