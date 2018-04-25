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
      hooks: [{ type: 'copyParameterToViewName', attribute: 'rodInfo.name' }],
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
          type: 'float',
          size: 1,
          default: 0,
          label: 'Rod height',
        },
      ],
    },
    rodStack: {
      label: 'Axial definition',
      parameters: [
        {
          id: 'cellIds',
          type: 'string',
          size: -1,
          label: 'Cell types',
        },
        {
          id: 'axialSize',
          type: 'float',
          size: 1,
          default: 1,
          label: 'Cell height',
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
          propType: 'RodCellEditor',
          size: 1,
          default: {
            name: 'Cell name',
            radii: [1],
            mats: ['mod'],
          },
          domain: {
            dynamic: true,
            external: 'materials',
          },
          label: 'Cell',
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
