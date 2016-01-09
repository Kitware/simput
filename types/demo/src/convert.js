var template = require('./templates/demo.hbs');

module.exports = function(dataModel) {
    var results = {
            wow: 'this is a wow file. very magic',
            bar: 'bar far mar gar har har har !'
        },
        error = null;

    // FIXME

    return { results: results, error: error };
}