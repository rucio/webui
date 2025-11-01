/**
 * Tailwind Configuration
 * Aligned with Rucio WebUI Design System v1.0.0
 * @see .dadai/docs/DESIGN_SYSTEM.md
 */

module.exports = {
    darkMode: 'class',
    content: {
        files: ["./src/**/*.{html,js,tsx,ts}"],
        extract: {
            columnMetaStyle: (content) => {
                return content.match(/(?<=meta([:\s{]*)style:\s")[a-zA-Z\-[\]0-9:\s]*(?=")/)
            },
            reactModalStyle: (content) => {
                return content.match(/(?<=overlayClassName=")[a-zA-Z\-[\]0-9:\s]*(?=")/)
            },
        }
    },
    theme: {
        extend: {
            screens: {
                'nav': '975px',
            },
            colors: {
                neutral: { // Slate - Primary UI colors
                    0: '#ffffff',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: "#64748b",
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    1000: '#000000',
                },
                brand: { // Purple - Primary brand color
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: "#8b5cf6",
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                base: {
                    success: { // Green
                        100: '#dcfce7',
                        200: '#bbf7d0',
                        300: '#86efac',
                        400: '#4ade80',
                        500: "#22c55e",
                        600: '#16a34a',
                        700: '#15803d',
                        800: '#166534',
                        900: '#14532d',
                    },
                    error: { // Red
                        100: '#fee2e2',
                        200: '#fecaca',
                        300: '#fca5a5',
                        400: '#f87171',
                        500: "#ef4444",
                        600: '#dc2626',
                        700: '#b91c1c',
                        800: '#991b1b',
                        900: '#7f1d1d',
                    },
                    warning: { // Amber
                        100: '#fef3c7',
                        200: '#fde68a',
                        300: '#fcd34d',
                        400: '#fbbf24',
                        500: "#f59e0b",
                        600: '#d97706',
                        700: '#b45309',
                        800: '#92400e',
                        900: '#78350f',
                    },
                    info: { // Blue
                        100: '#e0f2fe',
                        200: '#bae6fd',
                        300: '#7dd3fc',
                        400: '#38bdf8',
                        500: "#0ea5e9",
                        600: '#0284c7',
                        700: '#0369a1',
                        800: '#075985',
                        900: '#0c4a6e',
                    },
                },
                extra: {
                    indigo: {
                        100: '#e0e7ff',
                        200: '#c7d2fe',
                        300: '#a5b4fc',
                        400: '#818cf8',
                        500: "#6366f1",
                        600: '#4f46e5',
                        700: '#4338ca',
                        800: '#3730a3',
                        900: '#312e81',
                    },
                    rose: {
                        100: '#ffe4e6',
                        200: '#fecdd3',
                        300: '#fda4af',
                        400: '#fb7185',
                        500: "#f43f5e",
                        600: '#e11d48',
                        700: '#be123c',
                        800: '#9f1239',
                        900: '#881337',
                    },
                    emerald: {
                        100: '#d1fae5',
                        200: '#a7f3d0',
                        300: '#6ee7b7',
                        400: '#34d399',
                        500: "#10b981",
                        600: '#059669',
                        700: '#047857',
                        800: '#065f46',
                        900: '#064e3b',
                    },
                    yellow: {
                        100: '#fefce8',
                        200: '#fef08a',
                        300: '#fde047',
                        400: '#facc15',
                        500: "#eab308",
                        600: '#ca8a04',
                        700: '#a16207',
                        800: '#854d0e',
                        900: '#713f12',
                    },
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'IBM Plex Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
                serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px / 16px
                sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px / 20px
                base: ['1rem', { lineHeight: '1.5rem' }],     // 16px / 24px (default)
                lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px / 28px
                xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px / 28px
                '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px / 32px
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px / 36px
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px / 40px
                '5xl': ['3rem', { lineHeight: '1' }],         // 48px (display)
                '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
                '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
            },
            fontWeight: {
                thin: '100',
                extralight: '200',
                light: '300',
                regular: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
                black: '900',
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0em',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em',
            },
            borderRadius: {
                none: '0',
                sm: '0.125rem',      // 2px
                DEFAULT: '0.25rem',  // 4px
                md: '0.375rem',      // 6px
                lg: '0.5rem',        // 8px
                xl: '0.75rem',       // 12px
                '2xl': '1rem',       // 16px
                '3xl': '1.5rem',     // 24px
                full: '9999px',      // Pill/circular
            },
            borderWidth: {
                DEFAULT: '1px',
                0: '0',
                2: '2px',
                4: '4px',
                8: '8px',
            },
            zIndex: {
                auto: 'auto',
                0: '0',
                10: '10',    // Sticky elements
                20: '20',    // Dropdowns, popovers
                30: '30',    // Fixed navigation
                40: '40',    // Modals, dialogs
                50: '50',    // Toasts, notifications
                100: '100',  // Tooltips (highest)
            },
            backdropBlur: {
                none: '0',
                sm: '4px',
                DEFAULT: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
            },
            transitionDuration: {
                75: '75ms',
                100: '100ms',
                150: '150ms',   // Default
                200: '200ms',
                300: '300ms',
                500: '500ms',
                700: '700ms',
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
                linear: 'linear',
                in: 'cubic-bezier(0.4, 0, 1, 1)',
                out: 'cubic-bezier(0, 0, 0.2, 1)',
                'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                floatout: {
                    "0%": { opacity: "1", left: "0px" },
                    "80%": { opacity: "1", left: "0px" },
                    "100%": { opacity: "0", left: "100px" }
                },
                fadeout: {
                    "0%": { opacity: "1" },
                    "80%": { opacity: "1" },
                    "100%": { opacity: "0" }
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                'spin': 'spin 1s linear infinite',
                'slowspin': 'spin 2s linear infinite',
                'floatout': 'floatout 5s linear 1',
                'fadeout': 'fadeout 5s linear 1',
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            boxShadow: {
                'brand': "0 0 0 3px color-mix(in srgb, transparent, theme('colors.brand.500') 50%)",
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
