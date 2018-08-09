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
  computed: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
  },
  methods: {
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
};
