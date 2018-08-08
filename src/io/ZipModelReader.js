import JSZip from 'jszip';

export default class ZipModelReader {
  constructor() {
    this.model = {};
  }

  parseAsArrayBuffer(binaryArrayOrFile) {
    return new Promise((resolve, reject) => {
      // .simput.model
      const zip = new JSZip();
      zip.loadAsync(binaryArrayOrFile).then(() => {
        let found = false;
        zip.forEach((relativePath, zipEntry) => {
          if (relativePath === '.simput.model') {
            found = true;
            zipEntry.async('text').then((txt) => {
              this.model = JSON.parse(txt);
              resolve(this.model);
            });
          }
        });
        if (!found) {
          reject(new Error('No model found'));
        }
      });
    });
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
