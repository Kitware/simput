import PalettePicker from 'simput/src/components/widgets/PalettePicker';

// ----------------------------------------------------------------------------

// Be sure to only give a color with only 3 or 4 components!
// Fewer or more components will give you an array with the
// corresponding length!
function colorHexToFloats(color) {
  const hex = color.replace('#', '');
  const floats = [];
  for (let i = 0; i < hex.length; i += 2) {
    floats.push(parseInt(hex.substr(i, 2), 16) / 255);
  }
  return floats;
}

// ----------------------------------------------------------------------------

function colorFloatsToHex(floats) {
  return `#${floats.map((f) => Math.round(f * 255).toString(16)).join('')}`;
}
// ----------------------------------------------------------------------------

export default {
  name: 'CellProperty',
  components: {
    PalettePicker,
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
      help: false,
      color: colorFloatsToHex(this.prop.data.value || this.prop.ui.default),
    };
  },
  watch: {
    prop(prop) {
      this.color = colorFloatsToHex(prop.data.value || prop.ui.default);
    },
    color(val) {
      this.onChange(colorHexToFloats(val));
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    onChange(value) {
      const newData = Object.assign({}, this.prop.data);
      newData.value = value;
      this.$emit('change', newData);
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
