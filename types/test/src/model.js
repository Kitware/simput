module.exports = {
  order: ['SingleView'],
  views: {
    SingleView: {
      attributes: ['attr1'],
    },
  },
  definitions: {
    attr1: {
      parameters: [
        {
          id: 'a',
          type: 'int',
          size: 1,
          default: 0,
        },
        {
          id: 'b',
          type: 'string',
          size: 2,
          layout: '2',
          default: ['x', 'y'],
          show: 'a[0] > 5',
        },
        {
          id: 'c',
          type: 'string',
          size: 3,
          layout: '3',
          default: ['x', 'y', 'z'],
        },
      ],
    },
  },
};
