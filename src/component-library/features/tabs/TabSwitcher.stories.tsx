import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { TabSwitcher } from './TabSwitcher';

const meta: Meta<typeof TabSwitcher> = {
    title: 'Features/Tabs/TabSwitcher',
    component: TabSwitcher,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Orientation of the tab layout',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Whether tabs should take full width',
        },
    },
    decorators: [
        Story => (
            <div className="w-[600px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof TabSwitcher>;

// Basic examples
export const Default: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return <TabSwitcher tabNames={['Tab 1', 'Tab 2', 'Tab 3']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
    },
};

export const TwoTabs: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return <TabSwitcher tabNames={['Overview', 'Details']} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
    },
};

export const ManyTabs: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return (
            <TabSwitcher
                tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings', 'Users', 'Data']}
                activeIndex={activeIndex}
                onSwitch={setActiveIndex}
            />
        );
    },
};

// Orientations
export const Horizontal: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return (
            <TabSwitcher tabNames={['Home', 'Profile', 'Settings']} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="horizontal" />
        );
    },
};

export const Vertical: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return (
            <TabSwitcher
                tabNames={['Dashboard', 'Analytics', 'Reports', 'Settings']}
                activeIndex={activeIndex}
                onSwitch={setActiveIndex}
                orientation="vertical"
            />
        );
    },
};

// Width variants
export const FullWidth: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return <TabSwitcher tabNames={['First', 'Second', 'Third']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={true} />;
    },
};

export const FitContent: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return <TabSwitcher tabNames={['Home', 'About', 'Contact']} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />;
    },
};

// Combined orientations and width
export const VerticalFitContent: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return (
            <TabSwitcher
                tabNames={['Profile', 'Settings', 'Preferences']}
                activeIndex={activeIndex}
                onSwitch={setActiveIndex}
                orientation="vertical"
                fullWidth={false}
            />
        );
    },
};

// Real-world examples
export const WithContent: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const tabs = ['Overview', 'Details', 'Statistics'];
        const content = [
            'Overview content: This is the main overview of the resource.',
            'Details content: Here are the detailed specifications and information.',
            'Statistics content: View analytics and statistical data here.',
        ];

        return (
            <div className="space-y-4 w-full">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <p className="text-sm">{content[activeIndex]}</p>
                </div>
            </div>
        );
    },
};

export const DashboardTabs: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const tabs = ['Recent Activity', 'Performance', 'Team Members', 'Projects'];

        return (
            <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                    <h3 className="font-medium mb-2">{tabs[activeIndex]}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content for {tabs[activeIndex].toLowerCase()}</p>
                </div>
            </div>
        );
    },
};

export const SettingsPanel: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const tabs = ['General', 'Security', 'Notifications', 'Privacy'];

        return (
            <div className="flex gap-4 h-64 w-full">
                <div className="w-48">
                    <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} orientation="vertical" />
                </div>
                <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                    <h3 className="font-medium text-lg mb-4">{tabs[activeIndex]} Settings</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Configure your {tabs[activeIndex].toLowerCase()} preferences</p>
                </div>
            </div>
        );
    },
};

export const DataViewModes: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const modes = ['Table', 'Grid', 'List', 'Chart'];

        return (
            <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Data View</h3>
                    <TabSwitcher tabNames={modes} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                    <p className="text-neutral-600 dark:text-neutral-400">{modes[activeIndex]} View</p>
                </div>
            </div>
        );
    },
};

export const ProfileSections: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const sections = ['Posts', 'About', 'Photos', 'Videos', 'Friends'];

        return (
            <div className="space-y-6 w-full">
                <div className="text-center space-y-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="w-20 h-20 bg-brand-600 rounded-full mx-auto" />
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Software Engineer</p>
                </div>
                <TabSwitcher tabNames={sections} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="p-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{sections[activeIndex]} content</p>
                </div>
            </div>
        );
    },
};

// Interactive with state
export const InteractiveCounter: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const [counts, setCounts] = useState([0, 0, 0]);
        const tabs = ['Counter 1', 'Counter 2', 'Counter 3'];

        return (
            <div className="space-y-4 w-full">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center">
                    <p className="text-4xl font-bold mb-4">{counts[activeIndex]}</p>
                    <button
                        onClick={() => {
                            const newCounts = [...counts];
                            newCounts[activeIndex]++;
                            setCounts(newCounts);
                        }}
                        className="px-4 py-2 bg-brand-600 text-neutral-100 rounded"
                    >
                        Increment
                    </button>
                </div>
            </div>
        );
    },
};

// Long tab names
export const LongTabNames: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        return (
            <TabSwitcher
                tabNames={['User Management System', 'Data Analytics Dashboard', 'System Configuration']}
                activeIndex={activeIndex}
                onSwitch={setActiveIndex}
            />
        );
    },
};

// Many tabs scrolling
export const ScrollableTabs: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const tabs = Array.from({ length: 10 }, (_, i) => `Tab ${i + 1}`);
        return (
            <div className="w-full overflow-x-auto">
                <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} fullWidth={false} />
            </div>
        );
    },
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => {
        const [activeIndex1, setActiveIndex1] = useState(0);
        const [activeIndex2, setActiveIndex2] = useState(0);

        return (
            <div className="dark p-8 rounded-lg bg-neutral-900 space-y-8 w-full">
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Horizontal Tabs</p>
                    <TabSwitcher tabNames={['Dashboard', 'Analytics', 'Settings']} activeIndex={activeIndex1} onSwitch={setActiveIndex1} />
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-neutral-400">Vertical Tabs</p>
                    <div className="flex gap-4">
                        <TabSwitcher
                            tabNames={['Profile', 'Security', 'Notifications']}
                            activeIndex={activeIndex2}
                            onSwitch={setActiveIndex2}
                            orientation="vertical"
                            fullWidth={false}
                        />
                        <div className="flex-1 border border-neutral-800 rounded-lg p-4">
                            <p className="text-sm text-neutral-400">Tab content area</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

// All combinations
export const AllCombinations: Story = {
    render: () => {
        const [h1, setH1] = useState(0);
        const [h2, setH2] = useState(0);
        const [v1, setV1] = useState(0);
        const [v2, setV2] = useState(0);

        return (
            <div className="space-y-8 w-full">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Horizontal + Full Width</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={h1} onSwitch={setH1} orientation="horizontal" fullWidth={true} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Horizontal + Fit Content</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={h2} onSwitch={setH2} orientation="horizontal" fullWidth={false} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Vertical + Full Width</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={v1} onSwitch={setV1} orientation="vertical" fullWidth={true} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Vertical + Fit Content</h3>
                    <TabSwitcher tabNames={['One', 'Two', 'Three']} activeIndex={v2} onSwitch={setV2} orientation="vertical" fullWidth={false} />
                </div>
            </div>
        );
    },
};
