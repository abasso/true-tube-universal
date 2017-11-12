const { root } = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path')

/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    unsafeCache: true
  },
  output: {
    path: root('dist')
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: '@ngtools/webpack' },
      { test: /\.css$/,
        use: ['raw-loader', 'css-loader']
      },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.scss$/,
        use: ['raw-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      // {output}/file.txt
      { from: path.join('src', 'styles.css'), to: 'styles.css' },
      { from: path.join('src', 'assets'), to: 'assets' }
    ])
  ]
};
