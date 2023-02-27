module.exports = {
  root: true, // 停止向上查找父级目录中的配置文件
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'prettier', // eslint-config-prettier 的缩写
    './.eslintrc-auto-import.json',
  ],
  parser: 'vue-eslint-parser', // 指定要使用的解析器
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    uni: true,
    wx: true,
  },
};
