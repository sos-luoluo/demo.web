var webpack = require('webpack')
var path = require('path') //引入nodejs路径模块，处理路径用的
var glob = require('glob') //glob，这个是一个全局的模块
var HtmlWebpackPlugin = require('html-webpack-plugin') //这个是通过html模板生成html页面的插件
var CleanWebpackPlugin = require('clean-webpack-plugin') //清除dist貌似没有
var CopyWebpackPlugin = require('copy-webpack-plugin') //复制文件插件
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var os = require('os') //这个nodejs模块，会帮助我们获取本机ip
var portfinder = require('portfinder') //这个帮助我们寻找可用的端口，如果默认端口被占用了的话

// 动态配置入口
function getEntry(){
  var entry={
    // main: './src/utils/main.js'
    // worker: './src/utils/worker.js'
  }
  glob.sync('./src/js/*.js').forEach(function(item) {
    var temp = item.split('/')
    var name = temp[temp.length-1].split(".")[0]
    entry[name]=item
  })
  return entry
}
// 获取本机ip
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
// 配置端口
var devPort = 8080
portfinder.basePort = "8080"; //将我们默认的端口设置成8080，默认配置是8000
portfinder.getPort(function(err, port) { //这个函数，portfinder会自动找到可用的端口
  devPort = port; 
});

module.exports = {
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js',
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      include: /src/,
      use: {
        loader: 'babel-loader?cacheDirectory',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/transform-runtime']
        }
      }
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader'],
        publicPath: '../'
      })
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader'],
        publicPath: '../'
      })
    },{
      test: /\.(png|jpe?g|gif|svg)$/,
      use:[{
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'images/[name].[ext]'
        }
      }]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 复制资源文件
    new CopyWebpackPlugin([{
        from: 'images',
        to: 'images'
      },
      {
        from: 'assets',
        to: 'assets'
      },
      {
        from: 'plugins',
        to: 'plugins'
      }
    ], {
      context: 'src/'
    }),
    new ExtractTextPlugin("css/[name].css", { allChunks: true }),
    new webpack.ProvidePlugin({ //全局引入jquery
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    // 首页需要单独配置
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'head',
      favicon: path.resolve('favicon.ico'),
      minify: {
        collapseWhitespace:true,//是否去除空格
        removeComments:true//去注释
      },
      chunks: ['vendors','index']
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  stats:'minimal',
  devServer: {
    host: getIPAdress(),
    port: devPort,
    open: true,
    overlay: true, //出现错误之后会在页面中出现遮罩层提示
    contentBase: path.resolve(__dirname, 'dist'), //最好设置成绝对路径
    proxy: {
      "/qtv": {
        target:"http://www.iquntv.com",
        secure: true,  // 如果是https接口，需要配置这个参数
        changeOrigin: true
      }
    }
  }
}

// 配置HTML输出页面
glob.sync('./src/views/**/*.html').forEach(function(item) {
  var filename = item.split('views/')[1]
  var temp = filename.split('/')
  var name = temp[temp.length - 1].split('.')[0]
  module.exports.plugins.push(new HtmlWebpackPlugin({
    filename: 'views/'+ filename,
    template: item,
    inject: 'head',
    favicon: path.resolve('favicon.ico'),
    minify: {
      collapseWhitespace:true,//是否去除空格
      removeComments:true//去注释
    },
    chunks: ['vendors',name]
  }))
})