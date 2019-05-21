import conus from './conus-small.jpg';

export default {
  name: 'RegionSelector',
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    let x1 = Math.floor((3366 - 500) / 2);
    let y1 = Math.floor((1903 - 500) / 2);
    let x2 = Math.floor((3366 - 500) / 2) + 500;
    let y2 = Math.floor((1903 - 500) / 2) + 500;

    if (this.prop.data.value && this.prop.data.value.length === 4) {
      const [x, y, width, height] = this.prop.data.value;
      x1 = x;
      y1 = y;
      x2 = x + width;
      y2 = y + height;
    }

    return {
      conus,
      imageWidth: 3366,
      imageHeight: 1903,
      scaleFactor: 1,
      down: false,
      x1,
      y1,
      x2,
      y2,
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
  watch: {
    x() {
      this.onChange();
    },
    y() {
      this.onChange();
    },
    width() {
      this.onChange();
    },
    height() {
      this.onChange();
    },
  },
  mounted() {
    this.onChange();
  },
  methods: {
    onChange() {
      const newData = Object.assign({}, this.prop.data);
      newData.value = [this.x, this.y, this.width, this.height];
      this.$emit('change', newData);
    },
    onMouseDown(e) {
      const { clientX, clientY } = e;
      const { left, top } = this.$el
        .querySelector('.js-image-selector')
        .getBoundingClientRect();

      const x = Math.round((clientX - left) / this.scaleFactor);
      const y = Math.round((clientY - top) / this.scaleFactor);
      this.down = {
        left,
        top,
        x,
        y,
        originX: this.x,
        originY: this.y,
        dragBox:
          x > Math.min(this.x1, this.x2) &&
          x < Math.max(this.x1, this.x2) &&
          y > Math.min(this.y1, this.y2) &&
          y < Math.max(this.y1, this.y2),
      };

      if (!this.down.dragBox) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = this.x1;
        this.y2 = this.y1;
      }
    },
    onMouseUp(e) {
      this.down = null;
    },
    onMouseMove(e) {
      if (this.down) {
        const { clientX, clientY } = e;
        const { left, top, dragBox, x, y, originX, originY } = this.down;
        if (dragBox) {
          this.x =
            originX + Math.round((clientX - left) / this.scaleFactor) - x;
          this.y = originY + Math.round((clientY - top) / this.scaleFactor) - y;
        } else {
          this.x2 = Math.round((clientX - left) / this.scaleFactor);
          this.y2 = Math.round((clientY - top) / this.scaleFactor);
        }
      }
    },
    onResize() {
      const { offsetWidth } = this.$el.querySelector('.js-image-selector');
      this.scaleFactor = offsetWidth / this.imageWidth;
    },
  },
};
