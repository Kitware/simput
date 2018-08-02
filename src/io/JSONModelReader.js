export default class JSONModelReader {
  constructor() {
    this.model = {};
  }

  parseAsText(str) {
    this.model = JSON.parse(str);
    return Promise.resolve(this.model);
  }

  getType() {
    return this.model.type;
  }

  setType(newType) {
    this.model.type = newType;
  }

  getData() {
    if (!this.model.data) {
      this.model.data = {};
    }
    return this.model.data;
  }

  getExternal() {
    if (!this.model.external) {
      this.model.external = {};
    }
    return this.model.external;
  }

  getModel() {
    return this.model;
  }
}
