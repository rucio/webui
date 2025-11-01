import type { Meta, StoryObj } from '@storybook/nextjs';
import { PageContainer } from './PageContainer';

const meta: Meta<typeof PageContainer> = {
    title: 'Features/Layout/PageContainer',
    component: PageContainer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        maxWidth: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
            description: 'Maximum width constraint',
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
            description: 'Responsive padding',
        },
        centered: {
            control: 'boolean',
            description: 'Center the container horizontally',
        },
    },
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

// Basic variants
export const Default: Story = {
    args: {
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Page Title</h1>
                <p>Default PageContainer with xl max-width and medium padding.</p>
            </div>
        ),
    },
};

export const Small: Story = {
    args: {
        maxWidth: 'sm',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Small Container</h1>
                <p>Narrow container (640px max) ideal for focused content like articles or forms.</p>
            </div>
        ),
    },
};

export const Medium: Story = {
    args: {
        maxWidth: 'md',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Medium Container</h1>
                <p>Medium container (768px max) good for readable text content.</p>
            </div>
        ),
    },
};

export const Large: Story = {
    args: {
        maxWidth: 'lg',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Large Container</h1>
                <p>Large container (1024px max) for dashboard layouts.</p>
            </div>
        ),
    },
};

export const ExtraLarge: Story = {
    args: {
        maxWidth: 'xl',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Extra Large Container</h1>
                <p>Extra large container (1280px max) - default size for most pages.</p>
            </div>
        ),
    },
};

export const DoubleExtraLarge: Story = {
    args: {
        maxWidth: '2xl',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">2XL Container</h1>
                <p>2XL container (1536px max) for wide dashboards and data tables.</p>
            </div>
        ),
    },
};

export const FullWidth: Story = {
    args: {
        maxWidth: 'full',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Full Width Container</h1>
                <p>No max-width constraint - spans entire viewport.</p>
            </div>
        ),
    },
};

// Padding variants
export const NoPadding: Story = {
    args: {
        padding: 'none',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">No Padding</h1>
                <p>Container with no padding - useful for full-bleed content.</p>
            </div>
        ),
    },
};

export const SmallPadding: Story = {
    args: {
        padding: 'sm',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Small Padding</h1>
                <p>Compact padding (16px mobile, 24px desktop)</p>
            </div>
        ),
    },
};

export const MediumPadding: Story = {
    args: {
        padding: 'md',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Medium Padding</h1>
                <p>Standard padding (24px mobile, 32px desktop) - default</p>
            </div>
        ),
    },
};

export const LargePadding: Story = {
    args: {
        padding: 'lg',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Large Padding</h1>
                <p>Spacious padding (32px mobile, 40px desktop)</p>
            </div>
        ),
    },
};

// Centered variants
export const NotCentered: Story = {
    args: {
        centered: false,
        maxWidth: 'md',
        children: (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded">
                <h1 className="text-2xl font-bold mb-4">Not Centered</h1>
                <p>Container aligned to the left instead of centered.</p>
            </div>
        ),
    },
};

// Real-world examples
export const TypicalPage: Story = {
    render: () => (
        <PageContainer>
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">Welcome to your Rucio dashboard</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Card {i}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Dashboard card content</p>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Data Table</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Table content would go here</p>
            </div>
        </PageContainer>
    ),
};

export const ArticlePage: Story = {
    render: () => (
        <PageContainer maxWidth="md">
            <article className="prose dark:prose-invert">
                <h1 className="text-4xl font-bold mb-4">Article Title</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Published on January 1, 2025</p>

                <p className="mb-4">
                    This is an example of an article layout using PageContainer with medium max-width for optimal reading experience.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Section Heading</h2>
                <p className="mb-4">
                    The narrower container width (768px) ensures comfortable line length for reading, following best practices for
                    typography and readability.
                </p>

                <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                </p>
            </article>
        </PageContainer>
    ),
};

export const NestedContainers: Story = {
    render: () => (
        <PageContainer maxWidth="2xl" padding="lg" className="bg-neutral-50 dark:bg-neutral-950">
            <h1 className="text-3xl font-bold mb-8">Nested Containers</h1>

            <PageContainer maxWidth="lg" className="bg-neutral-100 dark:bg-neutral-900 mb-6">
                <h2 className="text-xl font-semibold mb-2">Inner Container (lg)</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    You can nest PageContainers for complex layouts.
                </p>
            </PageContainer>

            <PageContainer maxWidth="md" className="bg-neutral-100 dark:bg-neutral-900">
                <h2 className="text-xl font-semibold mb-2">Narrower Inner Container (md)</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Centered within the outer 2xl container.</p>
            </PageContainer>
        </PageContainer>
    ),
};

export const WithFixedHeader: Story = {
    render: () => (
        <div>
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-30">
                <div className="h-full flex items-center justify-between px-6">
                    <span className="font-semibold">Fixed Header</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Navigation</span>
                </div>
            </div>

            {/* Main Content with top padding to account for fixed header */}
            <PageContainer className="pt-14">
                <h1 className="text-3xl font-bold mb-4">Page with Fixed Header</h1>
                <p className="mb-4">Content starts below the fixed header using padding-top.</p>

                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2">Section {i}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Scroll to see fixed header behavior</p>
                    </div>
                ))}
            </PageContainer>
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark bg-neutral-900 min-h-screen">
            <PageContainer>
                <h1 className="text-4xl font-bold text-neutral-100 mb-4">Dark Mode</h1>
                <p className="text-neutral-400 mb-8">PageContainer with dark mode styling</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                            <h3 className="font-semibold text-neutral-100 mb-2">Card {i}</h3>
                            <p className="text-sm text-neutral-400">Content in dark mode</p>
                        </div>
                    ))}
                </div>
            </PageContainer>
        </div>
    ),
};

// Responsive demonstration
export const ResponsivePadding: Story = {
    render: () => (
        <PageContainer>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Responsive Padding</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Resize your browser to see how padding adjusts:
                </p>
                <ul className="text-sm space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li>• Mobile ({"<"}768px): 16px horizontal, 24px vertical</li>
                    <li>• Tablet/Desktop (≥768px): 24px horizontal, 32px vertical</li>
                </ul>
            </div>
        </PageContainer>
    ),
};

// All combinations
export const AllMaxWidths: Story = {
    render: () => (
        <div className="space-y-8 p-4">
            {(['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map(size => (
                <PageContainer key={size} maxWidth={size} className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded">
                    <span className="font-semibold">{size}</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">max-width</span>
                </PageContainer>
            ))}
        </div>
    ),
};
