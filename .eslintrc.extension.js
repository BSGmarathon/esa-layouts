module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.extension.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '../..',
        ],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true, // Some places have dev deps imported where eslint complains.
      packageDir: ['.', '../..'], // Check for deps in NodeCG folder as well.
    }],
    'import/no-unresolved': [2, { caseSensitive: false }],
    'max-len': ["error", { "code": 100 }],
    '@typescript-eslint/ban-ts-ignore': 'off',
  },
};