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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(React|_|props|state)$', // common React/placeholder vars
          argsIgnorePattern: '^_', // ignore function args starting with _
          caughtErrorsIgnorePattern: '^_', // ignore unused catch errors
          ignoreRestSiblings: true,
        },
      ],

      // Allow empty functions (e.g., for stubs, handlers)
      '@typescript-eslint/no-empty-function': 'off',

      // Allow unused expressions (common in JSX)
      '@typescript-eslint/no-unused-expressions': 'off',

      // Allow usage of JSX without explicit React reference
      'react/react-in-jsx-scope': 'off',

      // Disable TS warnings for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
])
