const port = process.env.port || process.env.npm_config_port || 9528; // dev port
module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    port: port,
    proxy: {
      "/qqfile": {
        target: "https://dldir1.qq.com", //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      },
      "/files": {
        target: "https://sgp.proof.ovh.net", //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      },
      "/download": {
        target: "http://vipspeedtest8.wuhan.net.cn:8080", //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      },
      "/2019WinterFCS": {
        target: "http://updates-http.cdn-apple.com", //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        // pathRewrite: {
        //   "^/api": "", // 这种接口配置出来实际请求 http://XX.XX.XX.XX:8083/api/login
        // },
      },
    },
  },
};
