module.exports = {
  scripts: [],
  defaultActiveView: 'Welcome',
  order: [
    'Welcome',
    'RegionSelection',
    'MaterialDefinition',
    'ForcingDefinition',
  ],
  views: {
    Welcome: {
      label: 'ParFlow CONUS extract',
      attributes: ['Introduction'],
    },
    RegionSelection: {
      label: 'Region selection',
      attributes: ['AreaSelector'],
    },
    MaterialDefinition: {
      label: 'Material definition',
      attributes: ['Material'],
    },
    ForcingDefinition: {
      label: 'Time period',
      attributes: ['Forcing'],
    },
  },
  definitions: {
    Introduction: {
      label: 'ParFlow Continental US (CONUS)',
      parameters: [
        {
          id: 'title',
          propType: 'ParflowIntroduction',
          size: 1,
        },
      ],
    },
    AreaSelector: {
      label: 'Select area of interest',
      parameters: [
        {
          id: 'selector',
          propType: 'RegionSelector',
          size: 1,
          default: {},
        },
      ],
    },
    Material: {
      label: 'Soil definition',
      parameters: [
        {
          id: 'selector',
          propType: 'SoilDefinition',
          size: 1,
          default: {},
        },
      ],
    },
    Forcing: {
      label: 'Forcing definition',
      parameters: [
        {
          id: 'selector',
          propType: 'Forcing',
          size: 1,
          default: {},
        },
      ],
    },
  },
};
