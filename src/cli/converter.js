const fs = require('fs');
const path = require('path');

const home = process.env.HOME;
const simputFolder = path.join(home, '.Simput/');
const toAbsolutePath = require('./utils').toAbsolutePath;

/* eslint-disable no-restricted-properties */
// ----------------------------------------------------------------------------

function unitSuffix(size) {
  const suffixes = {
    1000: ' B',
    1000000: ' KB',
    1000000000: ' MB',
    1000000000000: ' GB',
  };
  const keys = Object.keys(suffixes);
  for (let i = 0; i < keys.length; i++) {
    if (size < keys[i]) {
      return size / Math.pow(10, Math.log10(keys[i]) - 3) + suffixes[keys[i]];
    }
  }
  return size;
}

// ----------------------------------------------------------------------------

module.exports = function convert(input, outputDirectory) {
  // read input to JSON
  const inputPath = toAbsolutePath(input);
  const inputContents = JSON.parse(
    fs.readFileSync(inputPath, { encoding: 'utf8' })
  );

  // import corresponding input type
  const type = inputContents.type;

  /* eslint-disable */
  require(path.join(simputFolder, `${type}.js`));
  /* eslint-enable */

  // write output
  try {
    const output = global.Simput.types[type].convert(inputContents);
    const outputPath = outputDirectory
      ? toAbsolutePath(outputDirectory)
      : path.dirname(inputPath);
    Object.keys(output.results).forEach((el) => {
      fs.writeFileSync(path.join(outputPath, el), output.results[el]);
      const size = fs.statSync(path.join(outputPath, el)).size;
      console.log(` → ${el}  ${unitSuffix(size)}`);
    });
  } catch (error) {
    console.log(`There is a problem with the '${type}' converter:`);
    console.log(error.message);
  }
};
