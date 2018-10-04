import Validate from 'simput/src/core/Validate';
import Convert from 'simput/src/core/Convert';

// ----------------------------------------------------------------------------

export default {
  name: 'InputCell',
  props: {
    label: {
      type: String,
    },
    domain: {
      required: true,
    },
    index: {
      type: Number,
    },
    type: {
      type: String,
    },
    noempty: {
      type: Boolean,
    },
    value: {}, // type: any
  },
  data() {
    return {
      editing: false,
      valueRep: this.value,
    };
  },
  methods: {
    onChange(value) {
      this.editing = true;

      const isValid = Validate[this.type](value);
      if (!this.noEmpty && !value && !isValid) {
        this.$emit('input', undefined);
      } else if (isValid) {
        let propVal = Convert[this.type](value);
        propVal = this.applyDomains(propVal);
        this.$emit('input', propVal);
      }
    },
    applyDomains(val) {
      let newValue = val;

      if (this.domain) {
        if ('range' in this.domain && this.domain.range.length) {
          const size = this.domain.range.length;
          const { min, max, force } = this.domain.range[this.index % size];
          if (force) {
            newValue = min !== undefined ? Math.max(min, newValue) : newValue;
            newValue = max !== undefined ? Math.min(max, newValue) : newValue;
          }
        }
      }

      return newValue;
    }
  },
};
