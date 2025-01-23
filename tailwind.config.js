module.exports = {
    darkMode: 'class',
    content: {
        files: ["./src/**/*.{html,js,tsx,ts}"],
        extract: {
            columnMetaStyle: (content) => {
                return content.match(/(?<=meta([:\s{]*)style:\s")[a-zA-Z\-\[\]0-9:\s]*(?=")/)
            },
            reactModalStyle: (content) => {
                return content.match(/(?<=overlayClassName=")[a-zA-Z\-\[\]0-9:\s]*(?=")/)
            },
        }
    },
    theme: {
        extend: {
            screens: {
                'nav': '850px',
            },
            colors: {
                neutral: { // Slate
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
                text: {// Slate
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
                brand: {
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
                    success: { // green
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
                    error: {// Red
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
                    warning: {//Amber
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
                    info: {// blue
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
                sans: ["monospace"],
                mono: ["monospace"],
                serif: ["monospace"],
                forcesans: ["sans-serif"],
                forceserif: ["serif"],
            },
            keyframes: {
                floatout: {
                    "0%": {opacity: "1", left: "0px",},
                    "80%": {opacity: "1", left: "0px",},
                    "100%": {opacity: "0", left: "100px",}
                },
                fadeout: {
                    "0%": {opacity: "1"},
                    "80%": {opacity: "1"},
                    "100%": {opacity: "0"}
                },
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
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