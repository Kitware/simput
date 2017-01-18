/* eslint-disable */
var template = require('./templates/output.hbs');

module.exports = function (model) {
    var templateData = { data: {}, valid: true , errors: []},
        viewInstance = null,
        count = 0,
        list = null;

    console.log('model: ', model);

    function get(obj, prop) {
      try {
        var ret = obj[prop].value[0];
        return ret;
      } catch (e) {
        return null;
      }
    }

    var calcSettings = model.data.settings[0].calculationSettings;
    templateData.data.title = get(calcSettings, 'settings.title');
    templateData.data.charge = get(calcSettings, 'settings.charge');

    templateData.data.basis = '';
    var theoryLib = get(calcSettings, 'settings.theory_basis');
    templateData.data.theory_basis = theoryLib;
    if (['cc-pVDZ', 'cc-pVTZ'].indexOf(theoryLib) !== -1) {
        templateData.data.basis = 'spherical';
    }

    var theory = get(calcSettings, 'settings.theory_base');
    templateData.data.theory_type = theory;
    switch (theory) {
        case 'scf':
            // empty
            break;
        case 'dft':
            var mult = get(calcSettings, 'settings.multiplicity');
            templateData.data.theory = ['dft',
                '  xc b3lyp',
                '  mult ' + mult].join('\n');
            break;
        case 'mp2':
            templateData.data.theory = ['mp2',
                '  # Exclude core electrons from MP2 treatment',
                '  freeze atomic'].join('\n');
            break;
        case 'ccsd':
            templateData.data.theory = ['ccsd',
                '  # Exclude core electrons from MP2 treatment',
                '  freeze atomic'].join('\n');
            break;
        default:
            break;
    }

    templateData.data.calculation_type = get(calcSettings, 'settings.type');
    templateData.data.input = model.external.input;

    console.log('template:', templateData);
    var ret = {
        errors: templateData.errors,
        model: model,
        results: {}
    };
    ret.results['job.nw'] =  template(templateData.data);

    return ret;
}
