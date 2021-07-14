/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const libMode = process.env.LIBMODE
const isFullMode = libMode === 'full'
let externals = [
  {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
    },
  },
]
const plugins = [
  new VueLoaderPlugin(),
  // new BundleAnalyzerPlugin(),
]

const entry = path.resolve(__dirname, '../packages/element-plus/index.ts')

if (!isFullMode) {
  externals.push({
    '@popperjs/core': '@popperjs/core',
    'async-validator': 'async-validator',
    'mitt': 'mitt',
    'normalize-wheel': 'normalize-wheel',
    'resize-observer-polyfill': 'resize-observer-polyfill',
  },
  /^dayjs.*/,
  /^lodash.*/)
}

const config = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/',
    filename: isFullMode ? 'index.full.js' : 'index.js',
    libraryTarget: 'umd',
    library: 'ElementPlus',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  externals,
  plugins,
  devServer: {
    hot: true, // 热更新
    open: true, // 服务启动后，自动打开浏览器
    useLocalIp: true, // 是否在打包的时候使用自己的 IP
    contentBase: '../', // 热启动文件所指向的文件目录
    port: 8011, // 服务端口
    historyApiFallback: true, // 找不到的都可替换为 index.html
    proxy: { // 后端不帮我们处理跨域，本地设置代理
      '/api': 'http://localhost:3000', // 接口中有 '/api' 时代理到 'http://localhost:3000'
    },
    https: true,
  },

}

module.exports = config
