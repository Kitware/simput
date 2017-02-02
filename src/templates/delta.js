module.exports = function (bounds) {
  return [
    bounds[1] - bounds[0],
    bounds[3] - bounds[2],
    bounds[5] - bounds[4],
  ].join(' ');
};
