#! /usr/bin/env node

var shell = require('shelljs');

var path = require('path');
var fs = require('fs');

function getPath(arg) {
  return path.normalize(path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg));
}

if (process.argv.length < 4) {
  console.log('unpack file.json output/directory');
} else {
  var filePath = getPath(process.argv[2]);
  var destPath = getPath(process.argv[3]);
  var jsonContent = require(filePath);
  var content = jsonContent.results || jsonContent;

  /* Results */

  Object.keys(content).forEach(function(name) {
    var fileDest = path.join(destPath, name);
    var destDir = path.dirname(fileDest);
    shell.mkdir('-p', destDir);
    fs.writeFileSync(fileDest, content[name]);
  });

  /* Copies */

  if (jsonContent.copies) {
    jsonContent.copies.forEach(function(filePath) {
      var sourceFile = path.join(process.cwd(), 'types', jsonContent.model.data.type, 'src', 'templates', filePath);
      var destinationFile = path.join(destPath, filePath);

      shell.mkdir('-p', path.dirname(destinationFile));
      shell.cp(sourceFile, destinationFile);
    });
  }

  /* Permissions */

  if (jsonContent.permissions) {
    var permissions = jsonContent.permissions;
    Object.keys(permissions).forEach(function(name) {
      var fileDest = path.join(destPath, name);
      shell.chmod(permissions[fileDest], fileDest);
    });
  }
}
