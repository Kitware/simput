// ----------------------------------------------------------------------------

export default {
  name: 'CellDropdown',
  props: {
    value: {
      required: true,
    },
    item: {
      required: true,
    },
    viz: {
      required: true,
    },
    onChange: {
      required: true,
      type: Function,
    },
  },
  methods: {
    toRGB(color) {
      return `rgb(${color.map((i) => Math.floor(i * 255))})`;
    },
  },
};
