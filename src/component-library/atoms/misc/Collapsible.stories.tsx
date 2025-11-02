import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
    title: 'Atoms/Misc/Collapsible',
    component: Collapsible,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="w-[600px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

// Basic examples
export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        This is the collapsible content. It can contain any elements you need.
                    </p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const OpenByDefault: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>Click to collapse</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">This collapsible starts in an open state.</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

// Variants
export const DefaultVariant: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger variant="default">Default variant</CollapsibleTrigger>
                <CollapsibleContent variant="default">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with default styling</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const GhostVariant: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger variant="ghost">Ghost variant</CollapsibleTrigger>
                <CollapsibleContent variant="ghost">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with ghost styling (no border)</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const OutlineVariant: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger variant="outline">Outline variant</CollapsibleTrigger>
                <CollapsibleContent variant="outline">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with outline styling</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

// All variants showcase
export const AllVariants: Story = {
    render: () => {
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [open3, setOpen3] = useState(false);

        return (
            <div className="space-y-4 w-full">
                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger variant="default">Default Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="default">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Default variant content with background and border</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger variant="ghost">Ghost Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="ghost">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ghost variant content without borders</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open3} onOpenChange={setOpen3}>
                    <CollapsibleTrigger variant="outline">Outline Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Outline variant content with border only</p>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
};

// Sizes
export const Small: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger size="sm">Small size</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with small trigger</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const Medium: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger size="md">Medium size</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with medium trigger</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const Large: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger size="lg">Large size</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content with large trigger</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

// All sizes showcase
export const AllSizes: Story = {
    render: () => {
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [open3, setOpen3] = useState(false);

        return (
            <div className="space-y-4 w-full">
                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger size="sm">Small Size</CollapsibleTrigger>
                    <CollapsibleContent>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Small trigger size</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger size="md">Medium Size (Default)</CollapsibleTrigger>
                    <CollapsibleContent>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Medium trigger size</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open3} onOpenChange={setOpen3}>
                    <CollapsibleTrigger size="lg">Large Size</CollapsibleTrigger>
                    <CollapsibleContent>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Large trigger size</p>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
};

// Without icon
export const WithoutIcon: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger showIcon={false}>No chevron icon</CollapsibleTrigger>
                <CollapsibleContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Content without chevron indicator</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

// Real-world examples
export const FAQ: Story = {
    render: () => {
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [open3, setOpen3] = useState(false);

        return (
            <div className="space-y-2 w-full">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger variant="outline">What is Rucio?</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Rucio is a software framework that provides scientific collaborations with the functionality to organize, manage, and
                            access their data at scale.
                        </p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger variant="outline">How do I get started?</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            You can get started by following our installation guide and exploring the documentation. We recommend starting with the
                            quickstart tutorial.
                        </p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open3} onOpenChange={setOpen3}>
                    <CollapsibleTrigger variant="outline">Is it free to use?</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Yes, Rucio is open source and free to use under the Apache License 2.0.
                        </p>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
};

export const Settings: Story = {
    render: () => {
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);

        return (
            <div className="space-y-4 w-full">
                <h2 className="text-xl font-bold mb-2">Settings</h2>

                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger>Notification Preferences</CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked />
                                Email notifications
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" />
                                Push notifications
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked />
                                SMS notifications
                            </label>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger>Privacy Settings</CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked />
                                Make profile public
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" />
                                Allow search engines to index
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked />
                                Show activity status
                            </label>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
};

export const NestedContent: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Performance</h4>
                            <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                                <li>Enable caching</li>
                                <li>Optimize images</li>
                                <li>Lazy load components</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Security</h4>
                            <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                                <li>Two-factor authentication</li>
                                <li>Session timeout</li>
                                <li>IP whitelist</li>
                            </ul>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const WithRichContent: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>View Details</CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-brand-600 rounded-full" />
                            <div>
                                <p className="font-medium">John Doe</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Software Engineer</p>
                            </div>
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            <p>Email: john.doe@example.com</p>
                            <p>Phone: +1 234 567 8900</p>
                            <p>Location: San Francisco, CA</p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const MultipleCollapsibles: Story = {
    render: () => {
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [open3, setOpen3] = useState(false);
        const [open4, setOpen4] = useState(false);

        return (
            <div className="space-y-2 w-full">
                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger variant="outline">Section 1: Introduction</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Introduction content goes here...</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger variant="outline">Section 2: Getting Started</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Getting started content goes here...</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open3} onOpenChange={setOpen3}>
                    <CollapsibleTrigger variant="outline">Section 3: Advanced Topics</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Advanced topics content goes here...</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open4} onOpenChange={setOpen4}>
                    <CollapsibleTrigger variant="outline">Section 4: Conclusion</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Conclusion content goes here...</p>
                    </CollapsibleContent>
                </Collapsible>
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
        const [open1, setOpen1] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [open3, setOpen3] = useState(false);

        return (
            <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4 w-full">
                <Collapsible open={open1} onOpenChange={setOpen1}>
                    <CollapsibleTrigger variant="default">Default Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="default">
                        <p className="text-sm text-neutral-400">Content in dark mode with default styling</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open2} onOpenChange={setOpen2}>
                    <CollapsibleTrigger variant="ghost">Ghost Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="ghost">
                        <p className="text-sm text-neutral-400">Content in dark mode with ghost styling</p>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={open3} onOpenChange={setOpen3}>
                    <CollapsibleTrigger variant="outline">Outline Variant</CollapsibleTrigger>
                    <CollapsibleContent variant="outline">
                        <p className="text-sm text-neutral-400">Content in dark mode with outline styling</p>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
};

// Interactive
export const Interactive: Story = {
    render: () => {
        const [openItems, setOpenItems] = useState<number[]>([]);

        const toggleItem = (index: number) => {
            setOpenItems(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
        };

        const items = ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'];

        return (
            <div className="space-y-4 w-full">
                <div className="flex gap-2 mb-4">
                    <button onClick={() => setOpenItems(items.map((_, i) => i))} className="px-3 py-1 text-sm bg-brand-600 text-white rounded">
                        Expand All
                    </button>
                    <button onClick={() => setOpenItems([])} className="px-3 py-1 text-sm bg-neutral-200 dark:bg-neutral-800 rounded">
                        Collapse All
                    </button>
                </div>

                {items.map((item, index) => (
                    <Collapsible key={item} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                        <CollapsibleTrigger variant="outline">{item}</CollapsibleTrigger>
                        <CollapsibleContent variant="outline">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Content for {item}</p>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        );
    },
};
