module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: 0,
    'comma-dangle': 0,
    'no-console': 0
  },
};
