const palette = [
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

module.exports = {
  scripts: [
    // 'https://unpkg.com/@doe-casl/verain-view@1.1.1/dist/simput-external-vera.js',
    'simput-external-vera.js',
  ],
  output: {
    'data.json': { type: 'default' },
    'verain.xml': { type: 'template', template: './templates/vera-xml.hbs' },
  },
  defaultActiveView: 'Specifications',
  order: ['Specifications', 'Materials'],
  views: {
    Specifications: {
      label: 'Specifications',
      attributes: ['coreSize'],
    },
    Materials: {
      label: 'Materials',
      attributes: ['material'],
      size: -1,
      readOnly: true,
      output: [
        {
          extract: ['name', 'density', 'thexp', 'fractions'],
          src: 'material',
          dst: [
            // 'CASEID.CORE.Materials.{name}.name=name',
            // 'CASEID.CORE.Materials.{name}.density=density',
            // 'CASEID.CORE.Materials.{name}.thexp=thexp',
            // 'CASEID.CORE.Materials.{name}.fractions=fractions',

            // 'CASEID.CORE.Materials[]+=name',
            // 'CASEID.CORE.Materials.{name}.name=name',
            // 'CASEID.CORE.Materials.{name}.density=density',
            // 'CASEID.CORE.Materials.{name}.thexp=thexp',
            // 'CASEID.CORE.Materials.{name}.fractions=fractions',

            'CASEID.CORE.Materials.Material_{name}.name=name',
            'CASEID.CORE.Materials.Material_{name}.density=density',
            'CASEID.CORE.Materials.Material_{name}.thexp=thexp',
            'CASEID.CORE.Materials.Material_{name}.fractions=fractions',
          ],
        },
      ],
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'material.name' },
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
        {
          type: 'copy',
          src: 'data.Specifications.0.coreSize.height.value.0',
          dst: 'rodInfo.height',
        },
      ],
    },
    Assembly: {},
    Insert: {},
    Control: {},
  },
  definitions: {
    coreSize: {
      label: 'Core dimensions',
      parameters: [
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
          label: 'Core height',
          help: 'Height of the core in cm.',
        },
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 15,
          label: 'Grid size',
          help: 'Size of the grid for the core',
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
    material: {
      label: 'Material definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Water',
          label: 'Name',
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
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette,
          },
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
          default: 'Control A',
          label: 'Name',
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
    baffle: {
      label: 'Baffle definition',
      parameters: [
        {
          id: 'gap',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Gap',
        },
        {
          id: 'thick',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Thickness',
        },
        {
          id: 'material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            external: 'materials', // FIXME
          },
          label: 'Material',
        },
      ],
    },
    core: {
      label: 'Core definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Reactor name',
          label: 'Name',
        },
        {
          id: 'size',
          type: 'integer',
          size: 1,
          default: 15,
          label: 'Number of elements in grid',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
          label: 'Height',
        },
        {
          id: 'shape',
          type: 'core-shape', // FIXME
          label: 'Mask',
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
          default: 'A',
          label: 'Name',
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
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette,
          },
        },
      ],
    },
    assemblyMap: {
      parameters: [
        {
          id: 'layout',
          type: 'grid-layout',
          domain: {
            gridSize: 'core.size', // FIXME
            mask: 'core.shape', // FIXME
            values: 'Assembly.name', // FIXME
          },
          label: 'Layout',
        },
      ],
    },
  },
};
