/**
 * Design System Motion Tokens
 *
 * Animation durations, easing functions, and keyframes.
 * Motion should be purposeful, fast, and respectful of user preferences.
 */

/**
 * Animation Durations
 * Keep animations fast (< 300ms for most interactions)
 */
export const duration = {
    instant: '0ms', // No animation
    fastest: '50ms', // Ultra-fast feedback
    fast: '75ms', // Instant feedback (button press)
    quick: '100ms', // Quick transitions
    normal: '150ms', // Standard transitions (default)
    moderate: '200ms', // Comfortable transitions
    slow: '300ms', // Moderate animations
    slower: '500ms', // Slow animations
    slowest: '700ms', // Page transitions
} as const;

/**
 * Easing Functions
 * Natural, physics-based easing curves
 */
export const easing = {
    // Linear
    linear: 'linear',

    // Sine (gentle easing)
    inSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
    outSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
    inOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',

    // Quad (standard easing)
    inQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    outQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',

    // Cubic (emphasized easing)
    inCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
    outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
    inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',

    // Tailwind defaults
    in: 'cubic-bezier(0.4, 0, 1, 1)', // Accelerate
    out: 'cubic-bezier(0, 0, 0.2, 1)', // Decelerate (most common)
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Standard easing

    // Spring-like (bouncy)
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Sharp (quick start/stop)
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

/**
 * Keyframe Animations
 */
export const keyframes = {
    // Fade animations
    fadeIn: {
        from: { opacity: '0' },
        to: { opacity: '1' },
    },
    fadeOut: {
        '0%': { opacity: '1' },
        '80%': { opacity: '1' },
        '100%': { opacity: '0' },
    },

    // Slide animations
    slideInFromTop: {
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0)' },
    },
    slideInFromRight: {
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0)' },
    },
    slideInFromBottom: {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
    },
    slideInFromLeft: {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' },
    },

    // Scale animations
    scaleIn: {
        from: { transform: 'scale(0.95)', opacity: '0' },
        to: { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
        from: { transform: 'scale(1)', opacity: '1' },
        to: { transform: 'scale(0.95)', opacity: '0' },
    },

    // Spin
    spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },

    // Pulse
    pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
    },

    // Bounce
    bounce: {
        '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
        '50%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
    },

    // Float out (toast dismissal)
    floatOut: {
        '0%': { opacity: '1', left: '0px' },
        '80%': { opacity: '1', left: '0px' },
        '100%': { opacity: '0', left: '100px' },
    },

    // Accordion
    accordionDown: {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
    },
    accordionUp: {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
    },

    // Shimmer (loading skeleton)
    shimmer: {
        '0%': { backgroundPosition: '-1000px 0' },
        '100%': { backgroundPosition: '1000px 0' },
    },
} as const;

/**
 * Animation Presets
 * Common animation patterns
 */
export const animations = {
    // Utility
    none: 'none',

    // Spin
    spin: {
        animation: 'spin',
        duration: duration.slowest,
        timing: easing.linear,
        iteration: 'infinite',
    },
    slowSpin: {
        animation: 'spin',
        duration: '2s',
        timing: easing.linear,
        iteration: 'infinite',
    },

    // Pulse
    pulse: {
        animation: 'pulse',
        duration: '2s',
        timing: easing.inOut,
        iteration: 'infinite',
    },

    // Bounce
    bounce: {
        animation: 'bounce',
        duration: '1s',
        timing: easing.linear,
        iteration: 'infinite',
    },

    // Toast animations
    floatOut: {
        animation: 'floatOut',
        duration: '5s',
        timing: easing.linear,
        iteration: '1',
    },
    fadeOut: {
        animation: 'fadeOut',
        duration: '5s',
        timing: easing.linear,
        iteration: '1',
    },

    // Accordion
    accordionDown: {
        animation: 'accordionDown',
        duration: duration.moderate,
        timing: easing.out,
    },
    accordionUp: {
        animation: 'accordionUp',
        duration: duration.moderate,
        timing: easing.out,
    },

    // Shimmer
    shimmer: {
        animation: 'shimmer',
        duration: '2s',
        timing: easing.linear,
        iteration: 'infinite',
    },
} as const;

