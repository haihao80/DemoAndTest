// 一个常见的`webpack`配置文件
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve("./app/index-waterfall.js"), //已多次提及的唯一入口文件
  output: {
      path: path.resolve("./app/build"),
      filename: "bundle-[hash].js",
      //publicPath: '/asset/',
  },
  devtool: 'none',
  devServer: {
    //publicPath: '/assetDev/',
    contentBase: './app/', //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true,
    hot: true
  },

  resolve: {
    alias: {
      utils: path.resolve(__dirname, '../utils')
    }
  },

  module: {
    rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        },{
  　　　　　　test: /\.(png|jpg)$/,
  　　　　　　loader: 'url-loader'
  　　　　}]
    },
    plugins: [
      new webpack.BannerPlugin('版权所有，翻版必究'),
      new HtmlWebpackPlugin({
          template:  path.resolve("./app/index-waterfall.html"), //new 一个这个插件的实例，并传入相关的参数
      })
  ]
}