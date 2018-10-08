import macro from 'vtk.js/Sources/macro';
import GaussianVTKViewer from '../GaussianVTKViewer';

const throttle = (fn) => macro.throttle(fn, 100)();

// ----------------------------------------------------------------------------

export default {
  name: 'ViewerWidget',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    return {
      help: false,
      viewer: GaussianVTKViewer.newInstance(),
      timeSlider: 0,
    };
  },
  computed: {
    viewerData() {
      return Object.assign(
        {
          selected: this.viewData.id,
        },
        this.prop.ui.domain
      );
    },
    endTime() {
      return this.prop.ui.domain.endTime;
    },
    timeStep() {
      return this.prop.ui.domain.timeStep;
    },
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
    setSliderTime(value) {
      this.viewer.setTime(value);
      this.timeSlider = value;
    },
    resetCamera() {
      this.viewer.resetCamera();
    }
  },
};
