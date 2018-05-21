const { join, resolve } = require('path');

const webpack = require('webpack');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const constants = require('./webpack.constants');

module.exports = env => {
  const isDev = !!env.dev;
  const isProd = !!env.prod;
  const isDebug = !!process.env.DEBUG;
  const isTest = !!env.test;

  const addPlugin = (add, plugin) => (add ? plugin : undefined);
  const ifDev = plugin => addPlugin(env.dev, plugin);
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const ifNotTest = plugin => addPlugin(!env.test, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  console.log('isDev',isDev);
  console.log('isProd',isProd);

  return {
    entry: {
      app: './index.js',
    },
    node: {
      dns: 'mock',
      net: 'mock',
    },
    watch: isDev,
    mode: isDev ? 'development' : 'production',
    output: {
      filename: 'bundle.[name].[hash].js',
      path: resolve(__dirname, constants.DIST),
      publicPath: '',
      pathinfo: !env.prod,
    },
    context: constants.SRC_DIR,
    devtool: env.prod ? 'source-map' : 'eval',
    devServer: {
      host: '0.0.0.0',
      stats: {
        colors: true,
      },
      contentBase: resolve(__dirname, constants.DIST),
      historyApiFallback: !!env.dev,
      port: 8081,
    },
    bail: env.prod,
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        constants.NODE_MODULES_DIR,
        resolve(`${constants.JS_SRC_DIR}`),
        resolve(`${constants.JS_SRC_DIR}`, 'src'),
        resolve(`${constants.JS_SRC_DIR}`, 'src', 'views'),
      ],
    },
    node: {
      fs: 'empty',
      child_process: 'empty',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [constants.JS_SRC_DIR],
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ]
    },
    plugins: removeEmpty([
      ifDev(new webpack.HotModuleReplacementPlugin()),
      new HtmlWebpackPlugin({
        assetsUrl: `""`,
        env: process.env,
        template: './index.ejs', // Load a custom template (ejs by default see the FAQ for details)
      }),
      ifProd(
        new ExtractTextPlugin({
          filename: 'css/main.css',
          disable: false,
          allChunks: true,
        }),
      ),
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          quiet: true,
        }),
      ),
      new Dotenv({
        path: isDev ? '.dev.env' : '.prod.env',
      }),
    ]),
  }
}
