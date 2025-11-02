/**
 * Chart Color Utilities
 *
 * Centralized utilities for using design system colors in charts (Recharts, etc.)
 * Converts design tokens to rgba format with optional opacity.
 *
 * @see .dadai/docs/DESIGN_SYSTEM.md
 */

import { colors } from '@/design-tokens/colors';

/**
 * Convert hex color to rgba with opacity
 * @param hex - Hex color string (e.g., '#8b5cf6')
 * @param opacity - Opacity value 0-1 (default: 1)
 * @returns rgba string (e.g., 'rgba(139, 92, 246, 0.8)')
 */
export const hexToRgba = (hex: string, opacity: number = 1): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Semantic chart colors for common use cases
 * All colors use 0.8 opacity for chart visibility
 */
export const chartColors = {
    // Semantic colors
    success: hexToRgba(colors.base.success[500], 0.8),
    error: hexToRgba(colors.base.error[500], 0.8),
    warning: hexToRgba(colors.base.warning[500], 0.8),
    info: hexToRgba(colors.base.info[500], 0.8),

    // Brand colors
    brand: hexToRgba(colors.brand[500], 0.8),
    brandDark: hexToRgba(colors.brand[600], 0.8),
    brandLight: hexToRgba(colors.brand[400], 0.8),

    // Neutral colors
    neutral: hexToRgba(colors.neutral[500], 0.8),
    neutralLight: hexToRgba(colors.neutral[300], 0.8),
    neutralDark: hexToRgba(colors.neutral[700], 0.8),

    // Extra colors for variety in multi-series charts
    extra: {
        indigo: hexToRgba(colors.extra.indigo[500], 0.8),
        rose: hexToRgba(colors.extra.rose[500], 0.8),
        emerald: hexToRgba(colors.extra.emerald[500], 0.8),
        yellow: hexToRgba(colors.extra.yellow[500], 0.8),
    },
} as const;

/**
 * Get border color based on theme
 * @param isDarkMode - Whether dark mode is active
 * @param opacity - Opacity value 0-1 (default: 0.15)
 * @returns rgba string for borders
 */
export const getBorderColor = (isDarkMode: boolean, opacity: number = 0.15): string => {
    return isDarkMode
        ? hexToRgba(colors.neutral[100], opacity) // Light border in dark mode
        : hexToRgba(colors.neutral[900], opacity); // Dark border in light mode
};

/**
 * Predefined color palettes for multi-series charts
 */
export const chartPalettes = {
    /**
     * Primary palette - semantic colors
     */
    semantic: [chartColors.success, chartColors.warning, chartColors.error, chartColors.info],

    /**
     * Brand palette - variations of brand color
     */
    brand: [chartColors.brand, chartColors.brandDark, chartColors.brandLight, hexToRgba(colors.brand[700], 0.8)],

    /**
     * Diverse palette - mix of colors for multi-category data
     */
    diverse: [
        chartColors.brand,
        chartColors.extra.emerald,
        chartColors.extra.yellow,
        chartColors.extra.rose,
        chartColors.extra.indigo,
        chartColors.info,
    ],

    /**
     * Status palette - for operational dashboards
     */
    status: {
        ok: chartColors.success,
        replicating: chartColors.warning,
        stuck: chartColors.error,
        suspended: chartColors.neutral,
        waiting: chartColors.extra.indigo,
        inject: chartColors.info,
    },
} as const;

/**
 * Get color for a specific index in a multi-series chart
 * Automatically cycles through the palette
 *
 * @param index - Data series index
 * @param palette - Color palette to use (default: diverse)
 * @returns rgba color string
 */
export const getChartColor = (index: number, palette: readonly string[] = chartPalettes.diverse): string => {
    return palette[index % palette.length];
};

/**
 * Create a custom rgba color from design tokens
 *
 * @param category - Color category ('brand', 'neutral', 'base.success', etc.)
 * @param shade - Color shade (100-900)
 * @param opacity - Opacity value 0-1 (default: 0.8)
 * @returns rgba string
 *
 * @example
 * getColorFromToken('brand', 600, 0.9)
 * getColorFromToken('base.success', 500, 0.7)
 */
export const getColorFromToken = (category: string, shade: number, opacity: number = 0.8): string => {
    // Parse nested category (e.g., 'base.success')
    const parts = category.split('.');
    let colorObj: any = colors;

    for (const part of parts) {
        colorObj = colorObj[part];
        if (!colorObj) {
            console.warn(`Color token not found: ${category}`);
            return hexToRgba(colors.neutral[500], opacity);
        }
    }

    const hexColor = colorObj[shade];
    if (!hexColor) {
        console.warn(`Color shade not found: ${category}[${shade}]`);
        return hexToRgba(colors.neutral[500], opacity);
    }

    return hexToRgba(hexColor, opacity);
};
