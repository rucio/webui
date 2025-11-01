import type { Meta, StoryObj } from '@storybook/nextjs';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
    title: 'Features/Layout/Section',
    component: Section,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'subtle', 'bordered', 'elevated'],
            description: 'Visual variant of the section',
        },
        spacing: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'xl'],
            description: 'Vertical spacing (padding-y)',
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
            description: 'Horizontal padding (padding-x)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Section>;

// Basic variants
export const Default: Story = {
    args: {
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Section Title</h2>
                <p>Default section with medium spacing and no background.</p>
            </div>
        ),
    },
};

export const Subtle: Story = {
    args: {
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Subtle Section</h2>
                <p>Section with subtle background color.</p>
            </div>
        ),
    },
};

export const Bordered: Story = {
    args: {
        variant: 'bordered',
        padding: 'md',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Bordered Section</h2>
                <p>Section with border and rounded corners.</p>
            </div>
        ),
    },
};

export const Elevated: Story = {
    args: {
        variant: 'elevated',
        padding: 'md',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Elevated Section</h2>
                <p>Section with background and shadow elevation.</p>
            </div>
        ),
    },
};

// Spacing variants
export const NoSpacing: Story = {
    args: {
        spacing: 'none',
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">No Spacing</h2>
                <p>Section with no vertical padding.</p>
            </div>
        ),
    },
};

export const SmallSpacing: Story = {
    args: {
        spacing: 'sm',
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Small Spacing</h2>
                <p>Compact vertical spacing (16px mobile, 24px desktop).</p>
            </div>
        ),
    },
};

export const MediumSpacing: Story = {
    args: {
        spacing: 'md',
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Medium Spacing</h2>
                <p>Standard vertical spacing (24px mobile, 32px desktop) - default.</p>
            </div>
        ),
    },
};

export const LargeSpacing: Story = {
    args: {
        spacing: 'lg',
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Large Spacing</h2>
                <p>Spacious vertical spacing (32px mobile, 48px desktop).</p>
            </div>
        ),
    },
};

export const ExtraLargeSpacing: Story = {
    args: {
        spacing: 'xl',
        variant: 'subtle',
        children: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Extra Large Spacing</h2>
                <p>Very spacious vertical spacing (48px mobile, 64px desktop).</p>
            </div>
        ),
    },
};

// Real-world examples
export const WithHeading: Story = {
    render: () => (
        <Section spacing="lg" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl font-bold mb-6">
                Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <h3 className="font-semibold mb-2">Feature {i}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Description of feature {i}</p>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

export const HeroSection: Story = {
    render: () => (
        <Section variant="subtle" spacing="xl" padding="md">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Welcome to Rucio</h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                    Scientific Data Management at scale
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                        Get Started
                    </button>
                    <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        Learn More
                    </button>
                </div>
            </div>
        </Section>
    ),
};

export const ContentSection: Story = {
    render: () => (
        <Section spacing="md" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-bold mb-4">
                About
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                This is a standard content section with default styling. It uses semantic HTML (&lt;section&gt; tag) and proper ARIA
                labeling for accessibility.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
                The section automatically handles responsive spacing, adjusting padding based on viewport size using Tailwind CSS.
            </p>
        </Section>
    ),
};

export const CardGrid: Story = {
    render: () => (
        <Section variant="elevated" spacing="lg" padding="lg">
            <h2 className="text-2xl font-bold mb-6">Dashboard Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="text-3xl font-bold text-brand-600 dark:text-brand-500 mb-2">{i * 25}%</div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Metric {i}</p>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

export const AlternatingBackground: Story = {
    render: () => (
        <div>
            <Section variant="default" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 1</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Default background section.</p>
            </Section>

            <Section variant="subtle" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 2</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Subtle background section.</p>
            </Section>

            <Section variant="default" spacing="lg" padding="md">
                <h2 className="text-2xl font-bold mb-4">Section 3</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Back to default background.</p>
            </Section>
        </div>
    ),
};

export const NestedSections: Story = {
    render: () => (
        <Section variant="subtle" spacing="lg" padding="lg">
            <h2 className="text-3xl font-bold mb-6">Parent Section</h2>

            <Section variant="bordered" spacing="md" padding="md" className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Nested Section 1</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Sections can be nested for complex layouts.</p>
            </Section>

            <Section variant="bordered" spacing="md" padding="md">
                <h3 className="text-xl font-semibold mb-3">Nested Section 2</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Each maintains its own spacing and styling.</p>
            </Section>
        </Section>
    ),
};

export const FullPageLayout: Story = {
    render: () => (
        <div>
            {/* Hero Section */}
            <Section variant="subtle" spacing="xl" padding="md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Full Page Layout</h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400">
                        Example of multiple sections composing a complete page
                    </p>
                </div>
            </Section>

            {/* Features Section */}
            <Section spacing="lg" padding="md" aria-labelledby="features">
                <h2 id="features" className="text-2xl font-bold mb-6">
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <h3 className="font-semibold mb-2">Feature {i}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Description</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* CTA Section */}
            <Section variant="subtle" spacing="lg" padding="md">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                    <button className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                        Start Now
                    </button>
                </div>
            </Section>
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark bg-neutral-900 p-8">
            <Section variant="default" spacing="md">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Default in Dark Mode</h2>
                <p className="text-neutral-400">No background in dark mode.</p>
            </Section>

            <Section variant="subtle" spacing="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Subtle in Dark Mode</h2>
                <p className="text-neutral-400">Darker background (neutral-900).</p>
            </Section>

            <Section variant="bordered" spacing="md" padding="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Bordered in Dark Mode</h2>
                <p className="text-neutral-400">Border with neutral-800.</p>
            </Section>

            <Section variant="elevated" spacing="md" padding="md" className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-100 mb-4">Elevated in Dark Mode</h2>
                <p className="text-neutral-400">Background neutral-800 with shadow.</p>
            </Section>
        </div>
    ),
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            {(['default', 'subtle', 'bordered', 'elevated'] as const).map(variant => (
                <Section key={variant} variant={variant} spacing="md" padding={variant !== 'default' ? 'md' : 'none'}>
                    <h3 className="font-semibold mb-2 capitalize">{variant}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Section variant: {variant}</p>
                </Section>
            ))}
        </div>
    ),
};

// Accessibility example
export const WithARIA: Story = {
    render: () => (
        <div>
            <Section spacing="md" aria-labelledby="main-content">
                <h2 id="main-content" className="text-2xl font-bold mb-4">
                    Main Content
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    This section uses aria-labelledby to associate it with the heading.
                </p>
            </Section>

            <Section spacing="md" aria-label="Additional information" className="mt-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                    This section uses aria-label for sections without visible headings.
                </p>
            </Section>
        </div>
    ),
};
