import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Atoms/Form/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        checked: {
            control: 'select',
            options: [true, false, 'indeterminate'],
            description: 'The checked state of the checkbox',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the checkbox is disabled',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Basic states
export const Unchecked: Story = {
    args: {
        checked: false,
    },
};

export const Checked: Story = {
    args: {
        checked: true,
    },
};

export const Indeterminate: Story = {
    args: {
        checked: 'indeterminate',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        checked: false,
    },
};

export const DisabledChecked: Story = {
    args: {
        disabled: true,
        checked: true,
    },
};

// With labels
export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                Accept terms and conditions
            </label>
        </div>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <div className="flex items-start gap-2">
            <Checkbox id="marketing" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                    Marketing emails
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Receive emails about new products and features.</p>
            </div>
        </div>
    ),
};

// Interactive example
export const Interactive: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);

        return (
            <div className="flex items-center gap-2">
                <Checkbox id="interactive" checked={checked} onCheckedChange={value => setChecked(value === true)} />
                <label htmlFor="interactive" className="text-sm font-medium cursor-pointer">
                    {checked ? 'Checked!' : 'Click me'}
                </label>
            </div>
        );
    },
};

// Indeterminate interactive example
export const IndeterminateInteractive: Story = {
    render: () => {
        const [parentChecked, setParentChecked] = useState<boolean | 'indeterminate'>('indeterminate');
        const [child1Checked, setChild1Checked] = useState(true);
        const [child2Checked, setChild2Checked] = useState(false);
        const [child3Checked, setChild3Checked] = useState(false);

        React.useEffect(() => {
            const allChecked = child1Checked && child2Checked && child3Checked;
            const allUnchecked = !child1Checked && !child2Checked && !child3Checked;

            if (allChecked) {
                setParentChecked(true);
            } else if (allUnchecked) {
                setParentChecked(false);
            } else {
                setParentChecked('indeterminate');
            }
        }, [child1Checked, child2Checked, child3Checked]);

        const handleParentChange = (value: boolean | 'indeterminate') => {
            const newValue = value === true;
            setChild1Checked(newValue);
            setChild2Checked(newValue);
            setChild3Checked(newValue);
        };

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="parent" checked={parentChecked} onCheckedChange={handleParentChange} />
                    <label htmlFor="parent" className="text-sm font-medium cursor-pointer">
                        Select All
                    </label>
                </div>
                <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <Checkbox id="child1" checked={child1Checked} onCheckedChange={value => setChild1Checked(value === true)} />
                        <label htmlFor="child1" className="text-sm cursor-pointer">
                            Option 1
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="child2" checked={child2Checked} onCheckedChange={value => setChild2Checked(value === true)} />
                        <label htmlFor="child2" className="text-sm cursor-pointer">
                            Option 2
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="child3" checked={child3Checked} onCheckedChange={value => setChild3Checked(value === true)} />
                        <label htmlFor="child3" className="text-sm cursor-pointer">
                            Option 3
                        </label>
                    </div>
                </div>
            </div>
        );
    },
};

// Form example
export const InForm: Story = {
    render: () => (
        <form className="space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                    Remember me
                </label>
            </div>
            <div className="flex items-start gap-2">
                <Checkbox id="terms-form" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms-form" className="text-sm font-medium cursor-pointer">
                        I agree to the terms and conditions
                    </label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        By checking this box, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </form>
    ),
};

// All states showcase
export const AllStates: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox checked={false} />
                <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox checked={true} />
                <span className="text-sm">Checked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox checked="indeterminate" />
                <span className="text-sm">Indeterminate</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox disabled checked={false} />
                <span className="text-sm text-neutral-500">Disabled unchecked</span>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox disabled checked={true} />
                <span className="text-sm text-neutral-500">Disabled checked</span>
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
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
                <Checkbox id="dark-unchecked" checked={false} />
                <label htmlFor="dark-unchecked" className="text-sm cursor-pointer">
                    Unchecked
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-checked" checked={true} />
                <label htmlFor="dark-checked" className="text-sm cursor-pointer">
                    Checked
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-indeterminate" checked="indeterminate" />
                <label htmlFor="dark-indeterminate" className="text-sm cursor-pointer">
                    Indeterminate
                </label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="dark-disabled" disabled checked={true} />
                <label htmlFor="dark-disabled" className="text-sm text-neutral-500 cursor-pointer">
                    Disabled
                </label>
            </div>
        </div>
    ),
};
