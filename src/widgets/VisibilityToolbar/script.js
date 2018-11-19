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
    dark: {
      type: Boolean,
      default: () => false,
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
    getItems() {
      const set = new Set();
      const items = [];
      const opts = this.viewer.getVisibiltyOptions();
      for (let i = 0; i < opts.length; i++) {
        if (!set.has(opts[i].id)) {
          items.push(opts[i]);
          set.add(opts[i].id);
        }
      }
      return items;
    },
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
    redraw() {
      this.$forceUpdate();
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