/**
 * Transition Presets
 * Common CSS transitions
 */
export const transitions = {
    // All properties
    all: `all ${duration.normal} ${easing.inOut}`,

    // Specific properties
    colors: `color ${duration.normal} ${easing.out}, background-color ${duration.normal} ${easing.out}, border-color ${duration.normal} ${easing.out}`,
    opacity: `opacity ${duration.normal} ${easing.out}`,
    shadow: `box-shadow ${duration.normal} ${easing.out}`,
    transform: `transform ${duration.normal} ${easing.out}`,

    // Interactive states
    button: `background-color ${duration.fast} ${easing.out}, transform ${duration.fast} ${easing.out}`,
    hover: `all ${duration.normal} ${easing.out}`,
    focus: `box-shadow ${duration.quick} ${easing.out}`,

    // Layout
    height: `height ${duration.moderate} ${easing.inOut}`,
    width: `width ${duration.moderate} ${easing.inOut}`,
} as const;

/**
 * Semantic Motion
 * Named motion patterns for common interactions
 */
export const semanticMotion = {
    // Button interactions
    button: {
        press: {
            duration: duration.fast,
            easing: easing.out,
            transform: 'scale(0.95)',
        },
        hover: {
            duration: duration.normal,
            easing: easing.out,
            transform: 'scale(1.02)',
        },
    },

    // Modal/Dialog
    modal: {
        enter: {
            duration: duration.moderate,
            easing: easing.out,
            keyframe: 'scaleIn',
        },
        exit: {
            duration: duration.quick,
            easing: easing.in,
            keyframe: 'scaleOut',
        },
    },

    // Dropdown/Popover
    dropdown: {
        enter: {
            duration: duration.normal,
            easing: easing.out,
            keyframe: 'scaleIn',
        },
        exit: {
            duration: duration.quick,
            easing: easing.in,
            keyframe: 'fadeOut',
        },
    },

    // Toast
    toast: {
        enter: {
            duration: duration.moderate,
            easing: easing.out,
            keyframe: 'slideInFromRight',
        },
        exit: {
            duration: '5s',
            easing: easing.linear,
            keyframe: 'floatOut',
        },
    },

    // Accordion
    accordion: {
        expand: {
            duration: duration.moderate,
            easing: easing.out,
            keyframe: 'accordionDown',
        },
        collapse: {
            duration: duration.moderate,
            easing: easing.out,
            keyframe: 'accordionUp',
        },
    },
} as const;

/**
 * Motion Utilities
 */
export const motionUtils = {
    /**
     * Get CSS transition string
     * @param property - CSS property to transition
     * @param duration - Duration token
     * @param easing - Easing function
     * @returns CSS transition string
     */
    getTransition: (property: string, dur: keyof typeof duration, ease: keyof typeof easing): string => {
        return `${property} ${duration[dur]} ${easing[ease]}`;
    },

    /**
     * Get CSS animation string
     * @param keyframe - Keyframe name
     * @param duration - Duration token
     * @param easing - Easing function
     * @param iteration - Iteration count
     * @returns CSS animation string
     */
    getAnimation: (
        keyframe: string,
        dur: keyof typeof duration,
        ease: keyof typeof easing,
        iteration: string = '1',
    ): string => {
        return `${keyframe} ${duration[dur]} ${easing[ease]} ${iteration}`;
    },

    /**
     * Respect prefers-reduced-motion
     * @param animation - Animation string
     * @returns CSS with motion preference
     */
    withReducedMotion: (animation: string): string => {
        return `
            @media (prefers-reduced-motion: no-preference) {
                animation: ${animation};
            }
            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        `;
    },
} as const;

/**
 * Reduced Motion Support
 */
export const reducedMotion = {
    /**
     * CSS class for respecting prefers-reduced-motion
     * Usage: Add 'motion-safe:animate-*' and 'motion-reduce:animate-none'
     */
    classes: {
        safe: 'motion-safe', // Only animate when motion is safe
        reduce: 'motion-reduce', // Disable animation when reduced motion is preferred
    },
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
export type Keyframes = typeof keyframes;
export type Transitions = typeof transitions;
export type SemanticMotion = typeof semanticMotion;
