const { root } = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path')

/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: root('dist')
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: '@ngtools/webpack' },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.scss$/,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader'
        }, {
            loader: 'sass-loader',
            options: {
              includePaths: ["styles.scss"]
            }
        }]
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
