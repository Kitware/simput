var prettierConf = require('./prettier.config.js');

module.exports = {
  extends: ['airbnb', 'prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConf],
    'max-len': ["warn", 160, 4, {"ignoreUrls": true}],
    'no-multi-spaces': ["error", { exceptions: { "ImportDeclaration": true } }],
    'no-param-reassign': ["error", { props: false }],
    'no-unused-vars': ["error", { args: 'none' }],
    'prefer-destructuring': ["error", { VariableDeclarator: { array: false, object: true }, AssignmentExpression: { array: false, object: false } }, { enforceForRenamedProperties: false }],
    'import/no-extraneous-dependencies': 0, // Needed for tests
    // 'no-mixed-operators': 'error', // Wish we can put it back with prettier

    // Not for us
    'jsx-a11y/label-has-for': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'prefer-destructuring': 0, // Can have unwanted side effect

    // Not for use / react
    'react/jsx-filename-extension': 0,

    // Introduced with new eslint
    // and no time to fix them...
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-unused-state': 0,
    'react/forbid-prop-types': 0,

    // Ignores packages, e.g external react and react-dom
    // https://github.com/benmosher/eslint-plugin-import/issues/1006
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
    }],
  },
  plugins: [
    'prettier'
  ],
  globals: {
    __BASE_PATH__: false,
  },
  'settings': {
    'import/resolver': 'webpack'
  },
  env: {
    es6: true,
    browser: true,
  },
};
