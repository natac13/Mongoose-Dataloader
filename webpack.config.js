const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const path = require('path');

module.exports = (mode) => {
  const isDevelopment = mode !== 'production';
  return {
    target: 'node',
    context: path.resolve(__dirname), // absolute path for resolving entry point(s)
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      // chunkFilename: '[name].js',
    },
    resolve: {
      extensions: ['*', '.js', '.json', '.node'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: false,
        }),
      ],
      // runtimeChunk: 'single',
      // splitChunks: {
      //   chunks: 'all',
      //   maxInitialRequests: Infinity,
      //   minSize: 0,
      //   cacheGroups: {
      //     common: {
      //       name: 'commons',
      //       chunks: 'initial',
      //       minChunks: 2,
      //     },
      //     vendor: {
      //       test: /node_modules/,
      //       name: 'vendor.bundle',
      //     },
      //   },
      // },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new Visualizer({ filename: './statistics.html' }),
    ],
  };
};
