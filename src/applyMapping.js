/* eslint-disable prefer-arrow-callback */
function pathItem(item) {
  const nb = Number(item);
  if (Number.isInteger(nb)) {
    return nb;
  }
  return item;
}

function processValue(info, a, b) {
  console.log((a === undefined) ? '-' : '+', info);
  return (a !== undefined) ? a : b;
}

function get(container, path) {
  const items = path.split('/');
  let current = container;
  let item = pathItem(items.shift());
  while (current[item] !== undefined) {
    current = current[item];
    if (items.length) {
      item = pathItem(items.shift());
    } else {
      return current;
    }
  }
  return undefined;
}

function set(container, path, value) {
  const items = path.split('/');
  const last = pathItem(items.pop());
  let current = container;
  items.map(pathItem).forEach(function applyPath(item, idx, array) {
    if (current[item] === undefined) {
      current[item] = (Number.isInteger(idx + 1 < array.length ? array[idx + 1] : last)) ? [] : {};
    }
    current = current[item];
  });
  current[last] = value;
}

module.exports = function applyMapping(templateData, model, mapping, defaults) {
  mapping.forEach(function setEntry(entry) {
    const value = processValue(entry.help, get(model, entry.src), get(defaults, entry.dst));
    set(templateData, entry.dst, value);
  });
};
