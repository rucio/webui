import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Atoms/Misc/ProgressBar',
    component: ProgressBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        percentage: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Progress percentage (0-100)',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the progress bar',
        },
        variant: {
            control: 'select',
            options: ['default', 'success', 'error', 'warning'],
            description: 'Color variant of the progress bar',
        },
        indeterminate: {
            control: 'boolean',
            description: 'Show indeterminate loading state',
        },
        showLabel: {
            control: 'boolean',
            description: 'Show percentage label',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[400px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// Basic progress
export const Default: Story = {
    args: {
        percentage: 50,
    },
};

// With label
export const WithLabel: Story = {
    args: {
        percentage: 75,
        showLabel: true,
    },
};

// Sizes
export const Small: Story = {
    args: {
        percentage: 60,
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        percentage: 60,
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        percentage: 60,
        size: 'lg',
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Small</p>
                <ProgressBar percentage={60} size="sm" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium (default)</p>
                <ProgressBar percentage={60} size="md" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Large</p>
                <ProgressBar percentage={60} size="lg" />
            </div>
        </div>
    ),
};

// Variants
export const DefaultVariant: Story = {
    args: {
        percentage: 70,
        variant: 'default',
    },
};

export const Success: Story = {
    args: {
        percentage: 100,
        variant: 'success',
    },
};

export const Error: Story = {
    args: {
        percentage: 25,
        variant: 'error',
    },
};

export const Warning: Story = {
    args: {
        percentage: 50,
        variant: 'warning',
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Default</p>
                <ProgressBar percentage={70} variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Success</p>
                <ProgressBar percentage={100} variant="success" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Warning</p>
                <ProgressBar percentage={50} variant="warning" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Error</p>
                <ProgressBar percentage={25} variant="error" />
            </div>
        </div>
    ),
};

// Indeterminate
export const Indeterminate: Story = {
    args: {
        indeterminate: true,
    },
};

export const IndeterminateWithVariants: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Default</p>
                <ProgressBar indeterminate variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Success</p>
                <ProgressBar indeterminate variant="success" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Warning</p>
                <ProgressBar indeterminate variant="warning" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Error</p>
                <ProgressBar indeterminate variant="error" />
            </div>
        </div>
    ),
};

// Different percentages
export const DifferentPercentages: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <div className="space-y-2">
                <ProgressBar percentage={0} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={25} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={50} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={75} showLabel />
            </div>
            <div className="space-y-2">
                <ProgressBar percentage={100} showLabel />
            </div>
        </div>
    ),
};

// Animated progress (interactive)
export const Animated: Story = {
    render: () => {
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) return 0;
                    return prev + 1;
                });
            }, 50);

            return () => clearInterval(interval);
        }, []);

        return (
            <div className="space-y-4 w-full">
                <ProgressBar percentage={progress} showLabel />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                    Auto-incrementing progress ({progress}%)
                </p>
            </div>
        );
    },
};

// File upload example
export const FileUpload: Story = {
    render: () => {
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) return 100;
                    return prev + 2;
                });
            }, 100);

            return () => clearInterval(interval);
        }, []);

        return (
            <div className="space-y-4 w-full">
                <div>
                    <h3 className="text-sm font-medium mb-2">Uploading file.pdf</h3>
                    <ProgressBar percentage={progress} variant="default" showLabel />
                </div>
                {progress === 100 && (
                    <p className="text-sm text-base-success-600 dark:text-base-success-500">Upload complete!</p>
                )}
            </div>
        );
    },
};

// Download example
export const Download: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">dataset-2024.csv</h3>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">45 MB / 100 MB</span>
                </div>
                <ProgressBar percentage={45} variant="default" />
            </div>
        </div>
    ),
};

// Multi-step progress
export const MultiStep: Story = {
    render: () => {
        const steps = ['Upload', 'Processing', 'Complete'];
        const currentStep = 1;
        const progressPercentage = ((currentStep + 1) / steps.length) * 100;

        return (
            <div className="space-y-4 w-full">
                <div className="flex justify-between text-sm">
                    {steps.map((step, index) => (
                        <span
                            key={step}
                            className={index <= currentStep ? 'text-brand-600 font-medium' : 'text-neutral-400'}
                        >
                            {step}
                        </span>
                    ))}
                </div>
                <ProgressBar percentage={progressPercentage} variant="default" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>
        );
    },
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Default</p>
                <ProgressBar percentage={70} variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Success</p>
                <ProgressBar percentage={100} variant="success" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Warning</p>
                <ProgressBar percentage={50} variant="warning" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Error</p>
                <ProgressBar percentage={25} variant="error" showLabel />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Indeterminate</p>
                <ProgressBar indeterminate variant="default" />
            </div>
        </div>
    ),
};

// With descriptive text
export const WithDescription: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Processing dataset</h3>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">1,234 / 5,000 records</span>
                </div>
                <ProgressBar percentage={25} variant="default" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Estimated time remaining: 5 minutes</p>
            </div>
        </div>
    ),
};

// Stacked progress bars
export const StackedProgress: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">45%</span>
                </div>
                <ProgressBar percentage={45} variant="default" size="sm" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">78%</span>
                </div>
                <ProgressBar percentage={78} variant="warning" size="sm" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span className="text-neutral-600 dark:text-neutral-400">92%</span>
                </div>
                <ProgressBar percentage={92} variant="error" size="sm" />
            </div>
        </div>
    ),
};
