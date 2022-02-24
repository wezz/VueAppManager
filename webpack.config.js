const path = require('path');
const webpack = require('webpack');
const PrettierPlugin = require("prettier-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, " ")}

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: 'VueAppManager',
    libraryTarget: 'umd'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options:
        {
          runtimeCompiler:true,
        }
      }
    ]
  },
  plugins: [
    new PrettierPlugin(),
    new webpack.BannerPlugin(banner),
    new VueLoaderPlugin()
  ],
  resolve: {
      extensions: [".tsx", ".ts", ".js", ".vue"],
      alias: {
        'vue$': 'vue/dist/vue.runtime.esm.js'
      }
  },
};