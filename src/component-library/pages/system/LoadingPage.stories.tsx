import type { Meta, StoryObj } from '@storybook/react';
import { LoadingPage } from './LoadingPage';

const meta: Meta<typeof LoadingPage> = {
    title: 'Pages/System/LoadingPage',
    component: LoadingPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        message: {
            control: 'text',
            description: 'Loading message to display',
        },
        logoSize: {
            control: { type: 'range', min: 50, max: 300, step: 10 },
            description: 'Size of the Rucio logo',
        },
        spinnerSize: {
            control: 'select',
            options: ['sm', 'default', 'md', 'lg', 'xl'],
            description: 'Size of the loading spinner',
        },
        showOrbitAnimation: {
            control: 'boolean',
            description: 'Whether to show animated orbit effects',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loading page with animated orbit effects
 */
export const Default: Story = {
    args: {
        message: 'Loading Rucio WebUI...',
        logoSize: 146,
        spinnerSize: 'xl',
        showOrbitAnimation: true,
    },
};

/**
 * Loading page with custom message
 */
export const CustomMessage: Story = {
    args: {
        message: 'Loading your data...',
        logoSize: 146,
        spinnerSize: 'xl',
        showOrbitAnimation: true,
    },
};

/**
 * Simple loading without orbit animations
 */
export const WithoutOrbitAnimation: Story = {
    args: {
        message: 'Loading Rucio WebUI...',
        logoSize: 146,
        spinnerSize: 'xl',
        showOrbitAnimation: false,
    },
};

/**
 * Loading page with smaller logo and spinner
 */
export const Compact: Story = {
    args: {
        message: 'Loading...',
        logoSize: 100,
        spinnerSize: 'lg',
        showOrbitAnimation: true,
    },
};

/**
 * Loading page with larger elements and full animations
 */
export const Large: Story = {
    args: {
        message: 'Loading Rucio WebUI...',
        logoSize: 200,
        spinnerSize: 'xl',
        showOrbitAnimation: true,
    },
};

/**
 * Loading page in dark mode with full animations
 */
export const DarkMode: Story = {
    args: {
        message: 'Loading Rucio WebUI...',
        logoSize: 146,
        spinnerSize: 'xl',
        showOrbitAnimation: true,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        Story => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

/**
 * Loading page for specific features
 */
export const FeatureLoading: Story = {
    args: {
        message: 'Loading dashboard...',
        logoSize: 146,
        spinnerSize: 'xl',
        showOrbitAnimation: true,
    },
};

/**
 * Loading page for data operations
 */
export const DataLoading: Story = {
    args: {
        message: 'Fetching datasets...',
        logoSize: 120,
        spinnerSize: 'lg',
        showOrbitAnimation: true,
    },
};

/**
 * Minimal loading state without orbit effects
 */
export const Minimal: Story = {
    args: {
        message: 'Loading...',
        logoSize: 80,
        spinnerSize: 'md',
        showOrbitAnimation: false,
    },
};
