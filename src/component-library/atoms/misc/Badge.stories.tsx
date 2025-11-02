import type { Meta, StoryObj } from '@storybook/nextjs';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Misc/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'error', 'warning', 'info', 'neutral'],
            description: 'Visual variant of the badge',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the badge',
        },
        shape: {
            control: 'select',
            options: ['rounded', 'pill', 'square'],
            description: 'Shape of the badge',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic variants
export const Default: Story = {
    args: {
        value: 'Default',
    },
};

export const Success: Story = {
    args: {
        value: 'Success',
        variant: 'success',
    },
};

export const Error: Story = {
    args: {
        value: 'Error',
        variant: 'error',
    },
};

export const Warning: Story = {
    args: {
        value: 'Warning',
        variant: 'warning',
    },
};

export const Info: Story = {
    args: {
        value: 'Info',
        variant: 'info',
    },
};

export const Neutral: Story = {
    args: {
        value: 'Neutral',
        variant: 'neutral',
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Badge value="Default" variant="default" />
            <Badge value="Success" variant="success" />
            <Badge value="Error" variant="error" />
            <Badge value="Warning" variant="warning" />
            <Badge value="Info" variant="info" />
            <Badge value="Neutral" variant="neutral" />
        </div>
    ),
};

// Sizes
export const Small: Story = {
    args: {
        value: 'Small',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        value: 'Medium',
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        value: 'Large',
        size: 'lg',
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Badge value="Small" size="sm" />
            <Badge value="Medium" size="md" />
            <Badge value="Large" size="lg" />
        </div>
    ),
};

// Shapes
export const Rounded: Story = {
    args: {
        value: 'Rounded',
        shape: 'rounded',
    },
};

export const Pill: Story = {
    args: {
        value: 'Pill',
        shape: 'pill',
    },
};

export const Square: Story = {
    args: {
        value: 'Square',
        shape: 'square',
    },
};

// All shapes showcase
export const AllShapes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Badge value="Rounded" shape="rounded" />
            <Badge value="Pill" shape="pill" />
            <Badge value="Square" shape="square" />
        </div>
    ),
};

// Combined variants
export const SuccessPill: Story = {
    args: {
        value: 'Success',
        variant: 'success',
        shape: 'pill',
    },
};

export const ErrorSmall: Story = {
    args: {
        value: 'Error',
        variant: 'error',
        size: 'sm',
    },
};

export const WarningLarge: Story = {
    args: {
        value: 'Warning',
        variant: 'warning',
        size: 'lg',
    },
};

// Real-world examples
export const StatusBadges: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Badge value="Active" variant="success" size="sm" shape="pill" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Badge value="Pending" variant="warning" size="sm" shape="pill" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Badge value="Failed" variant="error" size="sm" shape="pill" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Badge value="Inactive" variant="neutral" size="sm" shape="pill" />
            </div>
        </div>
    ),
};

export const NotificationCount: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <div className="relative">
                <button className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded">
                    <span className="text-neutral-900 dark:text-neutral-100">Inbox</span>
                </button>
                <Badge value="5" variant="error" size="sm" shape="pill" className="absolute -top-2 -right-2" />
            </div>
            <div className="relative">
                <button className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded">
                    <span className="text-neutral-900 dark:text-neutral-100">Messages</span>
                </button>
                <Badge value="12" variant="info" size="sm" shape="pill" className="absolute -top-2 -right-2" />
            </div>
        </div>
    ),
};

export const Categories: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge value="JavaScript" variant="info" size="sm" />
            <Badge value="TypeScript" variant="info" size="sm" />
            <Badge value="React" variant="success" size="sm" />
            <Badge value="Next.js" variant="success" size="sm" />
            <Badge value="Tailwind" variant="neutral" size="sm" />
        </div>
    ),
};

export const PriorityLabels: Story = {
    render: () => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Badge value="Critical" variant="error" size="sm" />
                <span className="text-sm">Critical priority issue</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge value="High" variant="warning" size="sm" />
                <span className="text-sm">High priority task</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge value="Medium" variant="info" size="sm" />
                <span className="text-sm">Medium priority feature</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge value="Low" variant="neutral" size="sm" />
                <span className="text-sm">Low priority enhancement</span>
            </div>
        </div>
    ),
};

export const VersionBadges: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Application</span>
                <Badge value="v2.1.0" variant="success" size="sm" shape="pill" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">API</span>
                <Badge value="v1.5.3" variant="info" size="sm" shape="pill" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Beta</span>
                <Badge value="v3.0.0-beta.2" variant="warning" size="sm" shape="pill" />
            </div>
        </div>
    ),
};

export const FeatureFlags: Story = {
    render: () => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm">Dark Mode</span>
                <Badge value="Enabled" variant="success" size="sm" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Beta Features</span>
                <Badge value="Disabled" variant="neutral" size="sm" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Analytics</span>
                <Badge value="Enabled" variant="success" size="sm" />
            </div>
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge variant="success" size="sm">
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Verified
                </span>
            </Badge>
            <Badge variant="error" size="sm">
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Blocked
                </span>
            </Badge>
            <Badge variant="warning" size="sm">
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Warning
                </span>
            </Badge>
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400 mb-2">Variants</p>
                <div className="flex flex-wrap gap-2">
                    <Badge value="Default" variant="default" />
                    <Badge value="Success" variant="success" />
                    <Badge value="Error" variant="error" />
                    <Badge value="Warning" variant="warning" />
                    <Badge value="Info" variant="info" />
                    <Badge value="Neutral" variant="neutral" />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400 mb-2">Sizes</p>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge value="Small" size="sm" variant="success" />
                    <Badge value="Medium" size="md" variant="success" />
                    <Badge value="Large" size="lg" variant="success" />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400 mb-2">Shapes</p>
                <div className="flex flex-wrap gap-2">
                    <Badge value="Rounded" shape="rounded" variant="info" />
                    <Badge value="Pill" shape="pill" variant="info" />
                    <Badge value="Square" shape="square" variant="info" />
                </div>
            </div>
        </div>
    ),
};

// Interactive grid
export const AllCombinations: Story = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Size × Variant</h3>
                <div className="space-y-2">
                    {['sm', 'md', 'lg'].map(size => (
                        <div key={size} className="flex flex-wrap gap-2">
                            <span className="w-16 text-sm text-neutral-600 dark:text-neutral-400">{size}:</span>
                            {['default', 'success', 'error', 'warning', 'info', 'neutral'].map(variant => (
                                <Badge key={variant} value={variant} size={size as 'sm' | 'md' | 'lg'} variant={variant as any} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Shape × Variant</h3>
                <div className="space-y-2">
                    {['rounded', 'pill', 'square'].map(shape => (
                        <div key={shape} className="flex flex-wrap gap-2">
                            <span className="w-16 text-sm text-neutral-600 dark:text-neutral-400">{shape}:</span>
                            {['default', 'success', 'error', 'warning', 'info', 'neutral'].map(variant => (
                                <Badge key={variant} value={variant} shape={shape as 'rounded' | 'pill' | 'square'} variant={variant as any} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
};
