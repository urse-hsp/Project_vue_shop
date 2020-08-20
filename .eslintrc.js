module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    indent: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0
    // https://blog.csdn.net/qq_43416014/article/details/105012478?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~first_rank_v2~rank_v25-1-105012478.nonecase&utm_term=eslint%E8%AE%BE%E7%BD%AE%E5%87%BD%E6%95%B0%E7%A9%BA%E6%A0%BC
  }
}
