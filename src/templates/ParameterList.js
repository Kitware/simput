const toType = (value) => (typeof value === 'string' ? 'string' : 'double');

module.exports = function parameterList(ctx, options) {
  const buffer = [];
  const indent = Number(options.hash.depth);
  let pad = '';
  while (pad.length < indent) {
    pad += ' ';
  }
  buffer.push(`${pad}<ParameterList name="${options.hash.name}">`);
  Object.keys(ctx).forEach((fieldName) => {
    if (Array.isArray(ctx[fieldName])) {
      buffer.push(
        `${pad}  <Parameter name="${fieldName}" type="Array(${toType(
          ctx[fieldName][0]
        )})" value="{${ctx[fieldName]}}"/>`
      );
    } else if (['string', 'number'].indexOf(typeof ctx[fieldName]) !== -1) {
      buffer.push(
        `${pad}  <Parameter name="${fieldName}" type="${toType(
          ctx[fieldName]
        )}" value="${ctx[fieldName]}"/>`
      );
    } else if (ctx[fieldName] !== undefined && ctx[fieldName] !== null) {
      const childOptions = { hash: { name: fieldName, depth: indent + 2 } };
      buffer.push(parameterList(ctx[fieldName], childOptions));
    }
  });
  buffer.push(`${pad}</ParameterList>`);
  return buffer.join('\n');
};
