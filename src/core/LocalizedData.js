/* eslint-disable class-methods-use-this */

const LABEL = (p) => (p && p.label) || 'No Label';

export default class LocalizedLabels {
  constructor(module, defaultLang = 'en') {
    this.allLanguages = module.lang;
    this.model = module.model;
    this.lang = defaultLang;
    this.activeLabels =
      this.allLanguages[this.lang] && this.allLanguages[this.lang]['label.json']
        ? this.allLanguages[this.lang]['label.json']
        : null;
  }

  setLanguage(lang = 'en') {
    this.lang = lang;
  }

  getLanguage(lang) {
    return this.lang;
  }

  getView(name) {
    if (this.activeLabels) {
      return (
        this.activeLabels.views[name] ||
        this.model.views[name].label ||
        'No label in lang or model'
      );
    }
    return LABEL(this.model.views[name]);
  }

  getAttribute(name) {
    const fromLabel =
      this.activeLabels &&
      this.activeLabels.attributes[name] &&
      this.activeLabels.attributes[name].title;
    return fromLabel || LABEL(this.model.definitions[name]);
  }

  getParameter(attributeName, parameterId) {
    const fromLabel =
      this.activeLabels &&
      this.activeLabels.attributes[attributeName] &&
      this.activeLabels.attributes[attributeName].parameters &&
      this.activeLabels.attributes[attributeName].parameters[parameterId];
    return (
      fromLabel ||
      LABEL(
        this.model.definitions[attributeName].parameters.find(
          (p) => p.id === parameterId
        )
      )
    );
  }

  getHelp(attributeName, parameterId) {
    if (this.lang in this.allLanguages) {
      return this.allLanguages[this.lang].help[attributeName][parameterId];
    }
    return `No help for ${attributeName}`;
  }
}
