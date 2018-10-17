import MapEditor from '../MapEditor';
import ViewerWidget from '../ViewerWidget';
import VisibilityToolbar from '../VisibilityToolbar';
import ThreeDToolbar from '../ThreeDToolbar';
import vtkFullCoreVTKViewer from '../FullCoreVTKViewer';

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
      coreViewer: vtkFullCoreVTKViewer.newInstance(),
    };
  },
  computed: {
    viewerData() {
      return this.prop.ui.domain;
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
