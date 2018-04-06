module.exports = {
  order: [],
  views: {
    Materials: {
      attributes: ['material'],
      size: -1,
    },
    Cells: {},
    Assembly: {},
    Insert: {},
    Control: {},
    Core: {
      attributes: ['core', 'baffle'],
    },
  },
  definitions: {
    material: {
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'water',
        },
        {
          id: 'density',
          type: 'float',
          size: 1,
          default: 1,
        },
        {
          id: 'thexp',
          type: 'float',
          size: 1,
          default: 1,
        },
        {
          id: 'fractions',
          ui: 'map',
        },
      ],
    },
    baffle: {
      parameters: [
        {
          id: 'gap',
          type: 'float',
          size: 1,
          default: 0,
        },
        {
          id: 'thick',
          type: 'float',
          size: 1,
          default: 0,
        },
        {
          id: 'material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            external: 'materials', // FIXME
          },
        },
      ],
    },
    core: {
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Reactor name',
        },
        {
          id: 'size',
          type: 'integer',
          size: 1,
          default: 15,
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
        },
        {
          id: 'shape',
          type: 'core-shape', // FIXME
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
        },
      ],
    },
  },
};
