// ----------------------------------------------------------------------------

export default {
  name: 'Rod2DPreview',
  props: {
    offset: {
      type: Number,
      default() {
        return 0;
      },
    },
    totalLength: {
      type: Number,
      default() {
        return 1;
      },
    },
    stack: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    remaining() {
      return Number(
        this.totalLength -
          this.offset -
          this.stack.map((l) => l.length).reduce((a, b) => a + b, 0)
      ).toFixed(1);
    },
  },
};
