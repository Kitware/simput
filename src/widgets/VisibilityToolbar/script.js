// ----------------------------------------------------------------------------

export default {
  name: 'VisibilityToolbar',
  props: {
    title: {
      type: String,
      default: () => 'Visibility List',
    },
    viewer: {
      default: () => null,
    },
    type: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      dropdownVisible: false,
    };
  },
  watch: {
    viewer(viewer) {
      this.subscribeToViewer(viewer);
    },
  },
  methods: {
    onDocMouseDown(ev) {
      if (!this.$refs.container.contains(ev.target)) {
        this.dropdownVisible = false;
      }
    },
    subscribeToViewer(viewer) {
      if (this.sub) {
        this.sub.unsubscribe();
        this.sub = null;
      }

      if (viewer) {
        this.sub = viewer.onModified(viewer.applyVisibility);
      }
    },
    setVisibility(item) {
      if (this.viewer) {
        this.viewer.setObjectVisibility(
          item.id,
          !this.viewer.getObjectVisibility(item.id)
        );
        this.viewer.applyVisibility();
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.onDocMouseDown, true);
    this.sub = null;
    this.subscribeToViewer(this.viewer);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.onDocMouseDown, true);
    this.subscribeToViewer(null);
  },
};
