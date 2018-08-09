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
