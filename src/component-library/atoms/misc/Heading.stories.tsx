import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heading, CopyableHeading } from './Heading';

const meta: Meta<typeof Heading> = {
    title: 'Atoms/Misc/Heading',
    component: Heading,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the heading',
        },
        text: {
            control: 'text',
            description: 'Text content of the heading',
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
type Story = StoryObj<typeof Heading>;

// Basic sizes
export const Small: Story = {
    args: {
        text: 'Small Heading',
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        text: 'Medium Heading',
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        text: 'Large Heading',
        size: 'lg',
    },
};

// Default (large)
export const Default: Story = {
    args: {
        text: 'Default Heading',
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Small (text-xl)</p>
                <Heading text="Small Heading" size="sm" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium (text-2xl)</p>
                <Heading text="Medium Heading" size="md" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Large (text-4xl)</p>
                <Heading text="Large Heading" size="lg" />
            </div>
        </div>
    ),
};

// Copyable heading
export const Copyable: Story = {
    render: () => <CopyableHeading text="Click to copy this heading" size="md" />,
};

export const CopyableSmall: Story = {
    render: () => <CopyableHeading text="Copy small heading" size="sm" />,
};

export const CopyableLarge: Story = {
    render: () => <CopyableHeading text="Copy large heading" size="lg" />,
};

// All copyable sizes
export const AllCopyableSizes: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Small (click to copy)</p>
                <CopyableHeading text="Small Copyable Heading" size="sm" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium (click to copy)</p>
                <CopyableHeading text="Medium Copyable Heading" size="md" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Large (click to copy)</p>
                <CopyableHeading text="Large Copyable Heading" size="lg" />
            </div>
        </div>
    ),
};

// Real-world examples
export const PageTitle: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <Heading text="Dashboard" size="lg" />
            <p className="text-neutral-600 dark:text-neutral-400">Welcome to your dashboard. Here's an overview of your activity.</p>
        </div>
    ),
};

export const SectionHeading: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <div>
                <Heading text="Recent Activity" size="md" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">View your latest actions and updates</p>
            </div>
            <div>
                <Heading text="Statistics" size="md" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Overview of your performance metrics</p>
            </div>
        </div>
    ),
};

export const CardTitle: Story = {
    render: () => (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <Heading text="Project Status" size="sm" />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Completed:</span>
                    <span className="font-medium">75%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">In Progress:</span>
                    <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Pending:</span>
                    <span className="font-medium">5%</span>
                </div>
            </div>
        </div>
    ),
};

export const ArticleTitle: Story = {
    render: () => (
        <article className="space-y-4 w-full">
            <Heading text="Getting Started with React Hooks" size="lg" />
            <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <p>By John Doe • March 15, 2024 • 5 min read</p>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300">
                React Hooks revolutionized how we write components in React. In this comprehensive guide, we'll explore the most
                commonly used hooks and learn how to leverage them effectively in your applications.
            </p>
        </article>
    ),
};

export const WithCopyableID: Story = {
    render: () => (
        <div className="space-y-4 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Resource ID (click to copy)</p>
                <CopyableHeading text="abc-def-123-456-789" size="sm" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                This is a unique resource identifier. Click the heading to copy it to your clipboard.
            </p>
        </div>
    ),
};

export const Hierarchy: Story = {
    render: () => (
        <div className="space-y-8 w-full">
            <div>
                <Heading text="Main Document Title" size="lg" />
            </div>
            <div className="ml-4 space-y-6">
                <div>
                    <Heading text="Section 1: Introduction" size="md" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        This section introduces the main concepts and provides background information.
                    </p>
                </div>
                <div className="ml-4">
                    <Heading text="1.1 Background" size="sm" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Historical context and motivation.</p>
                </div>
                <div className="ml-4">
                    <Heading text="1.2 Objectives" size="sm" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Goals and expected outcomes.</p>
                </div>
            </div>
        </div>
    ),
};

export const DashboardExample: Story = {
    render: () => (
        <div className="space-y-6 w-full">
            <Heading text="Analytics Dashboard" size="lg" />
            <div className="grid grid-cols-2 gap-4">
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <Heading text="Total Users" size="sm" className="mb-2" />
                    <p className="text-3xl font-bold text-brand-600">1,234</p>
                    <p className="text-xs text-base-success-600 mt-1">+12% from last month</p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <Heading text="Revenue" size="sm" className="mb-2" />
                    <p className="text-3xl font-bold text-brand-600">$45,678</p>
                    <p className="text-xs text-base-success-600 mt-1">+8% from last month</p>
                </div>
            </div>
        </div>
    ),
};

export const LongText: Story = {
    args: {
        text: 'This is a very long heading that might wrap to multiple lines depending on the container width and responsive breakpoints',
        size: 'md',
    },
};

export const ShortText: Story = {
    args: {
        text: 'Hi',
        size: 'lg',
    },
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full">
            <div className="space-y-4">
                <p className="text-sm text-neutral-400">Regular Headings</p>
                <div className="space-y-4">
                    <Heading text="Small Heading" size="sm" />
                    <Heading text="Medium Heading" size="md" />
                    <Heading text="Large Heading" size="lg" />
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-sm text-neutral-400">Copyable Headings (hover to see icon)</p>
                <div className="space-y-4">
                    <CopyableHeading text="Copy Small Heading" size="sm" />
                    <CopyableHeading text="Copy Medium Heading" size="md" />
                    <CopyableHeading text="Copy Large Heading" size="lg" />
                </div>
            </div>
        </div>
    ),
};

// Interactive example
export const Interactive: Story = {
    render: () => {
        return (
            <div className="space-y-6 w-full">
                <div>
                    <Heading text="Interactive Demo" size="lg" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        Try clicking the copyable headings below to copy their text to your clipboard.
                    </p>
                </div>
                <div className="space-y-4">
                    <CopyableHeading text="user-id-12345" size="sm" />
                    <CopyableHeading text="project-alpha-v2.1.0" size="sm" />
                    <CopyableHeading text="dataset-production-2024-03" size="sm" />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Click any heading above to copy it</p>
            </div>
        );
    },
};

// Responsive example
export const ResponsiveHeadings: Story = {
    render: () => (
        <div className="space-y-8 w-full">
            <div>
                <Heading text="Responsive Design" size="lg" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Headings adapt to different screen sizes</p>
            </div>
            <div className="space-y-4">
                <div className="border border-neutral-200 dark:border-neutral-800 rounded p-4">
                    <Heading text="Mobile View (sm)" size="sm" />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded p-4">
                    <Heading text="Tablet View (md)" size="md" />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded p-4">
                    <Heading text="Desktop View (lg)" size="lg" />
                </div>
            </div>
        </div>
    ),
};
