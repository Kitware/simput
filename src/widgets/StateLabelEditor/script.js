// ----------------------------------------------------------------------------

export default {
  name: 'StateLabelEditor',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    const { assembly } = this.prop.ui.domain;
    let controlLabels = [];
    Object.keys(assembly).forEach((id) => {
      if (assembly[id].type === 'control' && assembly[id].labels.length) {
        controlLabels = assembly[id].labels.slice();
      }
    });
    return {
      controlLabels,
    };
  },
  computed: {
    viz() {
      return this.prop.ui.domain;
    },
    rodbank() {
      const { data } = this.prop;
      return (data.value && data.value[0]) || {};
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    onStepChange(item, value) {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const rodbank = data.value[0];
        rodbank[item] = value;
        this.$emit('change', data);
      }
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
