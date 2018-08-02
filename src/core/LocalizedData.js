/* eslint-disable class-methods-use-this */

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
    return this.model.views[name].label || 'No label in model';
  }

  // FIXME...

  getAttribute(name) {
    // ? labels[attrName].title
    // : model.definitions[attrName].label,
    return `L) ${name}`;
  }

  getParameter(attributeName, parameterId) {
    return [attributeName, parameterId].join('_');
  }

  getHelp(attributeName, parameterId) {
    return this.lang[this.lang][attributeName][parameterId];
  }
}
