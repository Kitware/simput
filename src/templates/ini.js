module.exports = function (title, items, options) {
    var out = '';

    if (items.type) {
        out = '[' + title + items.type + ']\n';
        delete items.type;
    } else {
        out = '[' + title + ']\n';
    }

    for (var i in items) {
        if (items[i] === null || items[i] === undefined) {
            continue;
        }

        out += i + ' = ' + items[i] + '\n';
    }

    if (out.match(/\n/g).length === 1) {
        return '';
    }

    return out;
}
