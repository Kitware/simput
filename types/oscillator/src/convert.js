const outputTemplate = require('./output.hbs');

module.exports = function convert(dataModel) {
  const results = {};
  const oscillatorsList = [];

  dataModel.data.oscillators.forEach((attributes) => {
    const oscillator = {};
    Object.keys(attributes.oscillator).forEach((fieldName) => {
      oscillator[fieldName] = attributes.oscillator[fieldName].value[0];
    });
    oscillatorsList.push(oscillator);
  });

  results['sample.osc'] = outputTemplate(oscillatorsList);

  return { results, model: dataModel };
};
