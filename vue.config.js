const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    // historyApiFallback: true,
    port: 8082,   // you can change the port there
    // noInfo: true,
    // overlay: true
  }
}