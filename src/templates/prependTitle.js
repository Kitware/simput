module.exports = function (title) {
    var out = '[' + title + this.type + ']\n';

    for (var key in this) {
        if (!this[key] || key === 'type') {
            continue;
        }
        if (key === 'typeAttr') { // an exception for props that take type
          out += 'type = ' + this[key] + '\n';
        } else {
          out += key + ' = ' + this[key] + '\n';
        }
    }

    if (out.match(/\n/g).length === 1) {
        return '';
    }

    return out;
}
