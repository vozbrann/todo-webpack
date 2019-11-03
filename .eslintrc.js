module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "linebreak-style": 0,
    "no-console": 2,
    'no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: true },
    ],
  },
  parser: "babel-eslint"
};
