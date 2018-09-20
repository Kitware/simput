// ----------------------------------------------------------------------------

export default {
  name: 'RadiusInput',
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
    onBlur: {
      required: true,
      type: Function,
    },
  },
};
