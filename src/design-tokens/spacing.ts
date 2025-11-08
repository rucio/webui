/**
 * Design System Spacing Tokens
 *
 * 8px-based spacing scale for consistent layouts and rhythm.
 * Inspired by Vercel Geist's clean, spacious design.
 */

/**
 * Spacing Scale
 * Based on 8px grid (0.5rem increments)
 */
export const spacing = {
    0: '0px',
    1: '0.25rem', // 4px - Tight spacing, icon gaps
    2: '0.5rem', // 8px - Small gaps, compact layouts
    3: '0.75rem', // 12px - Default element spacing
    4: '1rem', // 16px - Standard spacing
    5: '1.25rem', // 20px - Moderate spacing
    6: '1.5rem', // 24px - Comfortable spacing
    7: '1.75rem', // 28px
    8: '2rem', // 32px - Large spacing
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px - Extra large spacing
    11: '2.75rem', // 44px
    12: '3rem', // 48px - Section spacing
    14: '3.5rem', // 56px
    16: '4rem', // 64px - Major section spacing
    20: '5rem', // 80px - Page-level spacing
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
} as const;

/**
 * Container Max Widths
 */
export const containerWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
    prose: '65ch', // Optimal reading width
    proseTechnical: '80ch', // Technical content
} as const;

/**
 * Semantic Spacing
 * Common spacing patterns with descriptive names
 */
export const semanticSpacing = {
    // Component internal spacing
    component: {
        compact: spacing[2], // 8px - Very tight
        cozy: spacing[4], // 16px - Default
        comfortable: spacing[6], // 24px - Spacious
        spacious: spacing[8], // 32px - Extra spacious
    },

    // Vertical rhythm (stack spacing)
    stack: {
        tight: spacing[2], // 8px - Related elements
        normal: spacing[4], // 16px - Default stack
        relaxed: spacing[6], // 24px - Section elements
        loose: spacing[12], // 48px - Major sections
    },

    // Inline spacing (gap between elements)
    inline: {
        tight: spacing[1], // 4px - Icon + text
        normal: spacing[2], // 8px - Default inline
        relaxed: spacing[4], // 16px - Buttons group
    },

    // Inset (padding)
    inset: {
        none: spacing[0],
        xs: spacing[2], // 8px
        sm: spacing[3], // 12px
        md: spacing[4], // 16px - Default
        lg: spacing[6], // 24px
        xl: spacing[8], // 32px
        '2xl': spacing[12], // 48px
    },

    // Page layout
    page: {
        paddingX: spacing[4], // 16px on mobile
        paddingXLg: spacing[8], // 32px on desktop
        paddingY: spacing[8], // 32px vertical
        sectionGap: spacing[16], // 64px between sections
    },

    // Form spacing
    form: {
        fieldGap: spacing[4], // 16px between fields
        labelGap: spacing[2], // 8px label to input
        groupGap: spacing[6], // 24px between field groups
    },
} as const;

/**
 * Grid Gutters
 */
export const gridGutters = {
    none: spacing[0],
    sm: spacing[2], // 8px
    md: spacing[4], // 16px - Default
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
} as const;

/**
 * Border Radius
 * Consistent corner rounding
 */
export const borderRadius = {
    none: '0',
    sm: '0.125rem', // 2px - Subtle rounding
    default: '0.25rem', // 4px - Default
    md: '0.375rem', // 6px - Medium
    lg: '0.5rem', // 8px - Large
    xl: '0.75rem', // 12px - Extra large
    '2xl': '1rem', // 16px - Very large
    '3xl': '1.5rem', // 24px - Super large
    full: '9999px', // Pill/circular
} as const;

/**
 * Border Width
 */
export const borderWidth = {
    0: '0',
    default: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
} as const;

/**
 * Spacing Utilities
 */
export const spacingUtils = {
    /**
     * Get spacing value in pixels
     * @param size - Spacing token (e.g., 4, 8, 16)
     * @returns Size in pixels
     */
    getSpacingInPixels: (size: keyof typeof spacing): number => {
        const remValue = parseFloat(spacing[size]);
        return remValue * 16; // 1rem = 16px default
    },

    /**
     * Calculate spacing between elements
     * @param count - Number of gaps
     * @param gapSize - Gap size token
     * @returns Total spacing
     */
    calculateTotalGap: (count: number, gapSize: keyof typeof spacing): string => {
        const value = parseFloat(spacing[gapSize]);
        return `${value * count}rem`;
    },

    /**
     * Get responsive padding
     * @param mobile - Mobile padding token
     * @param desktop - Desktop padding token
     * @returns CSS class string
     */
    getResponsivePadding: (mobile: keyof typeof spacing, desktop: keyof typeof spacing): string => {
        return `p-${mobile} lg:p-${desktop}`;
    },
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
export type BorderRadius = typeof borderRadius;
