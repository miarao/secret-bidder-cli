module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'json', 'prettier', 'simple-import-sort', 'unused-imports', 'html'],
  extends: [
    'eslint:recommended',
    'plugin:json/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {},
  rules: {
    'jest/no-disabled-tests': 'off',
    'no-console': 'error',
    'no-process-env': 'error',
    'no-process-exit': 'error',
    'no-useless-escape': 'off', // rule has false positives
    'object-shorthand': 'error',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.html'],
      env: {
        browser: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
        ],
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-namespace': 'off',
        // This rule's purpose is to prevent "(not) properly using arrow lambdas ... or not managing scope well". Both
        // of these are issues which do not arise in this code base.
        '@typescript-eslint/no-this-alias': 'off',
        // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-unused-vars': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        // If the following rules is used, uncomment parserOptions.project field as well.
        // "@typescript-eslint/no-floating-promises": "error",
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        'no-constant-condition': ['error', { checkLoops: false }],
        'no-inner-declarations': 'off',
        curly: ['error'],
      },
    },
  ],
}
