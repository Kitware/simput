var template = require('./templates/run.hbs');

module.exports = function convert(dataModel) {
  const results = {};
  const error = null;

  try {
    const simulationPath = dataModel.data.ExampleSelection[0].example['example.path'].value[0];
    results['run.sh'] = template({ simulationPath });
  } catch (e) {
    console.log('Error trying to convert model for generating run.sh', e);
  }

  return { results, error };
};
