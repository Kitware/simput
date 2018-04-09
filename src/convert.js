/* AUTO-GENERATED */
const simputConvert = require('/Users/seb/Documents/code/Web/simput/bin/runtime-utils');
const output = {};
output['data.json'] = (m) => JSON.stringify(m, null, 2);
output['verain.xml'] = require('./templates/vera-xml.hbs');
module.exports = function(dataModel) {
const mapping = {"Materials":[{"extract":["name","density","thexp","fractions"],"src":"material","dst":["CASEID.CORE.Materials.Material_{name}.name=name","CASEID.CORE.Materials.Material_{name}.density=density","CASEID.CORE.Materials.Material_{name}.thexp=thexp","CASEID.CORE.Materials.Material_{name}.fractions=fractions"]}],"Core":[{"extract":["name","size","height","shape"],"src":"core","dst":["CASEID.case_id=name","CASEID.CORE.core_name=name","CASEID.CORE.core_size=size","CASEID.CORE.height=height","CASEID.CORE.shape=shape"]},{"extract":["gap","thick","material"],"src":"baffle","dst":["CASEID.CORE.baffle_gap=gap","CASEID.CORE.baffle_mat=material","CASEID.CORE.baffle_thick=thick"]}]};
return simputConvert(dataModel, mapping, output);
};