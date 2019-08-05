// ----------------------------------------------------------------------------

export default {
  name: 'CheckboxProperty',
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
  },
  beforeMount() {
    const update = () => this.$nextTick(this.$forceUpdate);
    this.unsubscribe = this.$store.getters.SIMPUT_DATAMANAGER.subscribe(
      update
    ).unsubscribe;
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
