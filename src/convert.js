/* AUTO-GENERATED */
const simputConvert = require('/Users/seb/Documents/code/Web/simput/bin/runtime-utils');
const output = {};
output['data.json'] = (m) => JSON.stringify(m, null, 2);
output['verain.xml'] = require('./templates/vera-xml.hbs');
module.exports = function(dataModel) {
const mapping = {"Materials":[{"extract":["name","density","thexp","fractions"],"src":"material","dst":["CASEID.CORE.Materials.Material_{name}.name=name","CASEID.CORE.Materials.Material_{name}.density=density","CASEID.CORE.Materials.Material_{name}.thexp=thexp","CASEID.CORE.Materials.Material_{name}.fractions=fractions"]}]};
return simputConvert(dataModel, mapping, output);
};