import type { Meta, StoryObj } from '@storybook/nextjs';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
    title: 'Atoms/Misc/Field',
    component: Field,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'subtle', 'brand', 'success', 'error', 'warning'],
            description: 'Visual variant of the field',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the field',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Whether the field takes full width',
        },
        truncate: {
            control: 'boolean',
            description: 'Whether to truncate long text',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[600px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Field>;

// Basic variants
export const Default: Story = {
    args: {
        children: 'Default field',
    },
};

export const Subtle: Story = {
    args: {
        children: 'Subtle field',
        variant: 'subtle',
    },
};

export const Brand: Story = {
    args: {
        children: 'Brand field',
        variant: 'brand',
    },
};

export const Success: Story = {
    args: {
        children: 'Success field',
        variant: 'success',
    },
};

export const Error: Story = {
    args: {
        children: 'Error field',
        variant: 'error',
    },
};

export const Warning: Story = {
    args: {
        children: 'Warning field',
        variant: 'warning',
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Field variant="default">Default</Field>
            <Field variant="subtle">Subtle</Field>
            <Field variant="brand">Brand</Field>
            <Field variant="success">Success</Field>
            <Field variant="error">Error</Field>
            <Field variant="warning">Warning</Field>
        </div>
    ),
};

// Sizes
export const Small: Story = {
    args: {
        children: 'Small field',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        children: 'Medium field',
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        children: 'Large field',
        size: 'lg',
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Field size="sm">Small</Field>
            <Field size="md">Medium</Field>
            <Field size="lg">Large</Field>
        </div>
    ),
};

// Width variants
export const FitContent: Story = {
    args: {
        children: 'Fit content',
        fullWidth: false,
    },
};

export const FullWidth: Story = {
    args: {
        children: 'Full width field',
        fullWidth: true,
    },
};

// Truncate
export const TruncatedText: Story = {
    args: {
        children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
        truncate: true,
        className: 'max-w-xs',
    },
};

export const NonTruncatedText: Story = {
    args: {
        children: 'This is a very long text that will wrap to multiple lines instead of being truncated',
        truncate: false,
        className: 'max-w-xs',
    },
};

// Real-world examples
export const KeyValuePairs: Story = {
    render: () => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Name:</span>
                <Field>John Doe</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Email:</span>
                <Field>john.doe@example.com</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Role:</span>
                <Field variant="brand">Administrator</Field>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-24">Status:</span>
                <Field variant="success">Active</Field>
            </div>
        </div>
    ),
};

export const DataTable: Story = {
    render: () => (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 p-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm font-medium">ID</span>
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm font-medium">Status</span>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2 p-2">
                    <Field size="sm" variant="subtle">
                        {`#${1000 + i}`}
                    </Field>
                    <Field size="sm">Item {i}</Field>
                    <Field size="sm" variant={i % 2 === 0 ? 'success' : 'warning'}>
                        {i % 2 === 0 ? 'Complete' : 'Pending'}
                    </Field>
                </div>
            ))}
        </div>
    ),
};

export const Tags: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Field size="sm" variant="brand">
                React
            </Field>
            <Field size="sm" variant="brand">
                TypeScript
            </Field>
            <Field size="sm" variant="brand">
                Next.js
            </Field>
            <Field size="sm" variant="brand">
                Tailwind
            </Field>
            <Field size="sm" variant="brand">
                Storybook
            </Field>
        </div>
    ),
};

export const MetadataDisplay: Story = {
    render: () => (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Resource Details</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Created</p>
                    <Field>2024-03-15</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Modified</p>
                    <Field>2024-03-20</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Owner</p>
                    <Field>admin@example.com</Field>
                </div>
                <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Type</p>
                    <Field variant="brand">Dataset</Field>
                </div>
            </div>
        </div>
    ),
};

export const StatusIndicators: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Server Status</h4>
                <div className="flex gap-2">
                    <Field variant="success" size="sm">
                        Online
                    </Field>
                    <Field variant="subtle" size="sm">
                        127.0.0.1
                    </Field>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2">Database Status</h4>
                <div className="flex gap-2">
                    <Field variant="warning" size="sm">
                        Maintenance
                    </Field>
                    <Field variant="subtle" size="sm">
                        postgres.local
                    </Field>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2">API Status</h4>
                <div className="flex gap-2">
                    <Field variant="error" size="sm">
                        Offline
                    </Field>
                    <Field variant="subtle" size="sm">
                        api.example.com
                    </Field>
                </div>
            </div>
        </div>
    ),
};

export const FileInfo: Story = {
    render: () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">File name:</span>
                <Field truncate className="max-w-xs">
                    very-long-filename-that-needs-to-be-truncated-for-display.pdf
                </Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Size:</span>
                <Field size="sm">2.4 MB</Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Type:</span>
                <Field size="sm" variant="brand">
                    PDF Document
                </Field>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Status:</span>
                <Field size="sm" variant="success">
                    Uploaded
                </Field>
            </div>
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Field>
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Visible
                </span>
            </Field>
            <Field variant="success">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Verified
                </span>
            </Field>
            <Field variant="error">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Error
                </span>
            </Field>
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-6">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Variants</p>
                <div className="flex flex-wrap gap-2">
                    <Field variant="default">Default</Field>
                    <Field variant="subtle">Subtle</Field>
                    <Field variant="brand">Brand</Field>
                    <Field variant="success">Success</Field>
                    <Field variant="error">Error</Field>
                    <Field variant="warning">Warning</Field>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Sizes</p>
                <div className="flex flex-wrap items-center gap-2">
                    <Field size="sm">Small</Field>
                    <Field size="md">Medium</Field>
                    <Field size="lg">Large</Field>
                </div>
            </div>
        </div>
    ),
};

// All combinations
export const AllCombinations: Story = {
    render: () => (
        <div className="space-y-6">
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <div key={size} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize">{size}</h3>
                    <div className="flex flex-wrap gap-2">
                        {(['default', 'subtle', 'brand', 'success', 'error', 'warning'] as const).map((variant) => (
                            <Field key={variant} size={size} variant={variant}>
                                {variant}
                            </Field>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};
