import MapEditor from '../MapEditor';
import ViewerWidget from '../ViewerWidget';
import vtkCoreMapVTKViewer from '../CoreMapVTKViewer';
import VisibilityToolbar from '../VisibilityToolbar';
import ThreeDToolbar from '../ThreeDToolbar';

// ----------------------------------------------------------------------------

export default {
  name: 'CoreEditor',
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
      coreViewer: vtkCoreMapVTKViewer.newInstance(),
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
      const types =
        (this.viz.core.types && this.viz.core.types[this.viewData.id]) || [];
      return ['0'].concat(
        Object.keys(this.viz.assembly).filter(
          (id) => types.indexOf(this.viz.assembly[id].type) > -1
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
