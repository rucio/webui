import type { Meta, StoryObj } from '@storybook/nextjs';
import { HiPlus, HiTrash, HiCheck } from 'react-icons/hi';
import { Button } from './button';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Form/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'error', 'neutral'],
            description: 'Visual style variant of the button',
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg', 'icon'],
            description: 'Size of the button',
        },
        loading: {
            control: 'boolean',
            description: 'Shows loading spinner and disables the button',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the button',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic variants
export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'default',
    },
};

export const Success: Story = {
    args: {
        children: 'Success',
        variant: 'success',
    },
};

export const Error: Story = {
    args: {
        children: 'Delete',
        variant: 'error',
    },
};

export const Neutral: Story = {
    args: {
        children: 'Cancel',
        variant: 'neutral',
    },
};

// Sizes
export const Small: Story = {
    args: {
        children: 'Small Button',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        children: 'Medium Button',
        size: 'default',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        size: 'lg',
    },
};

export const IconButton: Story = {
    args: {
        size: 'icon',
        children: <HiPlus className="h-4 w-4" />,
        'aria-label': 'Add item',
    },
};

// States
export const Loading: Story = {
    args: {
        children: 'Loading',
        loading: true,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};

// With icons
export const WithIconLeft: Story = {
    args: {
        children: (
            <>
                <HiPlus className="mr-2 h-4 w-4" />
                Add Item
            </>
        ),
    },
};

export const WithIconRight: Story = {
    args: {
        children: (
            <>
                Save
                <HiCheck className="ml-2 h-4 w-4" />
            </>
        ),
        variant: 'success',
    },
};

// Showcase all variants
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Button variant="default">Default</Button>
                <Button variant="success">Success</Button>
                <Button variant="error">Error</Button>
                <Button variant="neutral">Neutral</Button>
            </div>
        </div>
    ),
};

// Showcase all sizes
export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add">
                <HiPlus className="h-4 w-4" />
            </Button>
        </div>
    ),
};

// Showcase all states
export const AllStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Button>Normal</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
            </div>
        </div>
    ),
};

// Dark mode showcase
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="neutral">Neutral</Button>
                </div>
                <div className="flex gap-4">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                </div>
            </div>
        </div>
    ),
};

// Form examples
export const FormActions: Story = {
    render: () => (
        <div className="flex justify-end gap-2">
            <Button variant="neutral">Cancel</Button>
            <Button variant="success">Save Changes</Button>
        </div>
    ),
};

export const DestructiveAction: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Button variant="error">
                <HiTrash className="mr-2 h-4 w-4" />
                Delete Account
            </Button>
        </div>
    ),
};
