// ----------------------------------------------------------------------------

export default {
  name: 'EnumProperty',
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
    items() {
      const values = [];
      Object.keys(this.prop.ui.domain).forEach((text) => {
        values.push({ text, value: this.prop.ui.domain[text] });
      });
      return values;
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    toValue(value) {
      const text = Object.keys(this.prop.ui.domain).find(
        (i) => this.prop.ui.domain[i] === value
      );
      if (value && text !== undefined) {
        return { value, text };
      }
      return null;
    },
    onChange(item, index = 0) {
      if (!item || this.prop.data.value[index] === item.value) {
        return;
      }
      this.prop.data.value[index] = item.value;
      this.$emit('change', this.prop.data);
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
