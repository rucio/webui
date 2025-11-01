import type { Meta, StoryObj } from '@storybook/nextjs';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Misc/Divider',
    component: Divider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Orientation of the divider',
        },
        thickness: {
            control: 'select',
            options: ['thin', 'medium', 'thick'],
            description: 'Thickness of the divider line',
        },
        variant: {
            control: 'select',
            options: ['default', 'neutral', 'brand', 'subtle'],
            description: 'Visual variant of the divider',
        },
        spacing: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'xl'],
            description: 'Spacing around the divider',
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
type Story = StoryObj<typeof Divider>;

// Basic horizontal
export const Default: Story = {
    args: {},
};

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
    },
};

// Vertical divider
export const Vertical: Story = {
    render: () => (
        <div className="flex h-32">
            <div className="flex-1 flex items-center justify-center">
                <span>Left</span>
            </div>
            <Divider orientation="vertical" />
            <div className="flex-1 flex items-center justify-center">
                <span>Right</span>
            </div>
        </div>
    ),
};

// Thickness variants
export const Thin: Story = {
    args: {
        thickness: 'thin',
    },
};

export const Medium: Story = {
    args: {
        thickness: 'medium',
    },
};

export const Thick: Story = {
    args: {
        thickness: 'thick',
    },
};

// All thickness showcase
export const AllThickness: Story = {
    render: () => (
        <div className="space-y-8 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Thin</p>
                <Divider thickness="thin" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium</p>
                <Divider thickness="medium" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Thick</p>
                <Divider thickness="thick" />
            </div>
        </div>
    ),
};

// Variant styles
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

export const Brand: Story = {
    args: {
        variant: 'brand',
    },
};

export const Subtle: Story = {
    args: {
        variant: 'subtle',
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Default</p>
                <Divider variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Neutral</p>
                <Divider variant="neutral" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Brand</p>
                <Divider variant="brand" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Subtle</p>
                <Divider variant="subtle" />
            </div>
        </div>
    ),
};

// Spacing variants
export const NoSpacing: Story = {
    render: () => (
        <div>
            <p className="text-sm">Content above</p>
            <Divider spacing="none" />
            <p className="text-sm">Content below</p>
        </div>
    ),
};

export const SmallSpacing: Story = {
    render: () => (
        <div>
            <p className="text-sm">Content above</p>
            <Divider spacing="sm" />
            <p className="text-sm">Content below</p>
        </div>
    ),
};

export const MediumSpacing: Story = {
    render: () => (
        <div>
            <p className="text-sm">Content above</p>
            <Divider spacing="md" />
            <p className="text-sm">Content below</p>
        </div>
    ),
};

export const LargeSpacing: Story = {
    render: () => (
        <div>
            <p className="text-sm">Content above</p>
            <Divider spacing="lg" />
            <p className="text-sm">Content below</p>
        </div>
    ),
};

export const ExtraLargeSpacing: Story = {
    render: () => (
        <div>
            <p className="text-sm">Content above</p>
            <Divider spacing="xl" />
            <p className="text-sm">Content below</p>
        </div>
    ),
};

// All spacing showcase
export const AllSpacing: Story = {
    render: () => (
        <div className="w-full">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">None</p>
            <Divider spacing="none" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Small (my-2)</p>
            <Divider spacing="sm" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium (my-4)</p>
            <Divider spacing="md" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Large (my-6)</p>
            <Divider spacing="lg" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Extra Large (my-8)</p>
            <Divider spacing="xl" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">End</p>
        </div>
    ),
};

// Real-world examples
export const ContentSections: Story = {
    render: () => (
        <div className="w-full space-y-4">
            <div>
                <h2 className="text-xl font-bold mb-2">Section 1</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                </p>
            </div>
            <Divider />
            <div>
                <h2 className="text-xl font-bold mb-2">Section 2</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
            <Divider />
            <div>
                <h2 className="text-xl font-bold mb-2">Section 3</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
            </div>
        </div>
    ),
};

