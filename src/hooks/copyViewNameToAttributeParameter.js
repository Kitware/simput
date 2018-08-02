/* eslint-disable no-param-reassign */

export default function copyViewNameToAttributeParameter(
  hookConfiguration,
  fullDataModel,
  localViewDataModel
) {
  const name = localViewDataModel.name;
  const [attributeName, parameterId] = hookConfiguration.attribute.split('.');
  localViewDataModel[attributeName][parameterId].value = [name];
}
