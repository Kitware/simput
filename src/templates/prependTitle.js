module.exports = function (title) {
    var out = '[' + title + this.type + ']\n';

    for (var key in this) {
        if (!this[key] || key === 'type') {
            continue;
        }
        console.log(this[key]);
        out += key + ' = ' + this[key] + '\n';
    }

    if (out.match(/\n/g).length === 1) {
        return '';
    }

    return out;
}
