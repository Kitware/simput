#! /usr/bin/env node

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function getPath(arg) {
  return path.normalize(
    path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg)
  );
}

if (process.argv.length < 4) {
  console.log('unpack file.json output/directory');
} else {
  /* eslint-disable */
  const jsonContent = require(getPath(process.argv[2]));
  /* eslint-enable */
  const destPath = getPath(process.argv[3]);
  const content = jsonContent.results || jsonContent;

  // Results -------------------------------

  Object.keys(content).forEach((name) => {
    const fileDest = path.join(destPath, name);
    const destDir = path.dirname(fileDest);
    shell.mkdir('-p', destDir);
    fs.writeFileSync(fileDest, content[name]);
  });

  // Copies --------------------------------

  if (jsonContent.copies) {
    jsonContent.copies.forEach((entry) => {
      const sourceFile = entry.src;
      const destinationFile = path.join(destPath, entry.dst);

      shell.mkdir('-p', path.dirname(destinationFile));
      shell.cp(sourceFile, destinationFile);
    });
  }

  // Permissions ---------------------------

  if (jsonContent.permissions) {
    const permissions = jsonContent.permissions;
    Object.keys(permissions).forEach((name) => {
      const fileDest = path.join(destPath, name);
      shell.chmod(permissions[fileDest], fileDest);
    });
  }
}
