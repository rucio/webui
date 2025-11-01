import type { Meta, StoryObj } from '@storybook/nextjs';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'Atoms/Loading/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        animation: {
            control: 'select',
            options: ['pulse', 'none'],
            description: 'Animation type for the skeleton',
        },
        shape: {
            control: 'select',
            options: ['rectangle', 'circle', 'text'],
            description: 'Shape of the skeleton',
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
type Story = StoryObj<typeof Skeleton>;

// Basic skeleton
export const Default: Story = {
    args: {
        className: 'h-12 w-full',
    },
};

// Shapes
export const Rectangle: Story = {
    args: {
        shape: 'rectangle',
        className: 'h-12 w-full',
    },
};

export const Circle: Story = {
    args: {
        shape: 'circle',
        className: 'h-12 w-12',
    },
};

export const Text: Story = {
    args: {
        shape: 'text',
        className: 'h-4 w-full',
    },
};

// Animations
export const WithPulse: Story = {
    args: {
        animation: 'pulse',
        className: 'h-12 w-full',
    },
};

export const WithoutAnimation: Story = {
    args: {
        animation: 'none',
        className: 'h-12 w-full',
    },
};

// Avatar skeleton
export const Avatar: Story = {
    render: () => <Skeleton shape="circle" className="h-12 w-12" />,
};

export const AvatarLarge: Story = {
    render: () => <Skeleton shape="circle" className="h-24 w-24" />,
};

// Text skeletons
export const TextLine: Story = {
    render: () => <Skeleton shape="text" className="h-4 w-full" />,
};

export const TextParagraph: Story = {
    render: () => (
        <div className="space-y-2">
            <Skeleton shape="text" className="h-4 w-full" />
            <Skeleton shape="text" className="h-4 w-full" />
            <Skeleton shape="text" className="h-4 w-3/4" />
        </div>
    ),
};

export const TextHeading: Story = {
    render: () => <Skeleton shape="text" className="h-8 w-3/4" />,
};

// Card skeleton
export const CardSkeleton: Story = {
    render: () => (
        <div className="space-y-4 p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full">
            <Skeleton shape="text" className="h-8 w-3/4" />
            <Skeleton shape="text" className="h-4 w-full" />
            <Skeleton shape="text" className="h-4 w-5/6" />
            <Skeleton shape="text" className="h-4 w-4/5" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </div>
        </div>
    ),
};

// List item skeleton
export const ListItem: Story = {
    render: () => (
        <div className="flex items-center gap-4 w-full">
            <Skeleton shape="circle" className="h-12 w-12" />
            <div className="flex-1 space-y-2">
                <Skeleton shape="text" className="h-4 w-3/4" />
                <Skeleton shape="text" className="h-3 w-1/2" />
            </div>
        </div>
    ),
};

export const ListItems: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton shape="circle" className="h-12 w-12" />
                    <div className="flex-1 space-y-2">
                        <Skeleton shape="text" className="h-4 w-3/4" />
                        <Skeleton shape="text" className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    ),
};

// Table skeleton
export const TableRow: Story = {
    render: () => (
        <div className="flex gap-4 w-full">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-1/4" />
        </div>
    ),
};

export const Table: Story = {
    render: () => (
        <div className="space-y-2 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                </div>
            ))}
        </div>
    ),
};

// Image skeleton
export const Image: Story = {
    render: () => <Skeleton className="h-48 w-full" />,
};

export const ImageThumbnail: Story = {
    render: () => <Skeleton className="h-24 w-24" />,
};

// Dashboard card skeleton
export const DashboardCard: Story = {
    render: () => (
        <div className="space-y-4 p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full">
            <div className="flex items-center justify-between">
                <Skeleton shape="text" className="h-6 w-32" />
                <Skeleton shape="circle" className="h-8 w-8" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <Skeleton shape="text" className="h-3 w-16" />
                    <Skeleton shape="text" className="h-6 w-20" />
                </div>
                <div className="flex-1 space-y-2">
                    <Skeleton shape="text" className="h-3 w-16" />
                    <Skeleton shape="text" className="h-6 w-20" />
                </div>
            </div>
        </div>
    ),
};

// Form skeleton
export const FormField: Story = {
    render: () => (
        <div className="space-y-2 w-full">
            <Skeleton shape="text" className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
        </div>
    ),
};

export const Form: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                    <Skeleton shape="text" className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <Skeleton className="h-10 w-32 rounded-full" />
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4 w-full">
            <Skeleton shape="text" className="h-8 w-3/4" />
            <Skeleton shape="text" className="h-4 w-full" />
            <Skeleton shape="text" className="h-4 w-5/6" />
            <div className="flex gap-4 mt-4">
                <Skeleton shape="circle" className="h-12 w-12" />
                <Skeleton shape="circle" className="h-12 w-12" />
                <Skeleton shape="circle" className="h-12 w-12" />
            </div>
        </div>
    ),
};

// Sizes showcase
export const Sizes: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Small (h-4)</p>
                <Skeleton className="h-4 w-full" />
            </div>
            <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Medium (h-8)</p>
                <Skeleton className="h-8 w-full" />
            </div>
            <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Large (h-12)</p>
                <Skeleton className="h-12 w-full" />
            </div>
            <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Extra Large (h-24)</p>
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    ),
};

// All shapes showcase
export const AllShapes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Rectangle</p>
                <Skeleton shape="rectangle" className="h-12 w-24" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Circle</p>
                <Skeleton shape="circle" className="h-12 w-12" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Text</p>
                <Skeleton shape="text" className="h-4 w-24" />
            </div>
        </div>
    ),
};
