var templates = {
  '/0/p': require('./templates/0/p.hbs'),
  '/0/U': require('./templates/0/U.hbs'),
  '/constant/transportProperties': require('./templates/constant/transportProperties.hbs'),
  '/constant/turbulenceProperties': require('./templates/constant/turbulenceProperties.hbs'),
  '/constant/postChannelDict': require('./templates/constant/postChannelDict.hbs'),
  '/constant/fvOptions': require('./templates/constant/fvOptions.hbs'),
  '/system/blockMeshDict': require('./templates/system/blockMeshDict.hbs'),
  '/system/controlDict': require('./templates/system/controlDict.hbs'),
  '/system/decomposeParDict': require('./templates/system/decomposeParDict.hbs'),
  '/system/fvSchemes': require('./templates/system/fvSchemes.hbs'),
  '/system/fvSolution': require('./templates/system/fvSolution.hbs'),
  '/inputs': require('./templates/inputs.hbs'),
};

module.exports = function convert(dataModel) {
  const results = {};

  dataModel.data.CaseBook.forEach((attributes) => {
    const mycase = {};
    Object.keys(attributes.inputs).forEach((fieldName) => {
      mycase[fieldName] = attributes.inputs[fieldName].value[0];
    });

    Object.keys(templates).forEach((path) => {
      results[attributes.other.name.value[0].concat(path)] = templates[path](mycase);
    });
  });

  return { results, model: dataModel };
};
