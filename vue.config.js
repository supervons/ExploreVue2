const port = process.env.port || process.env.npm_config_port || 9528; // dev port
module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    port: port
  }
}
