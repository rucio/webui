import type { Meta, StoryObj } from '@storybook/react';
import { LoadingElement } from './LoadingElement';

const meta = {
    title: 'Atoms/Loading/LoadingElement',
    component: LoadingElement,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'LoadingElement is a properly centered loading indicator that wraps LoadingSpinner. Use this component instead of LoadingSpinner directly to ensure consistent loading states across the application.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        context: {
            control: 'select',
            options: ['page', 'section', 'card', 'inline', 'fullscreen'],
            description: 'The context in which the loading element is used',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
            description: 'Size of the spinner',
        },
        variant: {
            control: 'select',
            options: ['default', 'neutral', 'success', 'error', 'warning'],
            description: 'Color variant of the spinner',
        },
        text: {
            control: 'text',
            description: 'Text to display below the spinner',
        },
        description: {
            control: 'text',
            description: 'Description text to display below the main text',
        },
    },
} satisfies Meta<typeof LoadingElement>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {},
};

// Different contexts
export const PageContext: Story = {
    args: {
        context: 'page',
        size: 'lg',
        text: 'Loading page...',
        description: 'Please wait while we fetch your data',
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const SectionContext: Story = {
    args: {
        context: 'section',
        size: 'md',
    },
    decorators: [
        (Story) => (
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

export const CardContext: Story = {
    args: {
        context: 'card',
        size: 'md',
        text: 'Loading data...',
    },
    decorators: [
        (Story) => (
            <div className="w-64 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                <Story />
            </div>
        ),
    ],
};

export const InlineContext: Story = {
    args: {
        context: 'inline',
        size: 'sm',
        text: 'Processing...',
    },
    render: (args) => (
        <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm mb-2">Your request is being processed:</p>
            <LoadingElement {...args} />
        </div>
    ),
};

// With text variations
export const WithText: Story = {
    args: {
        context: 'section',
        size: 'lg',
        text: 'Loading application data...',
    },
};

export const WithTextAndDescription: Story = {
    args: {
        context: 'section',
        size: 'lg',
        text: 'Loading application',
        description: 'This may take a few moments. Please wait...',
    },
};

// Different sizes
export const SmallSize: Story = {
    args: {
        size: 'sm',
        context: 'inline',
        text: 'Loading...',
    },
};

export const MediumSize: Story = {
    args: {
        size: 'md',
        context: 'section',
        text: 'Loading data...',
    },
    decorators: [
        (Story) => (
            <div className="h-64 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

export const LargeSize: Story = {
    args: {
        size: 'lg',
        context: 'page',
        text: 'Loading application',
        description: 'Please wait...',
    },
};

export const ExtraLargeSize: Story = {
    args: {
        size: 'xl',
        context: 'fullscreen',
        text: 'Initializing',
        description: 'Setting up your environment...',
    },
    parameters: {
        layout: 'fullscreen',
    },
};

// Different variants
export const DefaultVariant: Story = {
    args: {
        variant: 'default',
        context: 'section',
        text: 'Default loading',
    },
    decorators: [
        (Story) => (
            <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

export const SuccessVariant: Story = {
    args: {
        variant: 'success',
        context: 'section',
        text: 'Processing successfully...',
    },
    decorators: [
        (Story) => (
            <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

export const ErrorVariant: Story = {
    args: {
        variant: 'error',
        context: 'section',
        text: 'Retrying...',
    },
    decorators: [
        (Story) => (
            <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

export const WarningVariant: Story = {
    args: {
        variant: 'warning',
        context: 'section',
        text: 'Processing with warnings...',
    },
    decorators: [
        (Story) => (
            <div className="h-48 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Story />
            </div>
        ),
    ],
};

// Real-world examples
export const RSEDetailsLoading: Story = {
    name: 'RSE Details Page Loading',
    args: {
        context: 'page',
        size: 'lg',
        text: 'Loading RSE details...',
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <Story />
                </div>
            </main>
        ),
    ],
};

export const DashboardWidgetLoading: Story = {
    name: 'Dashboard Widget Loading',
    args: {
        context: 'card',
        size: 'md',
        text: 'Loading widget data...',
    },
    decorators: [
        (Story) => (
            <div className="w-96 h-64 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <Story />
            </div>
        ),
    ],
};

export const HeaderLoading: Story = {
    name: 'Header Loading',
    args: {
        context: 'inline',
        size: 'sm',
    },
    decorators: [
        (Story) => (
            <header className="h-14 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6">
                <Story />
            </header>
        ),
    ],
};

// Dark mode
export const DarkMode: Story = {
    args: {
        context: 'section',
        size: 'lg',
        text: 'Loading in dark mode...',
        description: 'Please wait while we load your data',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="dark h-64 bg-neutral-900 rounded-lg border border-neutral-700">
                <Story />
            </div>
        ),
    ],
};

// Comparison with old pattern
export const ComparisonWithOldPattern: Story = {
    name: '❌ Old vs ✅ New Pattern',
    render: () => (
        <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-base-error-600">❌ Old Pattern (Avoid)</h3>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg h-48 p-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Not centered, inconsistent:</p>
                    <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                        {'<LoadingSpinner />'}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-base-success-600">✅ New Pattern (Use This)</h3>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg h-48">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 p-2">Properly centered, consistent:</p>
                    <LoadingElement context="section" className="h-32" />
                    <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded-b-lg">
                        {'<LoadingElement context="section" />'}
                    </div>
                </div>
            </div>
        </div>
    ),
};
