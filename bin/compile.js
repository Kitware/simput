require('shelljs/global');

var webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    fileToDelete = [];

function buildWebpackConfiguration(name, basepath, outputPath, compress) {
    var plugins = [];
    if (compress) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
            })
        );
    }
    return {
            entry: basepath + '/index.js',
            output : {
                path: outputPath,
                filename: name + '.js',
            },
            plugins: plugins,
            module: {
                loaders: [
                    // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000&mimetype=application/font-woff" },
                    // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000" },
                    {
                      test: require.resolve(basepath + '/index.js'),
                      loader: 'expose?Simput.types.' + name,
                    },
                    { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
                    { test: /\.css$/, loader: "style!css!autoprefixer?browsers=last 2 version" },
                    { test: /\.json$/i, loader: 'json'},
                    { test: /\.jade$/i, loader: 'jade'},
                    { test: /\.html$/, loader: 'html-loader' },
                    { test: /\.hbs$/i, loader: 'handlebars-loader'},
                    { test: /\.js$/i, exclude: /node_modules/, loader: "babel?presets[]=react,presets[]=es2015" },
                ],
            },
        };
}

module.exports = function (directory, modelType, output) {
    if (!modelType) {
        modelType = path.basename(directory);
    }
    // ensure modelType has no . in it, it will create keypaths in the webpack expose loader
    modelType = modelType.replace(/\./, '-').toLowerCase();


    if (!output) {
        output = directory;
    }

    var schema = '{\n' +
        'type: \'TYPE\',\n' +
        'model: require(\'./model.json\'),\n' +
        'lang: LANG,\n' +
        'convert: require(\'./convert.js\'),\n' +
    '}\n';

    var lang = '{}';
    ['model.json', 'convert.js'].forEach(function(file) {
        if ( !test('-f', path.join(directory, file)) ) {
            console.log('Missing `' + file + '`!');
        }
    });

    if ( test('-d', path.join(directory, 'lang')) ) {
        lang = 'require(\'./lang\')';
    }

    if (lang !== '{}') {
       writeIndexList(path.join(directory, 'lang'));
    }

    schema = schema.replace('TYPE', modelType);
    schema = schema.replace('LANG', lang);

    fs.writeFileSync(path.join(directory, 'index.js'), 'module.exports = ' + schema);
    fileToDelete.push(path.join(directory, 'index.js'));
    webpack(buildWebpackConfiguration(modelType, directory, output), function(err, stats){
        if (err) {
            throw err;
        }
        var jsonStats = stats.toJson();
        if (stats.hasErrors()) {
            console.error('Error building ');
            throw jsonStats.errors;
        } else if (stats.hasWarnings()) {
            console.warn('built with warnings.');
            console.warn(jsonStats.warnings);
        } else {
            console.log('built ' + path.join(output,modelType) + '.js, cleaning up');
            cleanup();
        }
    });
}

function writeIndexList(directory) {
    var list = 'module.exports = {\n';
    ls(directory).forEach(function(file){
        if ( test('-d', path.join(directory, file))) {
            writeIndexList(path.join(directory, file));
            list += '"' + file + '": require("./' + file + '"),\n';
        } else if (file !== 'index.js') {
            if ( ['js', 'json'].indexOf(file.split('.').pop()) === -1) {
                list += '"' + file + '": require("html!./' + file + '"),\n';
            } else {
                list += '"' + file + '": require("./' + file + '"),\n';
            }
        }
    });

    list += '}\n';
    fs.writeFileSync(path.join(directory, 'index.js'), list);
    fileToDelete.push(path.join(directory, 'index.js'));
}

function cleanup() {
    while(fileToDelete.length) {
        rm(fileToDelete.pop());
    }
}
