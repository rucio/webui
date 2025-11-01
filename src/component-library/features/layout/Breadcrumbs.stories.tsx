import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { HiFolder, HiDatabase, HiDocument } from 'react-icons/hi';

const meta: Meta<typeof Breadcrumbs> = {
    title: 'Features/Layout/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of breadcrumb text',
        },
        showHomeIcon: {
            control: 'boolean',
            description: 'Show home icon at start',
        },
        maxItems: {
            control: 'number',
            description: 'Maximum items to show before collapsing',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// Basic examples
export const TwoLevels: Story = {
    args: {
        items: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Current Page' },
        ],
    },
};

export const ThreeLevels: Story = {
    args: {
        items: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'Dataset Details' },
        ],
    },
};

export const FourLevels: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Project Alpha', href: '/projects/alpha' },
            { label: 'Settings' },
        ],
    },
};

export const FiveLevels: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'RSEs', href: '/rse' },
            { label: 'CERN', href: '/rse/cern' },
            { label: 'Tape Storage', href: '/rse/cern/tape' },
            { label: 'Configuration' },
        ],
    },
};

// With home icon
export const WithHomeIcon: Story = {
    args: {
        showHomeIcon: true,
        items: [
            { label: 'Datasets', href: '/datasets' },
            { label: 'Physics', href: '/datasets/physics' },
            { label: 'ATLAS Data' },
        ],
    },
};

export const WithHomeIconAndManyLevels: Story = {
    args: {
        showHomeIcon: true,
        items: [
            { label: 'DIDs', href: '/did' },
            { label: 'List', href: '/did/list' },
            { label: 'Physics', href: '/did/list/physics' },
            { label: 'ATLAS', href: '/did/list/physics/atlas' },
            { label: 'Dataset Details' },
        ],
    },
};

// Size variants
export const Small: Story = {
    args: {
        size: 'sm',
        items: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'Details' },
        ],
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        items: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'Details' },
        ],
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        items: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'Details' },
        ],
    },
};

// With icons
export const WithIcons: Story = {
    args: {
        items: [
            { label: 'Datasets', href: '/datasets', icon: <HiDatabase className="h-4 w-4" /> },
            { label: 'Physics', href: '/datasets/physics', icon: <HiFolder className="h-4 w-4" /> },
            { label: 'Data File', icon: <HiDocument className="h-4 w-4" /> },
        ],
    },
};

// Collapsed breadcrumbs
export const Collapsed: Story = {
    args: {
        maxItems: 4,
        items: [
            { label: 'Home', href: '/' },
            { label: 'Level 1', href: '/level1' },
            { label: 'Level 2', href: '/level2' },
            { label: 'Level 3', href: '/level3' },
            { label: 'Level 4', href: '/level4' },
            { label: 'Level 5', href: '/level5' },
            { label: 'Current Page' },
        ],
    },
};

export const CollapsedWithHomeIcon: Story = {
    args: {
        showHomeIcon: true,
        maxItems: 3,
        items: [
            { label: 'Projects', href: '/projects' },
            { label: 'Alpha', href: '/projects/alpha' },
            { label: 'Beta', href: '/projects/beta' },
            { label: 'Gamma', href: '/projects/gamma' },
            { label: 'Delta', href: '/projects/delta' },
            { label: 'Settings' },
        ],
    },
};

// Real-world examples
export const DatasetPath: Story = {
    render: () => (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs
                items={[
                    { label: 'DIDs', href: '/did/list' },
                    { label: 'user.jdoe', href: '/did/list/user.jdoe' },
                    { label: 'dataset.physics.2024', href: '/did/list/user.jdoe/dataset.physics.2024' },
                    { label: 'Details' },
                ]}
            />
        </div>
    ),
};

export const RSENavigation: Story = {
    render: () => (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs
                showHomeIcon
                items={[
                    { label: 'RSEs', href: '/rse/list' },
                    { label: 'CERN-PROD', href: '/rse/CERN-PROD' },
                    { label: 'Configuration' },
                ]}
            />
        </div>
    ),
};

export const RuleCreation: Story = {
    render: () => (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs
                items={[
                    { label: 'Rules', href: '/rule/list' },
                    { label: 'Create Rule', href: '/rule/create' },
                    { label: 'Select DIDs' },
                ]}
            />
        </div>
    ),
};

