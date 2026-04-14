/**
 * Design System Elevation Tokens
 *
 * Shadows and z-index layers for visual depth.
 * Inspired by Apple's Liquid Glass (subtle translucency and depth).
 */

/**
 * Shadow Tokens
 * Subtle shadows for depth without heaviness
 */
export const shadows = {
    none: 'none',

    // Tailwind-based shadows (subtle, modern)
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Inner shadows
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

    // Focus/brand shadow (for focus rings)
    brand: '0 0 0 3px color-mix(in srgb, transparent, #8b5cf6 50%)', // 50% opacity brand-500
} as const;

/**
 * Dark Mode Shadows
 * Adjusted shadows for dark backgrounds
 */
export const darkShadows = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
    brand: '0 0 0 3px color-mix(in srgb, transparent, #8b5cf6 50%)',
} as const;

/**
 * Z-Index Layers
 * Stacking order for layered elements
 */
export const zIndex = {
    auto: 'auto',
    0: '0',
    10: '10', // Sticky elements
    20: '20', // Dropdowns, popovers
    30: '30', // Fixed navigation
    40: '40', // Modals, dialogs
    50: '50', // Toasts, notifications
    100: '100', // Tooltips (highest)
} as const;

/**
 * Semantic Elevation
 * Named elevation levels for common use cases
 */
export const semanticElevation = {
    // Surfaces
    surface: {
        flat: shadows.none, // No elevation
        raised: shadows.sm, // Slight lift
        overlay: shadows.md, // Floating above content
        modal: shadows.lg, // Modal dialogs
        popover: shadows.xl, // Popovers, tooltips
    },

    // Interactive states
    interactive: {
        default: shadows.none,
        hover: shadows.sm, // Slight lift on hover
        active: shadows.none, // Pressed state
        focus: shadows.brand, // Focus ring
    },

    // Z-index layers
    layers: {
        base: zIndex[0], // Default layer
        sticky: zIndex[10], // Sticky headers, footers
        dropdown: zIndex[20], // Dropdowns, menus
        navigation: zIndex[30], // Fixed navigation
        modal: zIndex[40], // Modal overlays
        toast: zIndex[50], // Toast notifications
        tooltip: zIndex[100], // Tooltips (always on top)
    },
} as const;

/**
 * Backdrop Effects
 * Glass-morphism and translucency (Apple Liquid Glass inspired)
 */
export const backdropEffects = {
    // Blur amounts
    blur: {
        none: 'none',
        sm: 'blur(4px)',
        default: 'blur(8px)',
        md: 'blur(12px)',
        lg: 'blur(16px)',
        xl: 'blur(24px)',
    },

    // Opacity levels for translucent surfaces
    opacity: {
        subtle: '0.8', // 80% - Subtle translucency
        medium: '0.9', // 90% - Medium translucency
        strong: '0.95', // 95% - Strong translucency
        opaque: '1', // 100% - Fully opaque
    },

    // Glass-morphism presets
    glass: {
        // Light glass effect
        light: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        // Dark glass effect
        dark: {
            background: 'rgba(15, 23, 42, 0.8)', // neutral-900 with 80% opacity
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Modal overlay
        overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
        },
    },
} as const;

/**
 * Elevation Utilities
 */
export const elevationUtils = {
    /**
     * Get CSS string for glass effect
     * @param theme - 'light' or 'dark'
     * @returns CSS properties string
     */
    getGlassEffect: (theme: 'light' | 'dark'): string => {
        const effect = backdropEffects.glass[theme];
        return `
            background: ${effect.background};
            backdrop-filter: ${effect.backdropFilter};
            border: ${effect.border};
        `;
    },

    /**
     * Combine shadow and z-index
     * @param shadow - Shadow token
     * @param zIndexLevel - Z-index token
     * @returns CSS class string
     */
    getElevationClasses: (shadow: keyof typeof shadows, zIndexLevel: keyof typeof zIndex): string => {
        return `shadow-${shadow} z-${zIndexLevel}`;
    },

    /**
     * Get hover elevation classes
     * @param defaultShadow - Default shadow
     * @param hoverShadow - Hover shadow
     * @returns CSS class string
     */
    getHoverElevation: (defaultShadow: keyof typeof shadows, hoverShadow: keyof typeof shadows): string => {
        return `shadow-${defaultShadow} hover:shadow-${hoverShadow} transition-shadow duration-150`;
    },
} as const;

export type Shadow = typeof shadows;
export type ZIndex = typeof zIndex;
export type SemanticElevation = typeof semanticElevation;
export type BackdropEffect = typeof backdropEffects;
