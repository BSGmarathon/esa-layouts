const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    // project: path.join(__dirname, './tsconfig.browser.json'),
    project: path.join(__dirname, 'tsconfig.browser.json'),
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
  },
  globals: {
    nodecg: 'readonly',
    NodeCG: 'readonly',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'indent': ['error', 2],
    'import/resolver': {
      typescript: {
        // This is needed to properly resolve paths.
        // project: path.join(__dirname, './tsconfig.browser.json'),
        project: path.join(__dirname, 'tsconfig.browser.json'),
      },
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    'no-await-in-loop': 'off',
    // Everything is compiled for the browser so dev dependencies are fine.
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // max-len set to ignore "import" lines (as they usually get long and messy).
    'max-len': ['error', { code: 120, ignorePattern: '^import\\s.+\\sfrom\\s.+;' }],
    // I mainly have this off as it ruins auto import sorting in VSCode.
    'object-curly-newline': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'vue/html-self-closing': ['error', {
      "html": {
        "void": "always",
        "normal": "always",
        "component": "always"
      },
    }],
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],

    'no-restricted-syntax': 'off',
    'vue/multi-word-component-names': 'off', // Check about this once things are all using decorators!
  }
};
