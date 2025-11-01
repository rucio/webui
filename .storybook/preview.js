import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/app/globals.css';

/**
 * Storybook Preview Configuration
 * Configures global decorators, parameters, and theme switching
 */

// Decorator to ensure proper background color based on theme
const withBackground = (Story, context) => {
  const theme = context.globals.theme || 'light';
  return (
      <Story />
  );
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  withBackground,
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#FFFFFF',
      },
      {
        name: 'dark',
        value: '#0F172A',
      },
    ],
  },
};

export const tags = ['autodocs'];
