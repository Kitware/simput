// ----------------------------------------------------------------------------

export default {
  name: 'CellProperty',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    return { help: false };
  },
  computed: {
    layout() {
      return this.prop.ui.layout || '1';
    },
    size() {
      return this.prop.ui.size || 1;
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    onChange(value, index = 0) {
      const newData = Object.assign({}, this.prop.data);
      if (value === null) {
        newData.value.splice(index, 1);
      } else {
        newData.value[index] = value;
      }
      this.$emit('change', newData);
    },
    getCellLabel(idx) {
      return this.prop.ui.component && this.prop.ui.component[idx];
    },
    getCellAttrs(cellIndex) {
      // cell sizing
      let size = 'xs1';
      let offset = 'offset-xs0';
      if (this.layout === '2x3') {
        size = 'xs4';
      } else if (this.layout === '3x2') {
        size = 'xs6';
      } else if (this.layout === 'm6') {
        size = 'xs4';
        if (cellIndex === 3) {
          offset = 'offset-xs4';
        } else if (cellIndex === 5) {
          offset = 'offset-xs8';
        }
      } else if (this.size <= 12) {
        size = `xs${Math.floor(12 / this.size)}`;
      }

      return {
        [size]: true,
        [offset]: true,
      };
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
