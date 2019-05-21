export default {
  name: 'SoilWidget',
  props: {
    data: {
      type: Object,
      default: () => ({
        name: 's0',
        porosity: 0.0,
        permeability: 0.0,
        relativePermAlpha: 0.0,
        relativePermN: 0.0,
        saturationAlpha: 0.0,
        saturationN: 0.0,
        saturationSRes: 0.0,
      }),
    },
  },
  methods: {
    onChange() {
      this.$emit('change');
    },
  },
};
