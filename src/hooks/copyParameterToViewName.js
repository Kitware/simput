/* eslint-disable no-param-reassign */

export default function copyParameterToViewName(
  hookConfig,
  dataModel,
  currentViewData
) {
  if (!currentViewData) {
    return;
  }

  const [attributeName, parameterId] = hookConfig.attribute.split('.');
  if (
    currentViewData[attributeName] &&
    currentViewData[attributeName][parameterId]
  ) {
    currentViewData.name = currentViewData[attributeName][parameterId].value[0];
  }
}
