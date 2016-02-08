module.exports = function (items, options) {
    var out = '[' + this.type + ']\n';

    for (var key in this) {
        if (!this[key] || key === 'type') {
            continue;
        }

        out += key + ' = ' + this[key] + '\n';
    }

    if (out.match(/\n/g).length === 1) {
        return '';
    }

    return out;
}
