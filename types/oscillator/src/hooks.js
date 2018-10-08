function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
  }
  if (!dataModel.external.viz) {
    dataModel.external.viz = {};
  }

  return dataModel.external;
}

function pushOscillatorsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill positions, radii
  if (dataModel.data.oscillators) {
    const oscillators = dataModel.data.oscillators;
    external.viz.oscillators = [];
    for (let i = 0; i < oscillators.length; i++) {
      if (oscillators[i].oscillator) {
        const osc = oscillators[i].oscillator;
        external.viz.oscillators.push({
          // default to zero if conversion doesn't work.
          center: osc.center.value.map((v) => Math.round(+v) || 0),
          name: osc.name.value[0],
          radius: +osc.radius.value[0] || 1,
          type: osc.type.value[0],
          omega0: +osc.omega0.value[0] || 1,
          zeta: osc.zeta.value ? (+osc.zeta.value[0] || 0) : 0,
          id: i,
        });
      }
    }
  }
}

module.exports = function initialize() {
  Simput.registerHook('oscillatorsToExternal', pushOscillatorsToExternalHook);
};
