// file-loader.config.js

module.exports = {
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'file-loader',
  options: {
    name: '[name].[ext]?[hash]',
    outputPath: 'images/'
  }
};