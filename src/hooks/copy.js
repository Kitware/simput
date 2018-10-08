/* eslint-disable no-param-reassign */

export default function copy(hookConfig, dataModel, currentViewData) {
  if (!currentViewData) {
    return;
  }

  const { src, dst } = hookConfig;
  let value = dataModel;
  const [attributeName, parameterId] = dst.split('.');
  const tokens = src.split('.');
  while (tokens.length && value) {
    const token = tokens.shift();
    value = value[token];
  }
  if (
    value !== undefined &&
    currentViewData[attributeName] &&
    currentViewData[attributeName][parameterId]
  ) {
    currentViewData[attributeName][parameterId].value[0] = value;
  }
}
