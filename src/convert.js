/* eslint-disable global-require */
/* eslint-disable prefer-arrow-callback */
var defaults = require('./templates/templateModel.js');
var mapping = require('./templates/templateMapping.js');
var applyMapping = require('./applyMapping.js');

var templates = {
  '0.orig/include/fixedInlet': require('./templates/0.orig/include/fixedInlet.hbs'),
  '0.orig/include/frontBackUpperPatches': require('./templates/0.orig/include/frontBackUpperPatches.hbs'),
  '0.orig/include/initialConditions': require('./templates/0.orig/include/initialConditions.hbs'),
  '0.orig/k': require('./templates/0.orig/k.hbs'),
  '0.orig/nut': require('./templates/0.orig/nut.hbs'),
  '0.orig/omega': require('./templates/0.orig/omega.hbs'),
  '0.orig/p': require('./templates/0.orig/p.hbs'),
  '0.orig/U': require('./templates/0.orig/U.hbs'),
  'constant/transportProperties': require('./templates/constant/transportProperties.hbs'),
  'constant/turbulenceProperties': require('./templates/constant/turbulenceProperties.hbs'),
  'system/blockMeshDict': require('./templates/system/blockMeshDict.hbs'),
  'system/controlDict': require('./templates/system/controlDict.hbs'),
  'system/decomposeParDict': require('./templates/system/decomposeParDict.hbs'),
  'system/forceCoeffs': require('./templates/system/forceCoeffs.hbs'),
  'system/fvSchemes': require('./templates/system/fvSchemes.hbs'),
  'system/fvSolution': require('./templates/system/fvSolution.hbs'),
  'system/meshQualityDict': require('./templates/system/meshQualityDict.hbs'),
  'system/snappyHexMeshDict': require('./templates/system/snappyHexMeshDict.hbs'),
  'system/surfaceFeatureExtractDict': require('./templates/system/surfaceFeatureExtractDict.hbs'),
  Allclean: require('./templates/Allclean.hbs'),
  Allrun: require('./templates/Allrun.hbs'),
  DockerRun: require('./templates/DockerRun.hbs'),
};

var permissions = {
  Allclean: 'u+x',
  Allrun: 'u+x',
  DockerRun: 'u+x',
};

module.exports = function convert(dataModel) {
  const results = {}; // 'dataset.foam': ''
  let error = [];
  const templateModel = {};

  applyMapping(templateModel, dataModel, mapping, defaults);

  // => Missing from mapping
  templateModel.tunnel.simpleGrading = [1, 1, 1];
  templateModel.controls.purgeWrite = 0;
  templateModel.controls.writeCompression = 'uncompressed';
  templateModel.controls.runTimeModifiable = 'true';
  templateModel.forceCoeffs.patches = [templateModel.meshGroupName];
  templateModel.hexMesh.steps = ['castellatedMesh', 'snap', 'addLayers'];

  Object.keys(templates).forEach(function processFile(path) {
    try {
      results[path] = templates[path](templateModel);
    } catch (e) {
      const message = `Error trying to convert model for generating ${path}`;
      error.push(message);
      console.log(message, e);
    }
  });

  if (!error.length) {
    error = null;
  }

  return { results, error, model: dataModel, permissions };
};
