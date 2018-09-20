// ----------------------------------------------------------------------------

export default {
  name: 'LengthInput',
  props: {
    value: {
      required: true,
    },
    item: {
      required: true,
    },
    onChange: {
      required: true,
      type: Function,
    },
  },
};
