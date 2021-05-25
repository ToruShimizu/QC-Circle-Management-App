module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['@nuxtjs', 'standard', 'prettier', 'prettier/vue', 'eslint:recommended', 'plugin:prettier/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'dot-notation': 'off',
    'vue/one-component-per-file': 'off'
  }
}
