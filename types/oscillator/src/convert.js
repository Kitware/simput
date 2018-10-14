const outputTemplate = require('./oscillator_list.hbs');
const configTemplate = require('./analysis_config.hbs');
const runTemplate = require('./run_script.hbs');

/*
# type      center          r       omega0      zeta
*/

const COLUMN_SPACING = 5;

module.exports = function convert(dataModel) {
  const results = {};
  // Start with a standard header
  const lines = [['# type  ', 'center  ', 'r  ', 'omega0  ', 'zeta']];

  dataModel.data.oscillators.forEach((attributes) => {
    const oscillator = {};
    Object.keys(attributes.oscillator).forEach((fieldName) => {
      const value = attributes.oscillator[fieldName].value;
      if (value.length === 1) {
        oscillator[fieldName] = value[0];
      } else {
        oscillator[fieldName] = value;
      }
    });
    lines.push([
      `${oscillator.type}`,
      `${oscillator.center[0]} ${oscillator.center[1]} ${oscillator.center[2]}`,
      `${oscillator.radius}`,
      `${oscillator.omega0}`,
      `${oscillator.zeta || ''}`,
    ]);
  });

  // Compute max size of each column
  const sizes = [0, 0, 0, 0, 0];
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let tokenIdx = 0; tokenIdx < line.length; tokenIdx++) {
      sizes[tokenIdx] = Math.max(sizes[tokenIdx], line[tokenIdx].length);
    }
  }

  // Add padding to align columns
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let tokenIdx = 0; tokenIdx < line.length; tokenIdx++) {
      while (line[tokenIdx].length < sizes[tokenIdx] + COLUMN_SPACING) {
        line[tokenIdx] += ' ';
      }
    }
    // collapse tokens
    lines[lineIdx] = { line: lines[lineIdx].join('') };
  }

  // Use dummy line writer
  results['oscillator_list.osc'] = outputTemplate({ lines });

  // analyses, have sub-object matching type, with the attributes.
  const histogram = [];
  const autocorrelation = [];
  dataModel.data.analyses.forEach((attributes) => {
    const analysis = {};
    const type = attributes.analysis.type.value[0];
    Object.keys(attributes[type]).forEach((fieldName) => {
      const value = attributes[type][fieldName].value;
      if (value.length === 1) {
        analysis[fieldName] = value[0];
      } else {
        analysis[fieldName] = value;
      }
    });
    console.log(analysis);
    if (type === 'histogram') {
      // fill in associated fields.
      if (analysis.mesh === 'particles') {
        analysis.array = "velocityMagnitude";
        analysis.association="point";
      } else {
        analysis.array = "data";
        analysis.association="cell";
      }
      histogram.push(analysis);
    } else if (type === 'autocorrelation') {
      autocorrelation.push(analysis);
    }
  });

  // analysis xml
  results['analysis_config.xml'] = configTemplate({ histogram, autocorrelation });


  const runParams = {};
  if (dataModel.data.run) {
    const params = dataModel.data.run[0].runParams;
    Object.keys(params).forEach((fieldName) => {
      const value = params[fieldName].value;
      if (value.length === 1) {
        runParams[fieldName] = value[0];
      } else {
        runParams[fieldName] = value;
      }
    });
  }

  // analysis xml
  results['run.sh'] = runTemplate(runParams);

  return { results, model: dataModel };
};
