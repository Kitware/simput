function rgb2css(rgb) {
  return `rgb(${rgb.map((comp) => Number(comp) * 255).join(', ')})`;
}

// ----------------------------------------------------------------------------

export default {
  name: 'ListItemWithColor',
  props: {
    label: {
      type: String,
      required: true,
    },
    viewItem: {
      required: true,
    },
  },
  computed: {
    color() {
      const keys = Object.keys(this.viewItem);
      for (let i = 0; i < keys.length; i++) {
        const obj = this.viewItem[keys[i]];
        if (typeof obj === 'object' && 'color' in obj) {
          return rgb2css(obj.color.value);
        }
      }
      return [1, 1, 1]; // default
    },
  },
};
