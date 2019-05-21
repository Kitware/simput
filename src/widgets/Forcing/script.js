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
  },
  data() {
    return {
      time: [0, 8760],
    };
  },
  methods: {
    toDate(nbHours) {
      const base = Number(new Date('1985-01-01T00:00'));
      const date = new Date(3600000 * nbHours + base);
      return `${date.getFullYear()}/${zp(date.getMonth() + 1)}/${zp(
        date.getDate()
      )} - ${zp(date.getHours())}:${zp(date.getMinutes())}`;
    },
  },
};