export const DeepHierarchy: Story = {
    render: () => (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <Breadcrumbs
                maxItems={5}
                items={[
                    { label: 'Data', href: '/data' },
                    { label: '2024', href: '/data/2024' },
                    { label: 'Physics', href: '/data/2024/physics' },
                    { label: 'ATLAS', href: '/data/2024/physics/atlas' },
                    { label: 'Simulation', href: '/data/2024/physics/atlas/simulation' },
                    { label: 'Run 42', href: '/data/2024/physics/atlas/simulation/run42' },
                    { label: 'Event 1337' },
                ]}
            />
        </div>
    ),
};

// Interactive example
export const Interactive: Story = {
    render: () => {
        const [currentPath, setCurrentPath] = React.useState(['Home', 'Projects', 'Alpha']);

        const items = currentPath.map((label, index) => ({
            label,
            href: index < currentPath.length - 1 ? `/${currentPath.slice(1, index + 1).join('/')}` : undefined,
        }));

        const addLevel = () => {
            const newLevels = ['Beta', 'Gamma', 'Delta', 'Epsilon'];
            const nextLevel = newLevels[currentPath.length - 3] || 'New Level';
            setCurrentPath([...currentPath, nextLevel]);
        };

        const removeLevel = () => {
            if (currentPath.length > 2) {
                setCurrentPath(currentPath.slice(0, -1));
            }
        };

        return (
            <div className="space-y-6">
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <Breadcrumbs items={items} />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={addLevel}
                        className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
                    >
                        Add Level
                    </button>
                    <button
                        onClick={removeLevel}
                        disabled={currentPath.length <= 2}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Remove Level
                    </button>
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Current path: {currentPath.join(' / ')}
                </div>
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
        <div className="dark bg-neutral-900 p-8">
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-neutral-400 mb-2">Default</p>
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Projects', href: '/projects' },
                            { label: 'Alpha' },
                        ]}
                    />
                </div>

                <div>
                    <p className="text-sm text-neutral-400 mb-2">With Home Icon</p>
                    <Breadcrumbs
                        showHomeIcon
                        items={[
                            { label: 'Datasets', href: '/datasets' },
                            { label: 'Physics', href: '/datasets/physics' },
                            { label: 'ATLAS Data' },
                        ]}
                    />
                </div>

                <div>
                    <p className="text-sm text-neutral-400 mb-2">With Icons</p>
                    <Breadcrumbs
                        items={[
                            { label: 'Data', href: '/data', icon: <HiDatabase className="h-4 w-4" /> },
                            { label: 'Physics', href: '/data/physics', icon: <HiFolder className="h-4 w-4" /> },
                            { label: 'File.dat', icon: <HiDocument className="h-4 w-4" /> },
                        ]}
                    />
                </div>
            </div>
        </div>
    ),
};

// Truncation on mobile
export const LongLabels: Story = {
    render: () => (
        <div className="max-w-sm p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Resize viewport to see how long labels handle mobile widths
            </p>
            <Breadcrumbs
                items={[
                    { label: 'Very Long Dashboard Name', href: '/dashboard' },
                    { label: 'Extended Datasets Collection', href: '/datasets' },
                    { label: 'Extremely Long Dataset Details Page Title' },
                ]}
            />
        </div>
    ),
};

// All sizes comparison
export const AllSizes: Story = {
    render: () => (
        <div className="space-y-6">
            {(['sm', 'md', 'lg'] as const).map(size => (
                <div key={size} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 uppercase">{size}</p>
                    <Breadcrumbs
                        size={size}
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Projects', href: '/projects' },
                            { label: 'Alpha' },
                        ]}
                    />
                </div>
            ))}
        </div>
    ),
};

// Custom separator
export const CustomSeparator: Story = {
    args: {
        separator: <span className="text-neutral-400 mx-1">/</span>,
        items: [
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Alpha' },
        ],
    },
};

export const ArrowSeparator: Story = {
    args: {
        separator: <span className="text-neutral-400 mx-1">→</span>,
        items: [
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Alpha' },
        ],
    },
};

// Accessibility example
export const WithARIA: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Projects', href: '/projects' },
                        { label: 'Alpha' },
                    ]}
                    aria-label="Main navigation breadcrumb"
                />
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p>Accessibility features:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Uses semantic &lt;nav&gt; and &lt;ol&gt; elements</li>
                    <li>aria-label="Breadcrumb" on nav element</li>
                    <li>aria-current="page" on current page</li>
                    <li>aria-hidden="true" on decorative separators</li>
                    <li>Keyboard navigable links</li>
                </ul>
            </div>
        </div>
    ),
};
