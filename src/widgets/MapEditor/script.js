import GridMapWidget from '../GridMapWidget';

// ----------------------------------------------------------------------------

export default {
  name: 'MapEditor',
  components: {
    GridMapWidget,
  },
  props: {
    data: {
      required: true,
    },
    gridSize: {
      required: true,
      type: Number,
    },
    items: {
      required: true,
      type: Array,
    },
    names: {
      required: true,
    },
    colors: {
      required: true,
    },
  },
  computed: {
    itemRendererProps() {
      return {
        mapping: this.names,
        colors: this.colors,
      };
    },
    gridState() {
      return Object.assign(
        {
          grid: [],
          symmetry: 3,
          replacementMode: 0,
        },
        this.data.value[0]
      );
    },
  },
  methods: {
    onChange(state) {
      if (!this.data.value) {
        this.$set(this.data, 'value', [{}]);
      }
      this.$set(this.data.value, 0, Object.assign(this.data.value[0], state));
      this.$emit('change', this.data);
    },
  },
};
