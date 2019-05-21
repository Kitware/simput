import conus from './conus-small.jpg';

export default {
  name: 'RegionSelector',
  data() {
    return {
      conus,
      imageWidth: 3366,
      imageHeight: 1903,
      scaleFactor: 1,
      down: false,
      x1: Math.floor((3366 - 500) / 2),
      y1: Math.floor((1903 - 500) / 2),
      x2: Math.floor((3366 - 500) / 2) + 500,
      y2: Math.floor((1903 - 500) / 2) + 500,
    };
  },
  computed: {
    x: {
      get() {
        return Math.min(this.x1, this.x2);
      },
      set(v) {
        const w = this.width;
        if (this.x1 < this.x2) {
          this.x1 = Number(v);
          this.x2 = this.x1 + w;
        } else {
          this.x2 = Number(v);
          this.x1 = this.x2 + w;
        }
      },
    },
    y: {
      get() {
        return Math.min(this.y1, this.y2);
      },
      set(v) {
        const h = this.height;
        if (this.y1 < this.y2) {
          this.y1 = Number(v);
          this.y2 = this.y1 + h;
        } else {
          this.y2 = Number(v);
          this.y1 = this.y2 + h;
        }
      },
    },
    width: {
      get() {
        return Math.abs(this.x1 - this.x2);
      },
      set(v) {
        if (this.x1 < this.x2) {
          this.x2 = this.x1 + Number(v);
        } else {
          this.x1 = this.x2 + Number(v);
        }
      },
    },
    height: {
      get() {
        return Math.abs(this.y1 - this.y2);
      },
      set(v) {
        if (this.y1 < this.y2) {
          this.y2 = this.y1 + Number(v);
        } else {
          this.y1 = this.y2 + Number(v);
        }
      },
    },
  },
  methods: {
    onMouseDown(e) {
      const { clientX, clientY } = e;
      const { left, top } = this.$el
        .querySelector('.js-image-selector')
        .getBoundingClientRect();
      this.down = { left, top };
      this.x1 = Math.round((clientX - left) / this.scaleFactor);
      this.y1 = Math.round((clientY - top) / this.scaleFactor);
      this.x2 = this.x1;
      this.y2 = this.y1;
    },
    onMouseUp(e) {
      this.down = null;
    },
    onMouseMove(e) {
      if (this.down) {
        const { clientX, clientY } = e;
        const { left, top } = this.down;
        this.x2 = Math.round((clientX - left) / this.scaleFactor);
        this.y2 = Math.round((clientY - top) / this.scaleFactor);
      }
    },
    onResize() {
      const { offsetWidth } = this.$el.querySelector('.js-image-selector');
      this.scaleFactor = offsetWidth / this.imageWidth;
    },
  },
};
