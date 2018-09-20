// ----------------------------------------------------------------------------

export default {
  name: 'MaterialDropdown',
  props: {
    value: {
      required: true,
    },
    item: {
      required: true,
    },
    materialIds: {
      required: true,
      type: Array,
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
