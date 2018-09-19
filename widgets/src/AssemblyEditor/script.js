import MapEditor from '../MapEditor';
import ViewerWidget from '../ViewerWidget';
import vtkRodMapVTKViewer from '../RodMapVTKViewer';
import VisibilityToolbar from '../VisibilityToolbar';
import ThreeDToolbar from '../ThreeDToolbar';

// ----------------------------------------------------------------------------

export default {
  name: 'RodEditor',
  components: {
    MapEditor,
    ViewerWidget,
    VisibilityToolbar,
    ThreeDToolbar,
  },
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
      assemblyViewer: vtkRodMapVTKViewer.newInstance(),
      is2D: true,
      help: false,
    };
  },
  computed: {
    viz() {
      return this.prop.ui.domain;
    },
    viewerData() {
      return Object.assign(
        {
          selected: this.viewData.id,
        },
        this.prop.ui.domain
      );
    },
    items() {
      return ['0'].concat(
        Object.keys(this.viz.rods).filter(
          (id) => this.viz.rods[id].type === this.viewData.mapInfo.type.value[0]
        )
      );
    },
  },
  methods: {
    convertToRGB(obj) {
      const rgbMap = {};
      const keys = Object.keys(obj);
      while (keys.length) {
        const key = keys.pop();
        rgbMap[key] = `rgb(${obj[key].map((i) => Math.floor(i * 255))})`;
      }
      return rgbMap;
    },

    isVisible() {
      return this.prop.show(this.viewData);
    },
    onModeChange(mode) {
      this.is2D = mode;
    },
  },
  beforeMount() {
    const update = () => this.$nextTick(this.$forceUpdate);
    this.unsubscribe = this.$store.state.templates.dataManager.subscribe(
      update
    ).unsubscribe;
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
