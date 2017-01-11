var template = require('./templates/DockerOpenFOAM_run.hbs');

module.exports = function convert(dataModel) {
  const results = {};
  const error = null;

  try {
    const simulationPath = dataModel.data.ExampleSelection[0].example['example.path'].value[0];
    results['DockerOpenFOAM_run.sh'] = template({ simulationPath });
  } catch (e) {
    console.log('Error trying to convert model for generating DockerOpenFOAM_run.sh', e);
  }

  return { results, error };
};
