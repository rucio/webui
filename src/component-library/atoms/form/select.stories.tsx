import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';

const meta: Meta<typeof Select> = {
    title: 'Atoms/Form/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="w-[300px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Select>;

// Basic select
export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
            </SelectContent>
        </Select>
    ),
};

// With label
export const WithLabel: Story = {
    render: () => (
        <div>
            <label htmlFor="fruit-select" className="block text-sm font-medium mb-2">
                Choose a fruit
            </label>
            <Select>
                <SelectTrigger id="fruit-select">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="grape">Grape</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};

// With groups
export const WithGroups: Story = {
    render: () => (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a food" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

// Disabled
export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
        </Select>
    ),
};

// Disabled items
export const DisabledItems: Story = {
    render: () => (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana" disabled>
                    Banana (out of stock)
                </SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape" disabled>
                    Grape (out of stock)
                </SelectItem>
            </SelectContent>
        </Select>
    ),
};

// With default value
export const WithDefaultValue: Story = {
    render: () => (
        <Select defaultValue="orange">
            <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
            </SelectContent>
        </Select>
    ),
};

// Interactive (controlled)
export const Interactive: Story = {
    render: () => {
        const [value, setValue] = useState('');

        return (
            <div className="space-y-4">
                <Select value={value} onValueChange={setValue}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="grape">Grape</SelectItem>
                    </SelectContent>
                </Select>
                {value && <p className="text-sm text-neutral-600 dark:text-neutral-400">You selected: {value}</p>}
            </div>
        );
    },
};

// Long list with scroll
export const LongList: Story = {
    render: () => (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="akst">AKST (Alaska Standard Time)</SelectItem>
                <SelectItem value="hst">HST (Hawaii Standard Time)</SelectItem>
                <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                <SelectItem value="cet">CET (Central European Time)</SelectItem>
                <SelectItem value="eet">EET (Eastern European Time)</SelectItem>
                <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                <SelectItem value="aest">AEST (Australian Eastern Standard Time)</SelectItem>
                <SelectItem value="nzst">NZST (New Zealand Standard Time)</SelectItem>
            </SelectContent>
        </Select>
    ),
};

// Form example
export const InForm: Story = {
    render: () => (
        <form className="space-y-4">
            <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2">
                    Country
                </label>
                <Select>
                    <SelectTrigger id="country">
                        <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label htmlFor="language" className="block text-sm font-medium mb-2">
                    Language
                </label>
                <Select>
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select your language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </form>
    ),
};

// With description
export const WithDescription: Story = {
    render: () => (
        <div>
            <label htmlFor="plan" className="block text-sm font-medium mb-2">
                Subscription Plan
            </label>
            <Select defaultValue="pro">
                <SelectTrigger id="plan">
                    <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="free">Free - $0/month</SelectItem>
                    <SelectItem value="starter">Starter - $9/month</SelectItem>
                    <SelectItem value="pro">Pro - $29/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Custom pricing</SelectItem>
                </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Choose the plan that works best for you</p>
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
            <div>
                <label htmlFor="dark-select" className="block text-sm font-medium mb-2">
                    Select an option
                </label>
                <Select>
                    <SelectTrigger id="dark-select">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="grape">Grape</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label htmlFor="dark-disabled" className="block text-sm font-medium mb-2">
                    Disabled select
                </label>
                <Select disabled>
                    <SelectTrigger id="dark-disabled">
                        <SelectValue placeholder="Disabled" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    ),
};

// Narrow width
export const NarrowWidth: Story = {
    render: () => (
        <div className="w-[150px]">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};

// Full width
export const FullWidth: Story = {
    render: () => (
        <div className="w-full max-w-md">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1 with a very long text that might overflow</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};
