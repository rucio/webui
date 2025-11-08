/**
 * Design System Breakpoints
 *
 * Responsive design breakpoints for mobile-first layouts.
 */

/**
 * Breakpoint Values
 * Mobile-first breakpoints (min-width)
 */
export const breakpoints = {
    xs: '0px', // Extra small devices (default, mobile portrait)
    sm: '640px', // Small devices (mobile landscape)
    md: '768px', // Medium devices (tablets)
    lg: '1024px', // Large devices (desktop)
    xl: '1280px', // Extra large devices (large desktop)
    '2xl': '1536px', // 2X large devices (extra large desktop)
    nav: '975px', // Custom navigation breakpoint
} as const;

/**
 * Breakpoint Ranges
 * For more precise targeting
 */
export const breakpointRanges = {
    // Mobile only
    mobileOnly: {
        min: breakpoints.xs,
        max: `${parseInt(breakpoints.md) - 1}px`, // Up to 767px
    },

    // Tablet only
    tabletOnly: {
        min: breakpoints.md,
        max: `${parseInt(breakpoints.lg) - 1}px`, // 768px - 1023px
    },

    // Desktop and up
    desktopUp: {
        min: breakpoints.lg,
    },

    // Large desktop and up
    largeDesktopUp: {
        min: breakpoints.xl,
    },
} as const;

/**
 * Container Max Widths
 * Max widths for centered containers at each breakpoint
 */
export const containerMaxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

/**
 * Semantic Breakpoints
 * Device-oriented naming
 */
export const semanticBreakpoints = {
    mobile: breakpoints.xs, // 0px
    mobileLandscape: breakpoints.sm, // 640px
    tablet: breakpoints.md, // 768px
    desktop: breakpoints.lg, // 1024px
    desktopLarge: breakpoints.xl, // 1280px
    desktopXL: breakpoints['2xl'], // 1536px
} as const;

/**
 * Media Queries
 * Reusable media query strings
 */
export const mediaQueries = {
    // Min-width (mobile-first)
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
    nav: `@media (min-width: ${breakpoints.nav})`,

    // Max-width (desktop-first, use sparingly)
    maxSm: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    maxMd: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    maxLg: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    maxXl: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,

    // Range queries
    mobileOnly: `@media (min-width: ${breakpointRanges.mobileOnly.min}) and (max-width: ${breakpointRanges.mobileOnly.max})`,
    tabletOnly: `@media (min-width: ${breakpointRanges.tabletOnly.min}) and (max-width: ${breakpointRanges.tabletOnly.max})`,

    // Feature queries
    touch: '@media (hover: none) and (pointer: coarse)', // Touch devices
    hover: '@media (hover: hover) and (pointer: fine)', // Devices with hover
    reducedMotion: '@media (prefers-reduced-motion: reduce)', // Reduced motion
    darkMode: '@media (prefers-color-scheme: dark)', // Dark mode preference
} as const;

/**
 * Grid Columns
 * Number of columns at each breakpoint
 */
export const gridColumns = {
    xs: 4, // 4 columns on mobile
    sm: 8, // 8 columns on small devices
    md: 12, // 12 columns on tablets and up
    lg: 12,
    xl: 12,
    '2xl': 12,
} as const;

/**
 * Breakpoint Utilities
 */
export const breakpointUtils = {
    /**
     * Get breakpoint value in pixels
     * @param breakpoint - Breakpoint token
     * @returns Breakpoint value in pixels
     */
    getBreakpointInPixels: (breakpoint: keyof typeof breakpoints): number => {
        return parseInt(breakpoints[breakpoint]);
    },

    /**
     * Check if breakpoint is active (client-side)
     * @param breakpoint - Breakpoint token
     * @returns Boolean
     */
    isBreakpointActive: (breakpoint: keyof typeof breakpoints): boolean => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches;
    },

    /**
     * Get active breakpoint (client-side)
     * @returns Current active breakpoint
     */
    getActiveBreakpoint: (): keyof typeof breakpoints => {
        if (typeof window === 'undefined') return 'xs';

        const width = window.innerWidth;
        const breakpointArray = Object.entries(breakpoints).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

        for (const [name, value] of breakpointArray) {
            if (width >= parseInt(value)) {
                return name as keyof typeof breakpoints;
            }
        }

        return 'xs';
    },

    /**
     * Generate Tailwind responsive classes
     * @param baseClass - Base class name
     * @param breakpoint - Breakpoint token
     * @returns Responsive class string
     */
    getResponsiveClass: (baseClass: string, breakpoint: keyof typeof breakpoints): string => {
        if (breakpoint === 'xs') return baseClass;
        return `${breakpoint}:${baseClass}`;
    },
} as const;

/**
 * Responsive Patterns
 * Common responsive design patterns
 */
export const responsivePatterns = {
    /**
     * Hide on mobile, show on desktop
     */
    hideOnMobile: 'hidden md:block',

    /**
     * Show on mobile, hide on desktop
     */
    showOnMobile: 'block md:hidden',

    /**
     * Stack on mobile, grid on desktop
     */
    stackToGrid: 'flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3',

    /**
     * Full width on mobile, constrained on desktop
     */
    fluidToConstrained: 'w-full lg:max-w-7xl lg:mx-auto',

    /**
     * Small padding on mobile, large padding on desktop
     */
    responsivePadding: 'p-4 lg:p-8',

    /**
     * Small text on mobile, larger on desktop
     */
    responsiveText: 'text-sm md:text-base lg:text-lg',
} as const;

export type Breakpoint = typeof breakpoints;
export type MediaQuery = typeof mediaQueries;
export type SemanticBreakpoint = typeof semanticBreakpoints;
