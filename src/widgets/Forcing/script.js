function zp(n) {
  if (n > 9) {
    return n;
  }
  return `0${n}`;
}

export default {
  name: 'Forcing',
  props: {
    timeRange: {
      type: Array,
      default: () => [0, 8760],
    },
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    const time = (this.prop.data.value &&
      this.prop.data.value.length === 2 &&
      this.prop.data.value) || [0, 8760];
    return { time };
  },
  watch: {
    time() {
      this.onChange();
    },
  },
  mounted() {
    this.onChange();
  },
  methods: {
    onChange() {
      const newData = Object.assign({}, this.prop.data);
      newData.value = this.time.slice();
      this.$emit('change', newData);
    },
    toDate(nbHours) {
      const base = Number(new Date('1985-01-01T00:00'));
      const date = new Date(3600000 * nbHours + base);
      return `${date.getFullYear()}/${zp(date.getMonth() + 1)}/${zp(
        date.getDate()
      )} - ${zp(date.getHours())}:${zp(date.getMinutes())}`;
    },
  },
};
