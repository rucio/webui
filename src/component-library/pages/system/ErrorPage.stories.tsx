import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage } from './ErrorPage';

const meta: Meta<typeof ErrorPage> = {
    title: 'Pages/System/ErrorPage',
    component: ErrorPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        heading: {
            control: 'text',
            description: 'Error heading text',
        },
        errorMessage: {
            control: 'text',
            description: 'Error message to display',
        },
        errorDigest: {
            control: 'text',
            description: 'Error digest/ID for tracking',
        },
        onRetry: {
            action: 'retry clicked',
            description: 'Callback when Try Again is clicked',
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
            control: { type: 'range', min: 50, max: 200, step: 10 },
            description: 'Size of the Rucio logo',
        },
        helpText: {
            control: 'text',
            description: 'Help text to display at the bottom',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default error page with standard error message
 */
export const Default: Story = {
    args: {
        heading: 'Something went wrong',
        errorMessage: 'An unexpected error occurred while processing your request.',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
        logoSize: 100,
    },
};

/**
 * Error with error digest/ID
 */
export const WithErrorDigest: Story = {
    args: {
        heading: 'Something went wrong',
        errorMessage: 'Failed to fetch data from the server.',
        errorDigest: 'abc123xyz789',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
    },
};

/**
 * Network error
 */
export const NetworkError: Story = {
    args: {
        heading: 'Network Error',
        errorMessage: 'Unable to connect to the Rucio server. Please check your internet connection.',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/home',
        returnLabel: 'Return to Home',
    },
};

/**
 * Authentication error
 */
export const AuthenticationError: Story = {
    args: {
        heading: 'Authentication Failed',
        errorMessage: 'Your session has expired. Please log in again to continue.',
        returnUrl: '/auth/login',
        returnLabel: 'Go to Login',
    },
};

/**
 * Permission denied error
 */
export const PermissionDenied: Story = {
    args: {
        heading: 'Access Denied',
        errorMessage: "You don't have permission to access this resource.",
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
    },
};

/**
 * Data not found error
 */
export const NotFound: Story = {
    args: {
        heading: 'Data Not Found',
        errorMessage: 'The requested data could not be found. It may have been deleted or moved.',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
    },
};

/**
 * Server error
 */
export const ServerError: Story = {
    args: {
        heading: 'Server Error',
        errorMessage: 'The server encountered an error while processing your request. Please try again later.',
        errorDigest: 'srv-error-500-xyz',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
    },
};

/**
 * Custom help text
 */
export const CustomHelpText: Story = {
    args: {
        heading: 'Something went wrong',
        errorMessage: 'An unexpected error occurred.',
        onRetry: () => console.log('Retry clicked'),
        helpText: 'For assistance, please contact support@rucio.cern.ch or check our status page.',
    },
};

/**
 * Error page in dark mode
 */
export const DarkMode: Story = {
    args: {
        heading: 'Something went wrong',
        errorMessage: 'An unexpected error occurred while processing your request.',
        errorDigest: 'dark-mode-123',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
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
 * Minimal error (no retry button)
 */
export const MinimalError: Story = {
    args: {
        heading: 'Page Unavailable',
        errorMessage: 'This page is currently unavailable.',
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
        helpText: '',
    },
};

/**
 * Error with longer message
 */
export const LongErrorMessage: Story = {
    args: {
        heading: 'Configuration Error',
        errorMessage:
            'The application encountered a configuration error. This might be due to missing environment variables, invalid configuration files, or incompatible settings. Please review your configuration and ensure all required settings are properly defined.',
        errorDigest: 'config-err-001',
        onRetry: () => console.log('Retry clicked'),
        returnUrl: '/dashboard',
        returnLabel: 'Return to Dashboard',
    },
};
