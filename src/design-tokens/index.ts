/**
 * Design Tokens Index
 *
 * Central export for all design system tokens.
 * Import from this file to access all design tokens.
 *
 * @example
 * ```typescript
 * import { colors, spacing, typography } from '@/design-tokens';
 *
 * const buttonStyle = {
 *     backgroundColor: colors.brand[600],
 *     padding: spacing[4],
 *     fontSize: typography.fontSizes.base.size,
 * };
 * ```
 */

// Import all tokens for local use in designTokens object
import { colors, semanticColors, colorUsage } from './colors';
import { fontFamilies, fontWeights, fontSizes, letterSpacing, lineHeights, typographyPresets, maxLineLength, typographyUtils } from './typography';
import { spacing, containerWidths, semanticSpacing, gridGutters, borderRadius, borderWidth, spacingUtils } from './spacing';
import { shadows, darkShadows, zIndex, semanticElevation, backdropEffects, elevationUtils } from './elevation';
import { duration, easing, keyframes, animations, transitions, semanticMotion, motionUtils, reducedMotion } from './motion';
import {
    breakpoints,
    breakpointRanges,
    containerMaxWidths,
    semanticBreakpoints,
    mediaQueries,
    gridColumns,
    breakpointUtils,
    responsivePatterns,
} from './breakpoints';

// Colors
export * from './colors';
export { colors, semanticColors, colorUsage };
export type { ColorToken, SemanticColorToken } from './colors';

// Typography
export * from './typography';
export { fontFamilies, fontWeights, fontSizes, letterSpacing, lineHeights, typographyPresets, maxLineLength, typographyUtils };
export type { FontFamily, FontWeight, FontSize, TypographyPreset } from './typography';

// Spacing
export * from './spacing';
export { spacing, containerWidths, semanticSpacing, gridGutters, borderRadius, borderWidth, spacingUtils };
export type { Spacing, SemanticSpacing, BorderRadius } from './spacing';

// Elevation
export * from './elevation';
export { shadows, darkShadows, zIndex, semanticElevation, backdropEffects, elevationUtils };
export type { Shadow, ZIndex, SemanticElevation, BackdropEffect } from './elevation';

// Motion
export * from './motion';
export { duration, easing, keyframes, animations, transitions, semanticMotion, motionUtils, reducedMotion };
export type { Duration, Easing, Keyframes, Transitions, SemanticMotion } from './motion';

// Breakpoints
export * from './breakpoints';
export { breakpoints, breakpointRanges, containerMaxWidths, semanticBreakpoints, mediaQueries, gridColumns, breakpointUtils, responsivePatterns };
export type { Breakpoint, MediaQuery, SemanticBreakpoint } from './breakpoints';

/**
 * Design System Version
 */
export const DESIGN_SYSTEM_VERSION = '1.0.0';

/**
 * Complete design tokens object
 * Use this for programmatic access to all tokens
 */
export const designTokens = {
    version: DESIGN_SYSTEM_VERSION,
    colors,
    semanticColors,
    typography: {
        fontFamilies,
        fontWeights,
        fontSizes,
        letterSpacing,
        lineHeights,
        presets: typographyPresets,
        maxLineLength,
    },
    spacing,
    semanticSpacing,
    borderRadius,
    elevation: {
        shadows,
        darkShadows,
        zIndex,
        semantic: semanticElevation,
        backdrop: backdropEffects,
    },
    motion: {
        duration,
        easing,
        keyframes,
        animations,
        transitions,
        semantic: semanticMotion,
    },
    breakpoints,
    semanticBreakpoints,
    mediaQueries,
} as const;

export type DesignTokens = typeof designTokens;
