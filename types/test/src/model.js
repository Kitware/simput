module.exports = {
  order: ['SingleView'],
  views: {
    SingleView: {
      label: 'My view',
      attributes: ['attr1'],
    },
  },
  definitions: {
    attr1: {
      label: 'Group 1',
      parameters: [
        {
          id: 'a',
          label: 'Enter an integer',
          type: 'int',
          size: 1,
          default: 0,
        },
        {
          id: 'b',
          type: 'string',
          label: 'Enter 2 strings',
          help: 'Only show if first field if bigger than 5',
          size: 2,
          layout: '2',
          default: ['x', 'y'],
          show: 'a[0] > 5',
        },
        {
          id: 'c',
          label: 'Enter 3 strings',
          type: 'string',
          size: 3,
          layout: '3',
          default: ['x', 'y', 'z'],
        },
      ],
    },
  },
};
