const EMPTY_ENTRY = '-';

function convertToRGB(obj) {
  const rgbMap = {};
  const keys = Object.keys(obj);
  while (keys.length) {
    const key = keys.pop();
    rgbMap[key] = `rgb(${obj[key].map((i) => Math.floor(i * 255))})`;
  }
  return rgbMap;
}

// ----------------------------------------------------------------------------

export default {
  name: 'StateMapEditor',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    const { assembly, core, coreGridSize, colors } = this.prop.ui.domain;
    const labels = { [EMPTY_ENTRY]: [] };

    const controlMapIds = Object.keys(assembly).filter((id) => {
      labels[id] = assembly[id].labels;
      // add blank entry, so user sets all values explicitly.
      if (labels[id].length) labels[id].unshift('');
      return assembly[id].type === 'control';
    });

    let controlGrid = [];
    if (core.types) {
      const gridControlId = Object.keys(core.types).find(
        (t) => core.types[t].indexOf('control') !== -1
      );
      controlGrid = core[gridControlId].map(
        (id) => (controlMapIds.indexOf(id) === -1 ? EMPTY_ENTRY : id)
      );
    }
    const size = coreGridSize * coreGridSize;

    const labelGrid = this.prop.data.value;

    return {
      size,
      controlGrid,
      labels,
      labelGrid,
      colors: convertToRGB(colors),
    };
  },
  computed: {
    viz() {
      return this.prop.ui.domain;
    },
    gridStyle() {
      const { coreGridSize } = this.viz;
      return {
        gridTemplateColumns: `repeat(${coreGridSize}, ${100 / coreGridSize}%)`,
      };
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    onLabelChange(index, value) {
      this.labelGrid[index] = value;
      const { data } = this.prop;
      data.value = this.labelGrid;
      this.$emit('change', data);
    },
  },
  mounted() {
    const update = () => this.$nextTick(this.$forceUpdate);
    this.unsubscribe = this.$store.state.templates.dataManager.subscribe(
      update
    ).unsubscribe;

    if (!this.labelGrid || this.labelGrid.length !== this.size) {
      this.labelGrid = this.controlGrid.map((id) => {
        const l = this.labels[id] || [];
        return (l.length && l[0]) || '';
      });
      this.prop.data.value = this.labelGrid;
      this.$emit('change', this.prop.data);
    }
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
