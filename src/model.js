module.exports = {
  output: {
    'data.json': { type: 'default' },
    'verain.xml': { type: 'template', template: './templates/vera-xml.hbs' },
  },
  order: ['Materials', 'Core'],
  views: {
    Materials: {
      label: 'Materials',
      attributes: ['material'],
      size: -1,
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
    },
    Cells: {},
    Assembly: {},
    Insert: {},
    Control: {},
    Core: {
      label: 'Core',
      attributes: ['core', 'baffle'],
      output: [
        {
          extract: ['name', 'size', 'height', 'shape'],
          src: 'core',
          dst: [
            'CASEID.case_id=name',
            'CASEID.CORE.core_name=name',
            'CASEID.CORE.core_size=size',
            'CASEID.CORE.height=height',
            'CASEID.CORE.shape=shape',
          ],
        },
        {
          extract: ['gap', 'thick', 'material'],
          src: 'baffle',
          dst: [
            'CASEID.CORE.baffle_gap=gap',
            'CASEID.CORE.baffle_mat=material',
            'CASEID.CORE.baffle_thick=thick',
          ],
        },
      ],
    },
  },
  definitions: {
    material: {
      label: 'Material definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'water',
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
