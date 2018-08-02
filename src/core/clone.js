function isObject(value) {
  return value === Object(value);
}

/* eslint-disable no-use-before-define */
function clone(value) {
  if (Array.isArray(value)) {
    return cloneArray(value);
  }
  if (isObject(value)) {
    return cloneObject(value);
  }
  return value;
}
/* eslint-enable no-use-before-define */

function cloneObject(obj) {
  const out = {};
  Object.keys(obj).forEach((key) => {
    out[key] = clone(obj[key]);
  });
  return out;
}

function cloneArray(array) {
  const out = [];
  for (let i = 0; i < array.length; i++) {
    out[i] = clone(array[i]);
  }
  return out;
}

/* eslint-disable no-new-func */

export default clone;
