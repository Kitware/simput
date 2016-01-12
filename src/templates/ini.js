module.exports = function (items, options) {
    var out = '';

    for (var i in items) {
        if (items[i] === null || items[i] === undefined) {
            continue;
        }
        
        out += i + ' = ' + items[i] + '\n';
    }

    return out;
}