export const ListItems: Story = {
    render: () => (
        <div className="w-full">
            <div className="py-3">
                <h3 className="font-medium">Item 1</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Description for item 1</p>
            </div>
            <Divider spacing="none" variant="subtle" />
            <div className="py-3">
                <h3 className="font-medium">Item 2</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Description for item 2</p>
            </div>
            <Divider spacing="none" variant="subtle" />
            <div className="py-3">
                <h3 className="font-medium">Item 3</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Description for item 3</p>
            </div>
        </div>
    ),
};

export const Navigation: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <button className="text-sm hover:text-brand-600">Home</button>
            <Divider orientation="vertical" spacing="none" className="h-4" />
            <button className="text-sm hover:text-brand-600">About</button>
            <Divider orientation="vertical" spacing="none" className="h-4" />
            <button className="text-sm hover:text-brand-600">Products</button>
            <Divider orientation="vertical" spacing="none" className="h-4" />
            <button className="text-sm hover:text-brand-600">Contact</button>
        </div>
    ),
};

export const Card: Story = {
    render: () => (
        <div className="w-full max-w-md border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-bold">Card Title</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Card subtitle or description</p>
            </div>
            <Divider spacing="none" />
            <div className="p-4">
                <p className="text-sm">Main content area with detailed information about the card.</p>
            </div>
            <Divider spacing="none" />
            <div className="p-4 flex gap-2">
                <button className="px-4 py-2 bg-brand-600 text-neutral-100 rounded text-sm">Action</button>
                <button className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded text-sm">Cancel</button>
            </div>
        </div>
    ),
};

export const Sidebar: Story = {
    render: () => (
        <div className="flex h-64 w-full border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="w-48 p-4 bg-neutral-50 dark:bg-neutral-900">
                <h3 className="font-medium mb-4">Menu</h3>
                <ul className="space-y-2 text-sm">
                    <li>Dashboard</li>
                    <li>Analytics</li>
                    <li>Reports</li>
                    <li>Settings</li>
                </ul>
            </div>
            <Divider orientation="vertical" spacing="none" />
            <div className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-2">Main Content</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Content area separated by vertical divider</p>
            </div>
        </div>
    ),
};

export const Timeline: Story = {
    render: () => (
        <div className="w-full space-y-4">
            <div className="flex gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 w-24">10:00 AM</div>
                <div className="flex-1">
                    <h3 className="font-medium">Meeting with team</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Discuss project progress</p>
                </div>
            </div>
            <Divider variant="subtle" spacing="sm" />
            <div className="flex gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 w-24">2:00 PM</div>
                <div className="flex-1">
                    <h3 className="font-medium">Code review</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Review pull requests</p>
                </div>
            </div>
            <Divider variant="subtle" spacing="sm" />
            <div className="flex gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 w-24">4:00 PM</div>
                <div className="flex-1">
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Update project docs</p>
                </div>
            </div>
        </div>
    ),
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full">
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Default</p>
                <Divider variant="default" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Neutral</p>
                <Divider variant="neutral" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Brand</p>
                <Divider variant="brand" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Subtle</p>
                <Divider variant="subtle" />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-neutral-400">Vertical</p>
                <div className="flex h-24">
                    <div className="flex-1 flex items-center justify-center text-neutral-400">Left</div>
                    <Divider orientation="vertical" />
                    <div className="flex-1 flex items-center justify-center text-neutral-400">Right</div>
                </div>
            </div>
        </div>
    ),
};

// Combined examples
export const AllOrientations: Story = {
    render: () => (
        <div className="space-y-8 w-full">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Horizontal</h3>
                <Divider orientation="horizontal" />
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Vertical</h3>
                <div className="flex h-32">
                    <div className="flex-1 flex items-center justify-center">Content A</div>
                    <Divider orientation="vertical" />
                    <div className="flex-1 flex items-center justify-center">Content B</div>
                </div>
            </div>
        </div>
    ),
};
