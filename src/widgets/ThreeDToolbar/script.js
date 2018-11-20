// ----------------------------------------------------------------------------

export default {
  name: 'ThreeDToolbar',
  props: {
    viewer: {
      default: () => null,
    },
    initialZScaling: {
      type: Number,
      default: () => 1,
    },
    zRange: {
      type: Array,
      default: () => [],
    },
    orientation: {
      type: Array,
      default: () => [0, 0, 10000000],
    },
    viewUp: {
      type: Array,
      default: () => [0, 1, 0],
    },
    zoom: {
      type: Number,
      default: () => 1,
    },
    dark: {
      type: Boolean,
      default: () => false,
    },
    fixedParallelRendering: {
      type: String,
      required: false,
      validator(val) {
        return ['2d', '3d'].indexOf(val) > -1;
      },
    },
  },
  data() {
    let zSlider = 1;
    if (this.zRange.length) {
      const [start, end] = this.zRange;
      zSlider = Math.abs(
        Math.round((100 * (this.initialZScaling - start)) / (end - start))
      );
    }
    return {
      parallelRendering: this.parallelRendering === '2d',
      zSlider,
      zScaling: this.initialZScaling,
    };
  },
  methods: {
    resetCamera() {
      if (this.viewer) {
        this.viewer.resetCamera(null, null, this.zoom);
      }
    },
    resetCameraFull() {
      if (this.viewer) {
        this.viewer.resetCamera(this.orientation, this.viewUp, this.zoom);
      }
    },
    toggleParallelRendering() {
      if (this.viewer && !this.fixedParallelRendering) {
        const state = !this.parallelRendering;
        this.resetCameraFull();
        this.viewer.setParallelRendering(state);
        this.parallelRendering = state;
      }
    },
    setSliderZScale(value) {
      this.zSlider = Number(value);
      if (this.viewer) {
        const [start, end] = this.zRange;
        const zScaling = start + ((end - start) * value) / 100;
        this.zScaling = zScaling;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.viewer.setZScale(this.zScaling);
      this.resetCameraFull();
    }, 0);
  },
  updated() {
    if (this.viewer) {
      this.viewer.setZScale(this.zScaling);
    }
  },
};
