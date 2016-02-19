var path = require('path'),
    loaders = require('./node_modules/paraviewweb/config/webpack.loaders.js');

module.exports = {
  plugins: [],
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'Simput.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
      },
    ],
    loaders: [
        { test: require.resolve("./src/index.js"), loader: "expose?Simput" },
    ].concat(loaders),
  },
  resolve: {
        alias: {
            'PVWStyle/ReactProperties/PropertyPanel.mcss': path.resolve('./style/PropertyPanel.mcss'),
            PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
            SimputStyle: path.resolve('./style'),
        },
    },
  postcss: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
  ],
  eslint: {
    configFile: '.eslintrc',
  },
};
