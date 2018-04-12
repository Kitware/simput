const shell = require('shelljs');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const toAbsolutePath = require('./utils').toAbsolutePath;
const generateConvertFile = require('./convertFileGenerator');

const fileToDelete = [];

// ----------------------------------------------------------------------------

function buildWebpackConfiguration(name, basepath, outputPath, compress) {
  const plugins = [];
  const entry = path.join(basepath, 'index.js');
  const simputNodeModules = path.join(__dirname, '../node_modules');
  return {
    mode: compress ? 'production' : 'development',
    entry,
    output: {
      path: outputPath,
      filename: `${name}.js`,
    },
    plugins,
    resolveLoader: {
      modules: [simputNodeModules],
    },
    module: {
      rules: [
        // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000&mimetype=application/font-woff" },
        // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000" },
        {
          test: entry,
          loader: `expose-loader?Simput.types.${name}`,
        },
        { test: /\.(png|jpg)$/, use: 'url-loader?limit=81920' },
        { test: /\.html$/, loader: 'html-loader' },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        { test: /\.cjson$/, loader: 'hson-loader' },
        { test: /\.hson$/, loader: 'hson-loader' },
        { test: /\.jade$/i, loader: 'jade-loader' },
        { test: /\.hbs$/i, loader: 'handlebars-loader' },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  [
                    `${simputNodeModules}/babel-preset-env`,
                    {
                      targets: {
                        browsers: ['last 2 versions', 'safari >= 7'],
                      },
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    },
  };
}

// ----------------------------------------------------------------------------

function writeIndexList(directory) {
  let list = 'module.exports = {\n';
  shell.ls(directory).forEach((file) => {
    if (shell.test('-d', path.join(directory, file))) {
      writeIndexList(path.join(directory, file));
      list += `"${file}": require("./${file}"),\n`;
    } else if (file !== 'index.js') {
      if (['js', 'json'].indexOf(file.split('.').pop()) === -1) {
        list += `"${file}": require("html-loader!./${file}"),\n`;
      } else {
        list += `"${file}": require("./${file}"),\n`;
      }
    }
  });

  list += '}\n';
  fs.writeFileSync(path.join(directory, 'index.js'), list);
  fileToDelete.push(path.join(directory, 'index.js'));
}

// ----------------------------------------------------------------------------

function cleanup() {
  while (fileToDelete.length) {
    shell.rm(fileToDelete.pop());
  }
}

// ----------------------------------------------------------------------------

module.exports = function compile(
  directory,
  type,
  outputDirectory,
  compress,
  callback
) {
  let modelType = type;
  let output = outputDirectory;
  if (!modelType) {
    modelType = path.basename(directory);
  }
  // ensure modelType has no . in it, it will create keypaths in the webpack expose loader
  modelType = modelType.replace(/\./, '-').toLowerCase();

  if (!output) {
    output = directory;
  }

  let lang = '{}';
  let modelFileName = null;
  ['model.json', 'model.js'].forEach((file) => {
    if (shell.test('-f', path.join(directory, file))) {
      modelFileName = file;
    }
  });

  if (modelFileName) {
    generateConvertFile(directory, modelFileName);
  }

  [modelFileName || 'model.json', 'convert.js'].forEach((file) => {
    if (!shell.test('-f', path.join(directory, file))) {
      console.log(`Missing '${file}'!`);
    }
  });

  if (shell.test('-d', path.join(directory, 'lang'))) {
    lang = "require('./lang')";
  }

  if (lang !== '{}') {
    writeIndexList(path.join(directory, 'lang'));
  }

  let schema = `{
    type: 'TYPE',
    model: require('./${modelFileName}'),
    lang: LANG,
    convert: require('./convert.js'),
    parse: PARSE
  }`;

  if (shell.test('-f', path.join(directory, 'parse.js'))) {
    schema = schema.replace('PARSE', "require('./parse.js')");
  } else {
    schema = schema.replace('PARSE', 'null');
  }

  schema = schema.replace('TYPE', modelType);
  schema = schema.replace('LANG', lang);

  fs.writeFileSync(
    path.join(directory, 'index.js'),
    `module.exports = ${schema}`
  );
  fileToDelete.push(path.join(directory, 'index.js'));
  webpack(
    buildWebpackConfiguration(
      modelType,
      directory,
      toAbsolutePath(output),
      compress
    ),
    (err, stats) => {
      if (err) {
        throw err;
      }
      const jsonStats = stats.toJson();
      if (stats.hasErrors()) {
        console.error('Error building ');
        throw jsonStats.errors;
      } else if (stats.hasWarnings()) {
        console.warn('built with warnings.');
        console.warn(jsonStats.warnings);
      } else {
        console.log('built', path.join(output, modelType), 'cleaning up');
        cleanup();
      }

      if (callback) {
        callback();
      }
    }
  );
};
