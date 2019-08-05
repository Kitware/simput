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
    onChange(key, value, index = 0) {
      const newData = Object.assign({}, this.prop.data);
      if (key === value && key === undefined) {
        newData.value.splice(index, 1);
      } else {
        newData.value[index][key] = value;
      }
      this.$emit('change', newData);
    },
    addEntry() {
      const newData = Object.assign({}, this.prop.data);
      newData.value.push({
        name: '',
        value: '',
      });
      this.$emit('change', newData);
    },
    removeEntry(index) {
      this.onChange(undefined, undefined, index);
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
