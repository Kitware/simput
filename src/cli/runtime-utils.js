function arrayToJSON() {
  if (Array.isArray(this) && this.length && this[this[0]]) {
    const mappedArray = [];
    for (let i = 0; i < this.length; i++) {
      mappedArray.push(this[this[i]]);
    }
    return mappedArray;
  }
  return this;
}

function replacePatterns(string, values) {
  let result = string;
  Object.keys(values).forEach((name) => {
    const regexp = new RegExp(`{${name}}`, 'g');
    result = result.replace(regexp, values[name]);
  });
  return result;
}

function set(output, path, value) {
  // regular object mapping
  const pathTokens = path.split('.');
  const containerName = pathTokens.pop().replace('[]+', '');
  let currentContainer = output;
  for (let i = 0; i < pathTokens.length; i++) {
    const key = pathTokens[i];
    if (!currentContainer[key]) {
      currentContainer[key] = {};
    }
    currentContainer = currentContainer[key];
  }

  const arrayAppendIndex = path.indexOf('[]+');
  if (arrayAppendIndex === -1) {
    currentContainer[containerName] = value;
  } else {
    if (!currentContainer[containerName]) {
      currentContainer[containerName] = [];
      currentContainer[containerName].toJSON = arrayToJSON;
    }
    currentContainer[containerName].push(value);
  }
}

function extractValue(value) {
  if (value.length > 1) {
    return value;
  }
  return value[0];
}

function addData(output, values, dst) {
  // CASEID.CORE.Materials[{name}]={name, density, thexp, fractions}
  const [variablePath, varName] = dst.split('=');
  set(output, replacePatterns(variablePath, values), values[varName]);
}

function extractData(viewDataArray, output, extractDescription) {
  if (!viewDataArray) {
    return;
  }

  const { extract: fieldNames, src: attr, dst } = extractDescription;

  for (let vIdx = 0; vIdx < viewDataArray.length; vIdx++) {
    const container = viewDataArray[vIdx][attr];
    const values = {};
    for (let fIdx = 0; fIdx < fieldNames.length; fIdx++) {
      const fieldName = fieldNames[fIdx];
      values[fieldName] = extractValue(container[fieldName].value);
    }
    for (let dIdx = 0; dIdx < dst.length; dIdx++) {
      addData(output, values, dst[dIdx]);
    }
  }
}

module.exports = function simputConvert(viewData, mapping, outputFiles) {
  const error = null;
  const results = {};
  const output = {};
  console.log(viewData, mapping);

  const viewNames = Object.keys(mapping);
  while (viewNames.length) {
    const currentViewName = viewNames.pop();
    const mappingArray = mapping[currentViewName];
    for (let i = 0; i < mappingArray.length; i++) {
      extractData(viewData.data[currentViewName], output, mappingArray[i]);
    }
  }

  Object.keys(outputFiles).forEach((fileName) => {
    results[fileName] = outputFiles[fileName](output);
  });

  return {
    results,
    model: viewData,
    error,
  };
};
