const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//引用开发时所配置将要生成的文件资源信息，如：js、css、html文件
let srcJson = require('./config/html.json');
let entry = {};
let htmlarr = [];
var getname = new Date().getTime() + "tf";

//引用babel-polyfill  解决ie
var config = {
    entry: {
        main: ["./src/entry/main.js"],
        vendor: ["react-dom", "react", "react-router", "babel-polyfill"],
    }
}

//生成页面所需要的css文件
htmlarr.push(new MiniCssExtractPlugin({
  filename: function (e) {
    let name = e.chunk.name.split('/');
    if(name.length > 1){
      return 'public/css/'+ name[0]+ '/'  + name[1] + '.css?v=[hash]'
    }else{
      return 'public/css/' + name + '.css?v=[hash]'
    }
    
  },
  chunkFilename: function (e) {
    let name = e.chunk.name.split('/');
    return 'public/css/' + name[0] + '.css?v=[chunkhash]'
  }
}));

// htmlarr.push(
//   new webpack.HotModuleReplacementPlugin(),
// )




//遍历html.json所配置的所有文件资源信息和静态设置信息。
srcJson.forEach((item, index) => {
  let obj = {};
  //设置webpack编译entry所使用的入口文件js签值和开发中所使用的js文件资源。
  entry[item.name] = __dirname + item.entry;
  // console.log(__dirname, entry, item.entry)
  // //判断html模板文件是否设置如果已经在html.json中直接取值。
  if (item.template) {
    //实例化模板方便对象。
    obj = new HtmlWebpackPlugin({
      //设置生成的 html 文件的标题。我们使用的是模板html文件所以此处设置无效
      //title:"我是页面标题title",
      //对生成的 html文件是否进行压缩。
      minify: false,
      //自定义模板的解析方法设置和template同时设置
      loader: "raw-loader",
      //自行编辑的模板文件，赋值来自html.json中的配置文件。添加html-withimg-loader!是为了提取html文件中的图片文件到发布环境中去
      template: "html-withimg-loader!" + __dirname + item.template,
      //入口js文件
      chunks: item.chunks,
      //生成 html 文件的文件名。默认为 index.html.
      filename: __dirname + "/web/" + item.name + '.html',
      projectPath: item.data ?
        item.data : []
    });
    htmlarr.push(obj);
  }
});

// console.log(entry, 111111111);
//webpack配置项开始
module.exports = {
  mode: "development",
  entry: entry,
  output: {
    path: __dirname + '/web/',
    filename: function (e) {
      let name = e.chunk.name.split('/');
      if(name.length > 1){
        return 'public/js/'+ name[0] + '/'  +  name[1] + '.js?v=[hash]'

      }else{
        return 'public/js/' + name + '.js?v=[hash]'

      }
      
    },
    chunkFilename: 'public/[name].js?v=[chunkhash]',
    // chunkFilename: function (e) {
    //   console.log(e,5555)
    //   let name = e.chunk.name.split('/');
    //   return 'public/' + name[0] + '/' + name[0] + '.js?v=[chunkhash]'
    // },
    hashDigestLength: 6 // 默认长度是20
  },
  //编译时依赖
  module: {
    rules: [{
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }, {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]

      }, {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },

      {
        //提取html、css、js文件中所引用的图片
        test: /\.(png|jpg|jpeg)$/,
        loader: 'url-loader',
        query: {
          limit: 8000,
          outputPath: 'public/images/',
          name: '[name].[ext]?v=[hash]',
          publicPath: '/public/images/'
        }
      }
    ]

  },
  plugins: htmlarr, //生成自定义模板文件。
  optimization: {
    splitChunks: {
      minChunks: 3,
      cacheGroups: {
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
          chunks: 'initial',
          name: 'group', // 任意命名
          minSize: 30 // 只要超出0字节就生成一个新包
        }
      }
    }
  },
  devServer: { //启动node服务配置依赖webpack-dev-server
    contentBase: path.join(__dirname, "/web/"), //网站的根目录为 根目录/dist，如果配置不对，会报Cannot GET /错误
    port: 8080, //端口改为9000
    // hot: true,
    inline: true, //看下文
    compress: true,
    open: true // 自动打开浏览器，适合懒人
  },
}