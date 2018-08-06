const path = require('path');

module.exports.toAbsolutePath = function toAbsolutePath(relPath) {
  let ret;
  if (!path.isAbsolute(relPath)) {
    ret = path.join(process.env.PWD, relPath);
  } else {
    ret = relPath;
  }
  return path.normalize(ret);
};
