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
    onChange(value) {
      const newData = Object.assign({}, this.prop.data);
      if (value === null) {
        newData.value.splice(0, 1);
      } else {
        newData.value[0] = value;
      }
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
