// ----------------------------------------------------------------------------
// Color palettes
// ----------------------------------------------------------------------------

const materialPalette = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
  '#51574a',
  '#447c69',
  '#74c493',
  '#8e8c6d',
  '#e4bf80',
  '#e9d78e',
  '#e2975d',
  '#f19670',
  '#e16552',
  '#c94a53',
  '#be5168',
  '#a34974',
  '#993767',
  '#65387d',
  '#4e2472',
  '#9163b6',
  '#e279a3',
  '#e0598b',
  '#7c9fb0',
  '#5698c4',
  '#9abf88',
];

const cellPalette = [
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666666',
];

const rodPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

const mapPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

// ----------------------------------------------------------------------------
// Model definition
// ----------------------------------------------------------------------------

module.exports = {
  scripts: [
    // 'https://unpkg.com/@doe-casl/verain-view@1.1.1/dist/simput-external-vera.js',
    'simput-external-vera.js',
  ],
  defaultActiveView: 'Specifications',
  order: ['Specifications', 'Materials'],
  views: {
    Specifications: {
      label: 'Specifications',
      attributes: ['coreSpec', 'assemblySpec', 'baffleSpec'],
      hooks: [
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.grid.value.0',
          dst: 'assemblySize',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'assemblyPitch',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.coreSpec.grid.value.0',
          dst: 'coreSize',
        },
      ],
    },
    Materials: {
      label: 'Materials',
      attributes: ['material'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'material.name' },
        { type: 'specsToExternal' },
        { type: 'materialsToExternal' },
        { type: 'addNextView', viewName: 'Materials', nextViewName: 'Cells' },
      ],
    },
    Cells: {
      label: 'Cells',
      attributes: ['cell'],
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'cell.name' },
        { type: 'cellsToExternal' },
        { type: 'updateMaterialUsed' },
        { type: 'addNextView', viewName: 'Cells', nextViewName: 'Rods' },
        {
          type: 'copy',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'cell.pitch',
        },
      ],
      size: -1,
      readOnly: true,
    },
    Rods: {
      label: 'Rods',
      attributes: ['rodInfo', 'rodStack'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'rodInfo.name' },
        { type: 'updateCellUsed' },
        {
          type: 'copy',
          src: 'data.Specifications.0.coreSpec.height.value.0',
          dst: 'rodInfo.height',
        },
        { type: 'rodsToExternal' },
        { type: 'addNextView', viewName: 'Rods', nextViewName: 'Maps' },
      ],
    },
    Maps: {
      label: 'Rod maps',
      attributes: ['mapInfo', 'rodMap'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'updateRodUsed' },
        { type: 'copyParameterToViewName', attribute: 'mapInfo.name' },
      ],
    },
    Core: {},
  },
  definitions: {
    coreSpec: {
      label: 'Core Specifications',
      parameters: [
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 15,
          label: 'Size',
          help: 'Size of the grid for the core',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
          label: 'Core height',
          help: 'Height of the core in cm.',
        },
      ],
    },
    assemblySpec: {
      label: 'Assembly Specifications',
      parameters: [
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 17,
          label: 'Size',
          help: 'Size of the grid for an assembly',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 1.26,
          label: 'Cell pitch',
          help: 'Default cell pitch in assemblies',
        },
      ],
    },
    baffleSpec: {
      label: 'Baffle Specifications',
      parameters: [
        {
          id: 'thick',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Thickness',
        },
        {
          id: 'gap',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Gap',
        },
        {
          id: 'material',
          type: 'int',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialNames',
          },
          label: 'Material',
        },
      ],
    },
    material: {
      label: 'Material definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: '',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: materialPalette,
          },
        },
        {
          id: 'density',
          type: 'float',
          size: 1,
          default: 1,
          label: 'Density',
        },
        {
          id: 'thexp',
          type: 'float',
          size: 1,
          default: 1,
          label: 'Thermal Expansion Coefficient',
        },
        {
          id: 'fractions',
          ui: 'map',
          label: 'Material fractions (material:fraction)',
        },
      ],
    },
    cell: {
      label: 'Cell definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: '',
          label: 'Name',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Contact radius/pitch',
          domain: {
            readOnly: true,
          },
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: cellPalette,
          },
        },
        {
          id: 'cell',
          propType: 'CellEditor',
          size: 1,
          default: {
            name: 'Cell name',
            radii: [],
            mats: [],
          },
          domain: {
            dynamic: true,
            external: 'materials',
          },
          label: 'Cell',
        },
      ],
    },
    rodInfo: {
      label: 'Rod description',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: '',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: rodPalette,
          },
        },
        {
          id: 'height',
          type: 'string',
          size: 1,
          default: '',
          label: 'Rod height',
          domain: {
            readOnly: true,
          },
        },
      ],
    },
    rodStack: {
      label: 'Axial definition',
      parameters: [
        {
          id: 'rod',
          propType: 'RodEditor',
          size: 1,
          default: {
            stack: [],
          },
          domain: {
            dynamic: true,
            external: ['cells', 'materials'],
          },
          label: 'Rod',
        },
      ],
    },
    mapInfo: {
      label: 'Rod map',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Assembly',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: mapPalette,
          },
        },
      ],
    },
    rodMap: {
      label: 'Layout definition',
      parameters: [
        {
          id: 'map',
          propType: 'MapEditor',
          size: 1,
          default: {},
          domain: {
            dynamic: true,
            external: ['assemblySize', 'rodsNames', 'rodsColors'],
          },
          label: 'Rod',
        },
      ],
    },
  },
};
