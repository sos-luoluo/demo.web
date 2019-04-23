const path = require('path')

module.exports = {
  devServer: {
    host: '192.168.31.142',
    port: 8001,
    open: true,
    publicPath: '/',
    proxy: {
      "/api/v1": {
        //target:"http://fountainhub.cn",
        target:"http://10.26.20.170:8090",
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true
      }
    }
  }
}