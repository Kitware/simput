/* eslint-disable */
var template = require('./templates/output.hbs');

module.exports = function (model) {
    var templateData = { data: {}, valid: true , errors: []},
        viewInstance = null,
        count = 0,
        list = null;

    function get(obj, prop, defaultValue) {
      try {
        var ret = obj[prop].value[0];
        return ret;
      } catch (e) {
        return defaultValue;
      }
    }

    var dft = (model.data && model.data.dft && model.data.dft[0]) ? model.data.dft[0].dft : null,
        basis = (model.data && model.data.basis && model.data.basis[0]) ? model.data.basis[0].basis : null,
        neb = (model.neb && model.data.neb && model.data.neb[0]) ? model.data.neb[0].neb : null;

    templateData.data.dft_maxiter = get(dft, 'dft.maxiter', 5000);

    var theoryLib = get(basis, 'basis.theory_basis', '6-31G*');
    templateData.data.theory_basis = theoryLib;
    if (['cc-pVDZ', 'cc-pVTZ'].indexOf(theoryLib) !== -1) {
        templateData.data.basis = 'spherical';
    }

    templateData.data.nbeads = get(neb, 'neb.nbeads', 10);
    templateData.data.kbeads = get(neb, 'neb.kbeads', 0.1);
    templateData.data.maxiter = get(neb, 'neb.maxiter', 20);
    templateData.data.stepsize = get(neb, 'neb.stepsize', 1.0);

    templateData.data.start_geometry = model.external.startGeometry || '';
    templateData.data.end_geometry = model.external.endGeometry || '';

    if (!templateData.data.start_geometry || !templateData.data.start_geometry.length) {
      console.log('input model', model);
      templateData.errors.push('The start geometry is empty');
    }
    if (!templateData.data.end_geometry || !templateData.data.end_geometry.length) {
      templateData.errors.push('The end geometry is empty');
    }

    var ret = {
        errors: templateData.errors,
        model: model,
        results: {}
    };
    ret.results['job.nw'] =  template(templateData.data);

    return ret;
}
