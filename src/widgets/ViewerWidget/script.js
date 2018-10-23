import macro from 'vtk.js/Sources/macro';

const throttle = (fn) => macro.throttle(fn, 100)();

// ----------------------------------------------------------------------------

export default {
  name: 'ViewerWidget',
  props: {
    viewer: {
      required: true,
    },
    viewerData: {
      required: false,
    },
    absolute: {
      type: Boolean,
      default: () => true,
    },
  },
  computed: {
    styles() {
      return {
        position: this.absolute ? 'absolute' : 'relative',
      };
    }
  },
  watch: {
    viewerData(data) {
      this.viewer.setData(data);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.viewer.setContainer(this.$refs.container);
      this.viewer.setData(this.viewerData);

      window.addEventListener('resize', this.resize);
      this.resize();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      if (this.viewer.resize) {
        throttle(this.viewer.resize);
      }
    },
  },
};
