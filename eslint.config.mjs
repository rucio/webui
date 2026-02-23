import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      'build/',
      '.next/',
      'out/',
      'node_modules/',
      'coverage/',
      '*.log',
      '.DS_Store',
      'public/**/*.js', // Web workers and service workers
      'test/**/*', // Test files (can be linted separately)
      'tools/**/*', // Build tools
      '.storybook/**/*', // Storybook config
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      // Convert high-volume errors to warnings for gradual cleanup
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow CommonJS in config files
      '@typescript-eslint/no-unused-expressions': 'warn', // Warn instead of error
      'no-empty': 'warn', // Warn on empty blocks
      'prefer-const': 'warn', // Warn instead of error
      'no-case-declarations': 'warn', // Warn on case declarations
    },
  },
];
