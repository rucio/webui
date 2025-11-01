/**
 * Design System Documentation
 *
 * Interactive showcase of the Rucio WebUI design system foundations.
 * Explore colors, typography, spacing, and other design tokens.
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { colors } from '@/design-tokens/colors';
import { fontSizes, fontWeights } from '@/design-tokens/typography';
import { spacing, semanticSpacing } from '@/design-tokens/spacing';
import { shadows } from '@/design-tokens/elevation';

const meta: Meta = {
    title: 'Design System/Foundations',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'The Rucio WebUI design system foundations inspired by Vercel Geist and Apple HIG. Explore our design tokens for colors, typography, spacing, and elevation.',
            },
        },
    },
};

export default meta;

type Story = StoryObj;

/**
 * Color Palette
 *
 * Our color system is built on high-contrast, accessible colors.
 * All combinations meet WCAG AAA standards (7:1 contrast ratio).
 */
export const Colors: Story = {
    render: () => (
        <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Color System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        High-contrast, accessible color palette for light and dark themes
                    </p>
                </div>

                {/* Neutral Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Neutral (Slate) - UI Colors
                    </h2>
                    <div className="grid grid-cols-11 gap-2">
                        {Object.entries(colors.neutral).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div
                                    className="h-20 rounded-md border border-neutral-200 dark:border-neutral-700"
                                    style={{ backgroundColor: value }}
                                />
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="font-mono">{key}</div>
                                    <div className="font-mono text-[10px]">{value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Brand (Purple) - Primary Actions
                    </h2>
                    <div className="grid grid-cols-9 gap-2">
                        {Object.entries(colors.brand).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div
                                    className="h-20 rounded-md border border-neutral-200 dark:border-neutral-700"
                                    style={{ backgroundColor: value }}
                                />
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="font-mono">{key}</div>
                                    <div className="font-mono text-[10px]">{value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Semantic Colors */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Semantic Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Success */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                                Success (Green)
                            </h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.success).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div
                                            className="h-12 rounded border border-neutral-200 dark:border-neutral-700"
                                            style={{ backgroundColor: value }}
                                        />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Error (Red)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.error).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div
                                            className="h-12 rounded border border-neutral-200 dark:border-neutral-700"
                                            style={{ backgroundColor: value }}
                                        />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                                Warning (Amber)
                            </h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.warning).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div
                                            className="h-12 rounded border border-neutral-200 dark:border-neutral-700"
                                            style={{ backgroundColor: value }}
                                        />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">Info (Blue)</h3>
                            <div className="grid grid-cols-9 gap-2">
                                {Object.entries(colors.base.info).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div
                                            className="h-12 rounded border border-neutral-200 dark:border-neutral-700"
                                            style={{ backgroundColor: value }}
                                        />
                                        <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

/**
 * Typography
 *
 * Our type system uses Inter for UI and JetBrains Mono for code.
 * Based on a modular scale (1.25) for harmonious proportions.
 */
export const Typography: Story = {
    render: () => (
        <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Typography</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Modern, legible type system optimized for screen reading
                    </p>
                </div>

                {/* Font Families */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Font Families</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">font-sans</p>
                            <p className="text-2xl font-sans text-neutral-900 dark:text-neutral-100">
                                Inter - The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">font-mono</p>
                            <p className="text-2xl font-mono text-neutral-900 dark:text-neutral-100">
                                JetBrains Mono - The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                    </div>
                </div>

                {/* Type Scale */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Type Scale</h2>
                    <div className="space-y-4">
                        {Object.entries(fontSizes).map(([key, value]) => (
                            <div key={key} className="flex items-baseline gap-4">
                                <div className="w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                <div
                                    className="flex-1 text-neutral-900 dark:text-neutral-100"
                                    style={{ fontSize: value.size, lineHeight: value.lineHeight }}
                                >
                                    The quick brown fox jumps over the lazy dog
                                </div>
                                <div className="text-sm font-mono text-neutral-500">{value.size}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Font Weights */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Font Weights</h2>
                    <div className="space-y-2">
                        {Object.entries(fontWeights).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-4">
                                <div className="w-32 text-sm font-mono text-neutral-600 dark:text-neutral-400">{key}</div>
                                <div
                                    className="flex-1 text-2xl text-neutral-900 dark:text-neutral-100"
                                    style={{ fontWeight: value }}
                                >
                                    The quick brown fox jumps over the lazy dog
                                </div>
                                <div className="text-sm font-mono text-neutral-500">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography Presets */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Typography Presets
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Display</p>
                            <div className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-100">
                                Display Text
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H1</p>
                            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">Heading 1</h1>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H2</p>
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Heading 2</h2>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">H3</p>
                            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Heading 3</h3>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Body</p>
                            <p className="text-base text-neutral-700 dark:text-neutral-300">
                                This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Caption</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">This is caption text</p>
                        </div>
                        <div>
                            <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-2">Code</p>
                            <code className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                const greeting = &apos;Hello, world!&apos;;
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

/**
 * Spacing
 *
 * 8px-based spacing scale for consistent layouts.
 */
export const Spacing: Story = {
    render: () => (
        <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Spacing System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">8px-based grid for consistent layouts</p>
                </div>

                {/* Spacing Scale */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Spacing Scale</h2>
                    <div className="space-y-4">
                        {Object.entries(spacing)
                            .filter(([key]) => !isNaN(Number(key)) && Number(key) <= 20)
                            .map(([key, value]) => (
                                <div key={key} className="flex items-center gap-4">
                                    <div className="w-20 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                                        {key}
                                    </div>
                                    <div
                                        className="bg-brand-500 h-8 rounded"
                                        style={{ width: value }}
                                    />
                                    <div className="text-sm font-mono text-neutral-500">{value}</div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Semantic Spacing */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Semantic Spacing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(semanticSpacing).map(([category, values]) => (
                            <div key={category} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 capitalize">
                                    {category}
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(values).map(([name, value]) => (
                                        <div key={name} className="flex items-center gap-3">
                                            <div className="w-24 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                                                {name}
                                            </div>
                                            <div className="bg-brand-500 h-6 rounded" style={{ width: value }} />
                                            <div className="text-xs font-mono text-neutral-500">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ),
};

/**
 * Shadows & Elevation
 *
 * Subtle depth through shadows inspired by Apple's Liquid Glass.
 */
export const Elevation: Story = {
    render: () => (
        <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Elevation System</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Subtle shadows for visual depth and hierarchy
                    </p>
                </div>

                {/* Shadows */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Shadow Levels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(shadows)
                            .filter(([key]) => !['none', 'inner', 'brand'].includes(key))
                            .map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div
                                        className="h-32 bg-neutral-0 dark:bg-neutral-800 rounded-lg flex items-center justify-center"
                                        style={{ boxShadow: value }}
                                    >
                                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                            shadow-{key}
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{value}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Brand Shadow (Focus Ring) */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Brand Shadow</h2>
                    <div className="p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <div
                            className="h-24 bg-neutral-0 dark:bg-neutral-900 rounded-lg flex items-center justify-center"
                            style={{ boxShadow: shadows.brand }}
                        >
                            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                Focus Ring (Brand Shadow)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

/**
 * Design Principles
 *
 * The foundational principles guiding our design decisions.
 */
export const Principles: Story = {
    render: () => (
        <div className="p-8 bg-neutral-0 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Design Principles</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Inspired by Vercel Geist and Apple HIG
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                            1. Clarity (Apple HIG)
                        </h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Everything in the interface should be immediately understandable. Use precise language, clear
                            visual hierarchy, and purposeful design.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                            2. Simplicity (Vercel Geist)
                        </h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Embrace minimalism and restraint. Remove unnecessary decoration and focus on content and
                            functionality.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                            3. Depth (Apple Liquid Glass)
                        </h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Use subtle layers, translucency, and shadows to create visual hierarchy and guide attention.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                            4. Accessibility First
                        </h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Every component must be accessible by default. WCAG AAA compliance with 7:1 contrast ratios,
                            keyboard navigation, and screen reader support.
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">5. Performance</h2>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                            Optimized components with efficient rendering, code splitting, and proper memoization for fast,
                            responsive interfaces.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ),
};
