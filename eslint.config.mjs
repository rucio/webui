import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
      '.claude/**/*',
      'pages-api-backup/**/*', // Backup API files
    ],
  },
  js.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('plugin:@next/next/recommended'),
  ...compat.extends('plugin:jsx-a11y/recommended'),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
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
  // Override for Storybook files - allow hooks in render functions and unescaped entities
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
