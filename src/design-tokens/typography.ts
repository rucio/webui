/**
 * Design System Typography Tokens
 *
 * Font families, sizes, weights, and line heights for the Rucio WebUI.
 * Based on a modular scale (1.25) for harmonious proportions.
 */

/**
 * Font Families
 */
export const fontFamilies = {
    /**
     * Sans-serif font for UI
     * Inter: Modern, highly legible sans-serif optimized for screen reading
     */
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],

    /**
     * Monospace font for code and technical content
     * JetBrains Mono / IBM Plex Mono: Designed for code readability
     */
    mono: ['JetBrains Mono', 'IBM Plex Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],

    /**
     * Serif font (fallback)
     */
    serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400, // Default for body text
    medium: 500, // Emphasis
    semibold: 600, // Headings
    bold: 700, // Strong emphasis
    extrabold: 800, // Display text
    black: 900,
} as const;

/**
 * Font Sizes
 * Based on modular scale (1.25) with rem units
 */
export const fontSizes = {
    xs: {
        size: '0.75rem', // 12px
        lineHeight: '1rem', // 16px
    },
    sm: {
        size: '0.875rem', // 14px
        lineHeight: '1.25rem', // 20px
    },
    base: {
        size: '1rem', // 16px (default)
        lineHeight: '1.5rem', // 24px
    },
    lg: {
        size: '1.125rem', // 18px
        lineHeight: '1.75rem', // 28px
    },
    xl: {
        size: '1.25rem', // 20px
        lineHeight: '1.75rem', // 28px
    },
    '2xl': {
        size: '1.5rem', // 24px
        lineHeight: '2rem', // 32px
    },
    '3xl': {
        size: '1.875rem', // 30px
        lineHeight: '2.25rem', // 36px
    },
    '4xl': {
        size: '2.25rem', // 36px
        lineHeight: '2.5rem', // 40px
    },
    '5xl': {
        size: '3rem', // 48px
        lineHeight: '1', // Tight
    },
    '6xl': {
        size: '3.75rem', // 60px
        lineHeight: '1', // Tight
    },
    '7xl': {
        size: '4.5rem', // 72px
        lineHeight: '1', // Tight
    },
} as const;

/**
 * Letter Spacing
 */
export const letterSpacing = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
} as const;

/**
 * Line Heights
 */
export const lineHeights = {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
} as const;

/**
 * Typography Presets
 * Commonly used type styles
 */
export const typographyPresets = {
    // Display
    display: {
        fontSize: fontSizes['5xl'].size,
        lineHeight: fontSizes['5xl'].lineHeight,
        fontWeight: fontWeights.extrabold,
        letterSpacing: letterSpacing.tight,
    },

    // Headings
    h1: {
        fontSize: fontSizes['4xl'].size,
        lineHeight: fontSizes['4xl'].lineHeight,
        fontWeight: fontWeights.bold,
        letterSpacing: letterSpacing.tight,
    },
    h2: {
        fontSize: fontSizes['3xl'].size,
        lineHeight: fontSizes['3xl'].lineHeight,
        fontWeight: fontWeights.bold,
        letterSpacing: letterSpacing.tight,
    },
    h3: {
        fontSize: fontSizes['2xl'].size,
        lineHeight: fontSizes['2xl'].lineHeight,
        fontWeight: fontWeights.semibold,
        letterSpacing: letterSpacing.normal,
    },
    h4: {
        fontSize: fontSizes.xl.size,
        lineHeight: fontSizes.xl.lineHeight,
        fontWeight: fontWeights.semibold,
        letterSpacing: letterSpacing.normal,
    },
    h5: {
        fontSize: fontSizes.lg.size,
        lineHeight: fontSizes.lg.lineHeight,
        fontWeight: fontWeights.semibold,
        letterSpacing: letterSpacing.normal,
    },
    h6: {
        fontSize: fontSizes.base.size,
        lineHeight: fontSizes.base.lineHeight,
        fontWeight: fontWeights.semibold,
        letterSpacing: letterSpacing.normal,
    },

    // Body
    bodyLarge: {
        fontSize: fontSizes.lg.size,
        lineHeight: fontSizes.lg.lineHeight,
        fontWeight: fontWeights.regular,
        letterSpacing: letterSpacing.normal,
    },
    body: {
        fontSize: fontSizes.base.size,
        lineHeight: fontSizes.base.lineHeight,
        fontWeight: fontWeights.regular,
        letterSpacing: letterSpacing.normal,
    },
    bodySmall: {
        fontSize: fontSizes.sm.size,
        lineHeight: fontSizes.sm.lineHeight,
        fontWeight: fontWeights.regular,
        letterSpacing: letterSpacing.normal,
    },

    // Labels and captions
    label: {
        fontSize: fontSizes.sm.size,
        lineHeight: fontSizes.sm.lineHeight,
        fontWeight: fontWeights.medium,
        letterSpacing: letterSpacing.normal,
    },
    caption: {
        fontSize: fontSizes.xs.size,
        lineHeight: fontSizes.xs.lineHeight,
        fontWeight: fontWeights.regular,
        letterSpacing: letterSpacing.normal,
    },

    // Code
    code: {
        fontSize: fontSizes.sm.size,
        lineHeight: fontSizes.sm.lineHeight,
        fontWeight: fontWeights.regular,
        fontFamily: fontFamilies.mono.join(', '),
    },
    codeBlock: {
        fontSize: fontSizes.sm.size,
        lineHeight: lineHeights.relaxed,
        fontWeight: fontWeights.regular,
        fontFamily: fontFamilies.mono.join(', '),
    },
} as const;

/**
 * Max Line Lengths
 * Optimal line lengths for readability
 */
export const maxLineLength = {
    prose: '65ch', // Standard prose content
    technical: '80ch', // Technical content, code
    wide: '100ch', // Wide content
} as const;

/**
 * Typography Utilities
 */
export const typographyUtils = {
    /**
     * Get CSS string for typography preset
     * @example getCSSString('h1') => 'font-size: 2.25rem; line-height: 2.5rem; ...'
     */
    getCSSString: (preset: keyof typeof typographyPresets): string => {
        const style = typographyPresets[preset];
        return Object.entries(style)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value}`;
            })
            .join('; ');
    },

    /**
     * Get font size in pixels
     * @param size - Font size token (e.g., 'base', 'xl')
     * @returns Size in pixels
     */
    getFontSizeInPixels: (size: keyof typeof fontSizes): number => {
        const remValue = parseFloat(fontSizes[size].size);
        return remValue * 16; // 1rem = 16px default
    },
} as const;

export type FontFamily = typeof fontFamilies;
export type FontWeight = typeof fontWeights;
export type FontSize = typeof fontSizes;
export type TypographyPreset = typeof typographyPresets;
