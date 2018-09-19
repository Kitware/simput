const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const vtkRules = require('./rules/vtkjs.js');

const paths = {
  entry: path.join(__dirname, './src/index.js'),
  source: path.join(__dirname, './src'),
  output: path.join(__dirname, './dist'),
  node_modules: path.join(__dirname, './node_modules'),
};

module.exports = {
  mode: 'development',
  entry: {
    'simput-external-vera': paths.entry,
  },
  output: {
    path: paths.output,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|svg|ttf|woff2?|eot|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 60000,
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[folder]-[local]-[sha512:hash:base32:5]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ].concat(vtkRules),
  },
  plugins: [
    new VueLoaderPlugin(),
    new WriteFilePlugin(),
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
  },
};
