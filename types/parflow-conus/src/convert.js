module.exports = function convert(dataModel) {
  const results = {};
  const model = { hello: 'world' };

  console.log(dataModel);

  results['input.json'] = JSON.stringify(model, null, 2);
  return { results, model: dataModel };
};
