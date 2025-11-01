import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input, Textarea } from './input';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Form/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'error'],
            description: 'Visual style variant of the input',
        },
        error: {
            control: 'boolean',
            description: 'Shows error state styling',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the input',
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'date', 'tel', 'url', 'search'],
            description: 'HTML input type',
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
type Story = StoryObj<typeof Input>;

// Basic inputs
export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithValue: Story = {
    args: {
        defaultValue: 'Sample text',
    },
};

export const WithLabel: Story = {
    render: () => (
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email" type="email" placeholder="you@example.com" />
        </div>
    ),
};

// Input types
export const TextInput: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text...',
    },
};

export const EmailInput: Story = {
    args: {
        type: 'email',
        placeholder: 'you@example.com',
    },
};

export const PasswordInput: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password...',
    },
};

export const NumberInput: Story = {
    args: {
        type: 'number',
        placeholder: '0',
    },
};

export const DateInput: Story = {
    args: {
        type: 'date',
    },
};

export const SearchInput: Story = {
    args: {
        type: 'search',
        placeholder: 'Search...',
    },
};

export const TelephoneInput: Story = {
    args: {
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
    },
};

export const URLInput: Story = {
    args: {
        type: 'url',
        placeholder: 'https://example.com',
    },
};

// States
export const ErrorState: Story = {
    render: () => (
        <div>
            <label htmlFor="email-error" className="block text-sm font-medium mb-2">
                Email Address
            </label>
            <Input id="email-error" type="email" error placeholder="you@example.com" defaultValue="invalid-email" />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Please enter a valid email address.</p>
        </div>
    ),
};

export const DisabledState: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled input...',
    },
};

export const ReadOnlyState: Story = {
    args: {
        readOnly: true,
        defaultValue: 'Read-only value',
    },
};

// Form example
export const LoginForm: Story = {
    render: () => (
        <form className="space-y-4">
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <Input id="login-email" type="email" placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <Input id="login-password" type="password" placeholder="Enter password" />
            </div>
        </form>
    ),
};

// Validation example
export const WithValidation: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="valid-input" className="block text-sm font-medium mb-2">
                    Valid Input
                </label>
                <Input id="valid-input" defaultValue="valid@email.com" />
                <p className="mt-2 text-sm text-base-success-600 dark:text-base-success-500">Email is valid!</p>
            </div>
            <div>
                <label htmlFor="invalid-input" className="block text-sm font-medium mb-2">
                    Invalid Input
                </label>
                <Input id="invalid-input" error defaultValue="invalid-email" />
                <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Please enter a valid email.</p>
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
        <div className="dark p-8 rounded-lg bg-neutral-900 space-y-4">
            <div>
                <label htmlFor="dark-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <Input id="dark-email" type="email" placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="dark-error" className="block text-sm font-medium mb-2">
                    Email (Error)
                </label>
                <Input id="dark-error" type="email" error placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="dark-disabled" className="block text-sm font-medium mb-2">
                    Disabled
                </label>
                <Input id="dark-disabled" disabled placeholder="Disabled input" />
            </div>
        </div>
    ),
};

// Textarea stories
export const TextareaDefault: Story = {
    render: () => <Textarea placeholder="Enter your message..." />,
};

export const TextareaWithLabel: Story = {
    render: () => (
        <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message" placeholder="Enter your message..." />
        </div>
    ),
};

export const TextareaError: Story = {
    render: () => (
        <div>
            <label htmlFor="message-error" className="block text-sm font-medium mb-2">
                Message
            </label>
            <Textarea id="message-error" error placeholder="Enter your message..." />
            <p className="mt-2 text-sm text-base-error-600 dark:text-base-error-500">Message is required.</p>
        </div>
    ),
};

export const TextareaDisabled: Story = {
    render: () => <Textarea disabled placeholder="Disabled textarea..." />,
};

// All types showcase
export const AllInputTypes: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="input-text" className="block text-sm font-medium mb-2">Text</label>
                <Input id="input-text" type="text" placeholder="Text input" />
            </div>
            <div>
                <label htmlFor="input-email" className="block text-sm font-medium mb-2">Email</label>
                <Input id="input-email" type="email" placeholder="Email input" />
            </div>
            <div>
                <label htmlFor="input-password" className="block text-sm font-medium mb-2">Password</label>
                <Input id="input-password" type="password" placeholder="Password input" />
            </div>
            <div>
                <label htmlFor="input-number" className="block text-sm font-medium mb-2">Number</label>
                <Input id="input-number" type="number" placeholder="Number input" />
            </div>
            <div>
                <label htmlFor="input-date" className="block text-sm font-medium mb-2">Date</label>
                <Input id="input-date" type="date" />
            </div>
            <div>
                <label htmlFor="input-search" className="block text-sm font-medium mb-2">Search</label>
                <Input id="input-search" type="search" placeholder="Search input" />
            </div>
        </div>
    ),
};
