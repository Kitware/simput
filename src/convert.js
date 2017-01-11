var template = require('./templates/DockerOpenFOAM_run.hbs');

module.exports = function convert(dataModel) {
  const results = {};
  const error = null;

  const simulationPath = dataModel.data.ExampleSelection[0].example.path.value[0];
  results['DockerOpenFOAM_run.sh'] = template({ simulationPath });

  return { results, error };
};
