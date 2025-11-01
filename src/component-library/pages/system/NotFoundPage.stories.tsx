import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundPage } from './NotFoundPage';

const meta: Meta<typeof NotFoundPage> = {
    title: 'Pages/System/NotFoundPage',
    component: NotFoundPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        code: {
            control: 'text',
            description: 'The error code to display',
        },
        heading: {
            control: 'text',
            description: 'Heading text below the error code',
        },
        message: {
            control: 'text',
            description: 'Help message to display',
        },
        returnUrl: {
            control: 'text',
            description: 'URL to navigate to when return button is clicked',
        },
        returnLabel: {
            control: 'text',
            description: 'Label for the return button',
        },
        logoSize: {
            control: { type: 'range', min: 50, max: 300, step: 10 },
            description: 'Size of the Rucio logo',
        },
        showAnimatedBackground: {
            control: 'boolean',
            description: 'Whether to show animated background',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default 404 page with animated background
 */
export const Default: Story = {
    args: {
        code: '404',
        heading: 'Page not found',
        message: "The page you're looking for doesn't exist or has been moved.",
        returnUrl: '/',
        returnLabel: 'Return to Home',
        logoSize: 146,
        showAnimatedBackground: true,
    },
};

/**
 * 404 page without animated background
 */
export const WithoutAnimation: Story = {
    args: {
        code: '404',
        heading: 'Page not found',
        message: "The page you're looking for doesn't exist or has been moved.",
        returnUrl: '/',
        returnLabel: 'Return to Home',
        showAnimatedBackground: false,
    },
};

/**
 * Custom 403 Forbidden page
 */
export const Forbidden: Story = {
    args: {
        code: '403',
        heading: 'Access Forbidden',
        message: "You don't have permission to access this resource.",
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
        showAnimatedBackground: true,
    },
};

/**
 * Custom 410 Gone page
 */
export const Gone: Story = {
    args: {
        code: '410',
        heading: 'Resource Gone',
        message: 'This resource is no longer available and has been permanently removed.',
        returnUrl: '/',
        returnLabel: 'Return to Home',
        showAnimatedBackground: true,
    },
};

/**
 * Custom dataset not found page
 */
export const DatasetNotFound: Story = {
    args: {
        code: '404',
        heading: 'Dataset Not Found',
        message: 'The dataset you are looking for could not be found. It may have been deleted or the name is incorrect.',
        returnUrl: '/datasets',
        returnLabel: 'Browse Datasets',
        showAnimatedBackground: true,
    },
};

/**
 * Custom rule not found page
 */
export const RuleNotFound: Story = {
    args: {
        code: '404',
        heading: 'Rule Not Found',
        message: 'The replication rule you are looking for does not exist or has been removed.',
        returnUrl: '/rules',
        returnLabel: 'View All Rules',
        showAnimatedBackground: true,
    },
};

/**
 * Maintenance mode page
 */
export const Maintenance: Story = {
    args: {
        code: '503',
        heading: 'Under Maintenance',
        message: 'The system is currently undergoing maintenance. Please check back later.',
        returnUrl: '/',
        returnLabel: 'Try Again',
        showAnimatedBackground: true,
    },
};

/**
 * Compact version with smaller elements
 */
export const Compact: Story = {
    args: {
        code: '404',
        heading: 'Not Found',
        message: "This page doesn't exist.",
        returnUrl: '/',
        returnLabel: 'Go Back',
        logoSize: 100,
        showAnimatedBackground: false,
    },
};

/**
 * 404 page in dark mode
 */
export const DarkMode: Story = {
    args: {
        code: '404',
        heading: 'Page not found',
        message: "The page you're looking for doesn't exist or has been moved.",
        returnUrl: '/',
        returnLabel: 'Return to Home',
        showAnimatedBackground: true,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

/**
 * Custom message with longer text
 */
export const LongMessage: Story = {
    args: {
        code: '404',
        heading: 'Page not found',
        message:
            "We couldn't find the page you're looking for. This might be because the URL is incorrect, the page has been moved, or it no longer exists. Please check the URL and try again, or use the navigation to find what you're looking for.",
        returnUrl: '/',
        returnLabel: 'Return to Home',
        showAnimatedBackground: true,
    },
};

/**
 * Simple 404 with minimal styling
 */
export const Minimal: Story = {
    args: {
        code: '404',
        heading: 'Not Found',
        message: 'Page does not exist.',
        returnUrl: '/',
        returnLabel: 'Home',
        logoSize: 80,
        showAnimatedBackground: false,
    },
};
