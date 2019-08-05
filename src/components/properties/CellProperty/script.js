import InputCell from 'simput/src/components/properties/CellProperty/InputCell';

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
  components: {
    InputCell,
  },
  data() {
    return { help: false };
  },
  computed: {
    layout() {
      return String(this.prop.ui.layout) || '1';
    },
    size() {
      if (this.layout === '-1') {
        return this.prop.data.value.length;
      }
      return this.prop.ui.size || 1;
    },
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
    addValue() {
      const newData = Object.assign({}, this.prop.data);
      const values = newData.value;

      switch (values.length) {
        case 0: {
          values.push(0);
          break;
        }
        case 1: {
          values.push(values[0]);
          break;
        }
        default: {
          const last = Number(values[values.length - 1]);
          const beforeLast = Number(values[values.length - 2]);
          const newValue = last + (last - beforeLast);
          if (!Number.isNaN(newValue) && Number.isFinite(newValue)) {
            values.push(newValue);
          } else {
            values.push(values[values.length - 1]);
          }
        }
      }

      this.$emit('change', newData);
    },
    getCellLabel(idx) {
      return this.prop.ui.component && this.prop.ui.component[idx];
    },
    getCellAttrs(cellIndex) {
      // cell sizing
      let size = 'xs1';
      let offset = 'offset-xs0';
      if (this.layout === '2x3') {
        size = 'xs4';
      } else if (this.layout === '3x2') {
        size = 'xs6';
      } else if (this.layout === 'm6') {
        size = 'xs4';
        if (cellIndex === 3) {
          offset = 'offset-xs4';
        } else if (cellIndex === 5) {
          offset = 'offset-xs8';
        }
      } else if (String(this.layout) === '-1') {
        size = 'xs11';
      } else if (this.size <= 12) {
        size = `xs${Math.floor(12 / this.size)}`;
      }

      return {
        [size]: true,
        [offset]: true,
      };
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
