import grid0 from './grid-0.jpg';
import grid1 from './grid-1.jpg';
import grid2 from './grid-2.jpg';

import SoilWidget from '../SoilWidget';
import DEFAULT_SOILS from '../../defaultSoils';

const IMG_0 = new Image();
const IMG_1 = new Image();
const IMG_2 = new Image();

IMG_0.src = grid0;
IMG_1.src = grid1;
IMG_2.src = grid2;

export default {
  name: 'SoilDefinition',
  components: {
    SoilWidget,
  },
  props: {
    originalSize: {
      type: Array,
      default: () => [3342, 1888],
    },
    offset: {
      type: Number,
      default: 5,
    },
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    const soilData = Object.assign({}, DEFAULT_SOILS, this.prop.data.value[0]);

    return {
      originalLayers: [IMG_0, IMG_1, IMG_2, IMG_2, IMG_2],
      height: 500,
      activeLayer: 4,
      nbSoils: 27,
      colorRange: 206,
      activeSoil: -1,
      soilData,
    };
  },
  computed: {
    layers() {
      const last3 = this.computeActiveSoil(
        this.originalLayers[2],
        this.activeSoil
      );
      return [
        this.computeActiveSoil(this.originalLayers[0], this.activeSoil),
        this.computeActiveSoil(this.originalLayers[1], this.activeSoil),
        last3,
        last3,
        last3,
      ];
    },
  },
  mounted() {
    this.updateSize();
    this.onChange();
  },
  methods: {
    onChange() {
      const newData = Object.assign({}, this.prop.data);
      newData.value = [this.soilData];
      this.$emit('change', newData);
    },
    updateSize() {
      const { offsetWidth } = this.$el;
      const img = this.originalLayers[0];
      this.height = Math.ceil(50 + img.height * (offsetWidth / img.width));
    },
    computeActiveSoil(img, soil) {
      if (soil < 0 || !this.$el) {
        return img.src;
      }

      // Handle focus area
      const { region } = Object.assign(
        { region: [0, 0, this.originalSize[0], this.originalSize[1]] },
        this.prop.ui.domain
      );
      const { originalSize } = this;
      const scale = img.width / originalSize[0];
      const targetRatio = originalSize[1] / originalSize[0];
      const focusSize = {};

      const alternateHeight = Math.round(region[2] * targetRatio);
      const alternateWidth = Math.round(region[3] / targetRatio);

      if (region[2] > alternateWidth) {
        // keep region width
        focusSize.width = Math.round(region[2] + 2 * this.offset);
        focusSize.height = Math.round(alternateHeight + 2 * this.offset);
        const delta = 0.5 * (focusSize.height - region[3]);
        focusSize.cropRegion = {
          x: Math.round(region[0] * scale) - this.offset,
          y: Math.round((region[1] - delta) * scale) - this.offset,
          width: Math.round(focusSize.width * scale) + 2 * this.offset,
          height: Math.round(focusSize.height * scale) + 2 * this.offset,
          rect: [
            this.offset,
            Math.round(delta) + this.offset,
            region[2],
            region[3],
          ],
        };
      } else {
        // keep region height
        focusSize.width = Math.round(alternateWidth + 2 * this.offset);
        focusSize.height = Math.round(region[3] + 2 * this.offset);
        const delta = 0.5 * (focusSize.width - region[2]);
        focusSize.cropRegion = {
          x: Math.round((region[0] - delta) * scale) - this.offset,
          y: Math.round(region[1] * scale) - this.offset,
          width: Math.round(focusSize.width * scale) + 2 * this.offset,
          height: Math.round(focusSize.height * scale) + 2 * this.offset,
          rect: [
            Math.round(delta) + this.offset,
            this.offset,
            region[2],
            region[3],
          ],
        };
      }

      const baseValue = (this.colorRange * soil) / this.nbSoils;
      const tolerance = 0.5 * (this.colorRange / this.nbSoils);

      const soilRange = [baseValue - tolerance, baseValue + tolerance];

      const canvas = this.$el.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = focusSize.width;
      canvas.height = focusSize.height;
      ctx.drawImage(
        img,
        focusSize.cropRegion.x,
        focusSize.cropRegion.y,
        focusSize.cropRegion.width,
        focusSize.cropRegion.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgba = imageData.data;
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i] > soilRange[0] && rgba[i] < soilRange[1]) {
          rgba[i] = 255;
          rgba[i + 1] = 0;
          rgba[i + 2] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Show region
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.rect(...focusSize.cropRegion.rect);
      ctx.stroke();

      return canvas.toDataURL();
    },
  },
};
