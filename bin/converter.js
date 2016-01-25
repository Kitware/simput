require('shelljs/global');

var fs = require('fs'),
    path = require('path'),
    home = process.env.HOME,
    simputFolder = path.join(home, '.Simput/');

function toAbsolutePath(relPath) {
  var ret;
  if (!path.isAbsolute(relPath)) {
    ret = path.join(process.env.PWD, relPath);
  } else {
    ret = relPath;
  }
  return path.normalize(ret);
}

function unitSuffix(size) {
    var suffixes = {1000:' B', 1000000:' KB', 1000000000:' MB', 1000000000000:' GB'},
        keys = Object.keys(suffixes);
    for (var i=0; i < keys.length; i++) {
        if (size < keys[i]) {
            return size / Math.pow(10, Math.log10(keys[i])-3) + suffixes[keys[i]];
        }
    }
    return size;
}

module.exports = function (input, outputDirectory) {
    // read input to JSON
    input = toAbsolutePath(input);
    var inputContents = JSON.parse(
        fs.readFileSync(input, {encoding: 'utf8'})
    );

    // import corresponding input type
    var type = inputContents.type;
    require(path.join(simputFolder, type + '.js'));

    // write output
    try {
        var output = GLOBAL.Simput.types[type].convert(inputContents);
        outputDirectory = toAbsolutePath(outputDirectory);
        Object.keys(output.results).forEach(function(el) {
            fs.writeFileSync(path.join(outputDirectory, el), output.results[el]);
            var size = fs.statSync(path.join(outputDirectory, el)).size;
            console.log(' → ' + el + '  ' + unitSuffix(size));
        });
    } catch (error) {
        console.log('There is a problem with the `' + type + '` converter:');
        console.log(error.message);
        return;
    }
};