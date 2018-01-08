module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'jest',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    curly: ['error', 'all'],
    indent: ['error', 2, {
      MemberExpression: 1,
      SwitchCase: 1,
    }],
    'arrow-parens': ['error', 'always'],
    'object-curly-newline': ['error', { 'consistent': true }],
    'no-param-reassign': ['error'],
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,
  },
};
