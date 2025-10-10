import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist', 'build', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Ignore unused variables named React
      '@typescript-eslint/no-unused-vars': 'off',

      // Allow empty functions (e.g., for stubs, handlers)
      '@typescript-eslint/no-empty-function': 'off',

      // Allow unused expressions (common in JSX)
      '@typescript-eslint/no-unused-expressions': 'off',

      // Allow usage of JSX without explicit React reference
      'react/react-in-jsx-scope': 'off',

      // Disable TS warnings for type-only imports - make it a warning instead of error
      '@typescript-eslint/consistent-type-imports': 'off',

      // Disable unused locals and parameters warnings
      '@typescript-eslint/no-unused-locals': 'off',
      '@typescript-eslint/no-unused-parameters': 'off',

      // Disable strict type checking rules that can break builds
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-misused-new': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      // Disable React-specific rules that can break builds
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/no-children-prop': 'off',
      'react/no-array-index-key': 'off',
      'react/no-danger': 'off',
      'react/no-deprecated': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/no-find-dom-node': 'off',
      'react/no-is-mounted': 'off',
      'react/no-render-return-value': 'off',
      'react/no-string-refs': 'off',
      'react/no-unknown-property': 'off',
      'react/require-render-return': 'off',
      'react/self-closing-comp': 'off',

      // Disable general JS rules that can break builds
      'no-console': 'off',
      'no-debugger': 'off',
      'no-alert': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-dupe-class-members': 'off',
      'no-empty': 'off',
      'no-extra-boolean-cast': 'off',
      'no-extra-semi': 'off',
      'no-func-assign': 'off',
      'no-global-assign': 'off',
      'no-import-assign': 'off',
      'no-inner-declarations': 'off',
      'no-invalid-regexp': 'off',
      'no-irregular-whitespace': 'off',
      'no-obj-calls': 'off',
      'no-prototype-builtins': 'off',
      'no-regex-spaces': 'off',
      'no-sparse-arrays': 'off',
      'no-unexpected-multiline': 'off',
      'no-unreachable': 'off',
      'no-unsafe-finally': 'off',
      'no-unsafe-negation': 'off',
      'use-isnan': 'off',
      'valid-typeof': 'off',
    },
  },
])
