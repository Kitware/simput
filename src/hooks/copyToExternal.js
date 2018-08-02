/* eslint-disable no-param-reassign */

function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
  }
  return dataModel.external;
}

export default function copyToExternal(hookConfig, dataModel, currentViewData) {
  const { src, dst } = hookConfig;

  // src
  let value = dataModel;
  const srcTokens = src.split('.');
  while (srcTokens.length && value) {
    const token = srcTokens.shift();
    value = value[token];
  }

  // dst
  const dstTokens = dst.split('.');
  const lastKey = dstTokens.pop();
  let container = getExternal(dataModel);
  while (dstTokens.length && value) {
    const token = dstTokens.shift();
    if (!container[token]) {
      container[token] = {};
    }
    container = container[token];
  }
  container[lastKey] = value;
}
