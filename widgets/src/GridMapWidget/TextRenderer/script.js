// ----------------------------------------------------------------------------

export default {
  name: 'TextRenderer',
  props: {
    value: {
      type: String,
      default: () => '-',
    },
    mapping: {
      default: () => null,
    },
    colors: {
      default: () => null,
    },
  },
  computed: {
    style() {
      return {
        background: this.colors ? this.colors[this.value] : '#efefef',
      };
    },
  },
};
