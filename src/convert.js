import DEFAULT_SOILS from './defaultSoils';
import tclTemplate from './templates/conus.spinup.hbs';

function get(dataModel, path, defaultValue) {
  const keys = path.split('.');
  let container = dataModel;
  while (container && keys.length) {
    container = container[keys.shift()];
  }

  return container || defaultValue;
}

module.exports = function convert(dataModel) {
  const results = {};

  // Fields extracts
  const [x, y, width, height] = get(
    dataModel,
    'data.RegionSelection.0.AreaSelector.selector.value',
    [0, 0, 3342, 1888]
  );
  const timeRange = get(
    dataModel,
    'data.ForcingDefinition.0.Forcing.selector.value',
    [0, 8760]
  );
  const materials = Object.values(
    get(
      dataModel,
      'data.MaterialDefinition.0.Material.selector.value.0',
      DEFAULT_SOILS
    )
  );

  // Data model for template
  const data = { runname: 'conus.spinup' };
  data.nx = width;
  data.ny = height;
  data.startTime = Number(timeRange[0]) + 1;
  data.stopTime = timeRange[1];
  data.materials = materials || Object.values(DEFAULT_SOILS);
  results['conus.spinup.tcl'] = tclTemplate(data);

  // Extract add-on
  results['data-extract.json'] = JSON.stringify(
    { region: [x, y, width, height], time: timeRange },
    null,
    2
  );

  return { results, model: dataModel };
};
