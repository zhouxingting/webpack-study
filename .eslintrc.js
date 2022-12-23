module.exports = {
  // 环境
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // 扩展
  extends: [
    // eslint默认规则
    'eslint:recommended',
    // react推荐规则
    'plugin:react/recommended',
    // ts推荐规则
    'plugin:@typescript-eslint/recommended',
    // react17之后不需要引入React使用jsx
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  // 解析器
  parser: '@typescript-eslint/parser',
  // 解析器选项
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  // 插件
  plugins: ['react', '@typescript-eslint', 'prettier'],
  // 规则
  rules: {
    // 解决与prettier的冲突，格式化部分以prettier为准
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: false,
      },
    ],
  },
  // 共享设置react版本问题
  settings: {
    react: {
      version: 'detect',
    },
  },
};
