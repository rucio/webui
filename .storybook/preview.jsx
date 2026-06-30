import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider } from 'next-themes';
import '../src/app/globals.css';
// Register AG Grid community modules (AG Grid v33+ renders nothing without this).
// The app does this in src/app/layout.tsx via <AgGridSetup />; Storybook has no
// root layout, so we import the same side-effect module here so grid stories render.
import '../src/lib/ag-grid-setup';

/**
 * Storybook Preview Configuration
 * Configures global decorators, parameters, and theme switching
 */

// Decorator to ensure proper background color based on theme
const withBackground = (Story, context) => {
    const theme = context.globals.theme || 'light';
    return <Story />;
};

// Provide a next-themes context. RegularTable only mounts AG Grid once
// `useTheme().resolvedTheme` is defined; without this provider the grid (and
// therefore every table story) renders blank. The app supplies this in
// src/app/layout.tsx.
const withNextThemes = (Story, context) => {
    const theme = context.globals.theme || 'light';
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme={theme}>
            <Story />
        </ThemeProvider>
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
    withNextThemes,
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
        options: {
            light: {
                name: 'light',
                value: '#FFFFFF',
            },

            dark: {
                name: 'dark',
                value: '#0F172A',
            },
        },
    },
};

export const tags = ['autodocs'];

export const initialGlobals = {
    backgrounds: {
        value: 'light',
    },
};
