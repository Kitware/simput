const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

module.exports = function convertGenerator(directory, modelFileName) {
  if (!modelFileName) {
    return;
  }

  const destFilePath = path.join(directory, 'convert.js');

  if (shell.test('-f', destFilePath)) {
    const firstLine = shell.head({ '-n': 1 }, destFilePath).stdout;
    if (firstLine.indexOf('AUTO-GENERATED') === -1) {
      console.log('convert.js already exist. Skip generation attempt...');
      return;
    }
  }

  /* eslint-disable */
  const model = require(path.join(directory, modelFileName));
  /* eslint-enable */

  const convertContent = [
    '/* AUTO-GENERATED */',
    `const simputConvert = require('${__dirname}/runtime-utils');`,
    'const output = {};',
  ];

  // Handle template files / functions
  if (model.output) {
    Object.keys(model.output).forEach((fileName) => {
      if (model.output[fileName].type === 'template') {
        convertContent.push(
          `output['${fileName}'] = require('${
            model.output[fileName].template
          }');`
        );
      } else if (model.output[fileName].type === 'default') {
        convertContent.push(
          `output['${fileName}'] = (m) => JSON.stringify(m, null, 2);`
        );
      } else {
        console.log('skip output of type', model.output[fileName].type, 'for file', fileName);
      }
    });
  } else {
    // Provide default output
    convertContent.push(
      "output['data.json'] = (m) => JSON.stringify(m, null, 2);"
    );
  }

  // handle convert method
  convertContent.push('module.exports = function(dataModel) {');
  const views = Object.keys(model.views);
  const mapping = {};
  for (let i = 0; i < views.length; i++) {
    const viewName = views[i];
    if (model.views[viewName].output) {
      mapping[viewName] = model.views[viewName].output;
    }
  }
  convertContent.push(`const mapping = ${JSON.stringify(mapping)};`);
  convertContent.push('return simputConvert(dataModel, mapping, output);');
  convertContent.push('};');
  try {
    fs.writeFileSync(destFilePath, convertContent.join('\n'));
  } catch (error) {
    console.log(`There is a problem when writing '${destFilePath}' file:`);
    console.log(error.message);
  }
};
