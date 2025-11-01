import type { Meta, StoryObj } from '@storybook/nextjs';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '../form/button';

const meta: Meta<typeof LoadingSpinner> = {
    title: 'Atoms/Loading/LoadingSpinner',
    component: LoadingSpinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
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
    },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

// Basic spinner
export const Default: Story = {
    args: {},
};

// Sizes
export const Small: Story = {
    args: {
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};

export const ExtraLarge: Story = {
    args: {
        size: 'xl',
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-8">
            <div className="text-center space-y-2">
                <LoadingSpinner size="sm" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Small</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner size="md" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Medium</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner size="lg" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Large</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner size="xl" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Extra Large</p>
            </div>
        </div>
    ),
};

// Variants
export const DefaultVariant: Story = {
    args: {
        variant: 'default',
    },
};

export const Neutral: Story = {
    args: {
        variant: 'neutral',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
    },
};

export const Error: Story = {
    args: {
        variant: 'error',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="flex items-center gap-8">
            <div className="text-center space-y-2">
                <LoadingSpinner variant="default" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Default</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner variant="neutral" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Neutral</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner variant="success" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Success</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner variant="error" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Error</p>
            </div>
            <div className="text-center space-y-2">
                <LoadingSpinner variant="warning" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Warning</p>
            </div>
        </div>
    ),
};

// In button
export const InButton: Story = {
    render: () => (
        <div className="flex gap-4">
            <Button loading>Loading...</Button>
            <Button variant="success" disabled>
                <LoadingSpinner size="sm" variant="success" className="mr-2" />
                Processing
            </Button>
        </div>
    ),
};

// Centered in container
export const Centered: Story = {
    render: () => (
        <div className="flex items-center justify-center h-64 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <LoadingSpinner size="lg" />
        </div>
    ),
};

// With text
export const WithText: Story = {
    render: () => (
        <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading data...</p>
        </div>
    ),
};

export const WithTextInline: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <p className="text-sm">Loading...</p>
        </div>
    ),
};

// Full page loading
export const FullPageLoading: Story = {
    render: () => (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="text-center space-y-4">
                <LoadingSpinner size="xl" />
                <div>
                    <h3 className="text-lg font-medium">Loading Application</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Please wait while we load your data...</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        layout: 'fullscreen',
    },
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900">
            <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                    <LoadingSpinner variant="default" />
                    <p className="text-xs text-neutral-400">Default</p>
                </div>
                <div className="text-center space-y-2">
                    <LoadingSpinner variant="neutral" />
                    <p className="text-xs text-neutral-400">Neutral</p>
                </div>
                <div className="text-center space-y-2">
                    <LoadingSpinner variant="success" />
                    <p className="text-xs text-neutral-400">Success</p>
                </div>
                <div className="text-center space-y-2">
                    <LoadingSpinner variant="error" />
                    <p className="text-xs text-neutral-400">Error</p>
                </div>
            </div>
        </div>
    ),
};

// Overlay
export const Overlay: Story = {
    render: () => (
        <div className="relative h-64 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-6">
                <h3 className="text-lg font-medium mb-2">Content</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Some content that is being loaded...</p>
            </div>
            <div className="absolute inset-0 bg-neutral-0 dark:bg-neutral-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        </div>
    ),
};

// Card loading
export const CardLoading: Story = {
    render: () => (
        <div className="w-64 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <div className="flex flex-col items-center justify-center h-32 space-y-4">
                <LoadingSpinner />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading card data...</p>
            </div>
        </div>
    ),
};

// Different contexts
export const InDifferentContexts: Story = {
    render: () => (
        <div className="space-y-8 w-full max-w-md">
            {/* Button context */}
            <div>
                <h4 className="text-sm font-medium mb-2">In Buttons</h4>
                <div className="flex gap-2">
                    <Button loading>Loading</Button>
                    <Button variant="success" disabled>
                        <LoadingSpinner size="sm" variant="success" className="mr-2" />
                        Success
                    </Button>
                </div>
            </div>

            {/* Inline context */}
            <div>
                <h4 className="text-sm font-medium mb-2">Inline with Text</h4>
                <p className="flex items-center gap-2 text-sm">
                    <LoadingSpinner size="sm" />
                    Processing your request...
                </p>
            </div>

            {/* Card context */}
            <div>
                <h4 className="text-sm font-medium mb-2">In Card</h4>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-center h-24">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        </div>
    ),
};
