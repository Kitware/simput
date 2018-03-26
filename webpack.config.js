const path = require('path');
const rules = require('paraviewweb/config/webpack.loaders.js');

const eslintrcPath = path.join(__dirname, '.eslintrc.js');

const entry = path.join(__dirname, './src/index.js');
const outputPath = path.join(__dirname, './dist');

module.exports = {
  plugins: [],
  entry,
  output: {
    path: outputPath,
    filename: 'Simput.js',
  },
  module: {
    rules: [
      {
        test: require.resolve('./src/index.js'),
        loader: 'expose-loader?Simput',
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre',
        options: { configFile: eslintrcPath },
      },
    ].concat(rules),
  },
  resolve: {
    alias: {
      'PVWStyle/ReactProperties/PropertyPanel.mcss': path.resolve(
        './style/PropertyPanel.mcss'
      ),
      PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
      SimputStyle: path.resolve('./style'),
    },
  },
};
