// ----------------------------------------------------------------------------

export default {
  name: 'CellProperty',
  props: {
    data: {
      required: true,
    },
    viewData: {
      required: true,
    },
    ui: {
      required: true,
    },
    show: {
      required: true,
      type: Function,
    },
  },
  computed: {
    isVisible() {
      return this.show(this.viewData);
    },
  },
  methods: {
    onChange(value) {
      const newData = Object.assign({}, this.data);
      if (value === null) {
        newData.value.splice(0, 1);
      } else {
        newData.value[0] = value;
      }
      this.$emit('change', newData);
    },
  },
};
