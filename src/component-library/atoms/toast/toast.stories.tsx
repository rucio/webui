import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect } from 'react';
import { Toaster } from './Toaster';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { Button } from '../form/button';

const meta: Meta<typeof Toaster> = {
    title: 'Atoms/Toast/Toast',
    component: Toaster,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[600px] min-h-[400px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

// Helper component for triggering toasts
const ToastTrigger = ({
    title,
    description,
    variant,
    action,
}: {
    title: string;
    description?: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
    action?: React.ReactElement;
}) => {
    const { toast } = useToast();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Button
                onClick={() => {
                    toast({
                        title,
                        description,
                        variant,
                        action,
                    });
                }}
            >
                Show Toast
            </Button>
            <Toaster />
        </div>
    );
};

// Basic variants
export const Info: Story = {
    render: () => <ToastTrigger title="Information" description="This is an informational message." variant="info" />,
};

export const Success: Story = {
    render: () => <ToastTrigger title="Success!" description="Your changes have been saved successfully." variant="success" />,
};

export const Warning: Story = {
    render: () => <ToastTrigger title="Warning" description="This action may have unintended consequences." variant="warning" />,
};

export const Error: Story = {
    render: () => <ToastTrigger title="Error" description="Something went wrong. Please try again." variant="error" />,
};

// All variants showcase
export const AllVariants: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={() => {
                            toast({
                                title: 'Information',
                                description: 'This is an informational message.',
                                variant: 'info',
                            });
                        }}
                    >
                        Info Toast
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            toast({
                                title: 'Success!',
                                description: 'Your changes have been saved.',
                                variant: 'success',
                            });
                        }}
                    >
                        Success Toast
                    </Button>
                    <Button
                        onClick={() => {
                            toast({
                                title: 'Warning',
                                description: 'Please proceed with caution.',
                                variant: 'warning',
                            });
                        }}
                    >
                        Warning Toast
                    </Button>
                    <Button
                        variant="error"
                        onClick={() => {
                            toast({
                                title: 'Error',
                                description: 'Something went wrong.',
                                variant: 'error',
                            });
                        }}
                    >
                        Error Toast
                    </Button>
                </div>
                <Toaster />
            </div>
        );
    },
};

// Without description
export const TitleOnly: Story = {
    render: () => <ToastTrigger title="Quick notification" variant="info" />,
};

export const SuccessNoDescription: Story = {
    render: () => <ToastTrigger title="Saved!" variant="success" />,
};

// With action button
export const WithAction: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    onClick={() => {
                        toast({
                            title: 'File deleted',
                            description: 'Your file has been moved to trash.',
                            variant: 'warning',
                            action: (
                                <Button
                                    size="sm"
                                    variant="neutral"
                                    onClick={() => {
                                        console.log('Undo clicked');
                                    }}
                                >
                                    Undo
                                </Button>
                            ),
                        });
                    }}
                >
                    Delete File
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const SuccessWithAction: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="success"
                    onClick={() => {
                        toast({
                            title: 'Profile updated',
                            description: 'Your profile changes have been saved.',
                            variant: 'success',
                            action: (
                                <Button size="sm" variant="neutral" onClick={() => console.log('View profile')}>
                                    View
                                </Button>
                            ),
                        });
                    }}
                >
                    Update Profile
                </Button>
                <Toaster />
            </div>
        );
    },
};

// Long content
export const LongContent: Story = {
    render: () => (
        <ToastTrigger
            title="Operation completed successfully"
            description="Your data has been processed and synchronized across all devices. This may take a few moments to appear in your account."
            variant="success"
        />
    ),
};

export const LongTitle: Story = {
    render: () => (
        <ToastTrigger
            title="An unexpected error occurred while processing your request"
            description="Please try again later or contact support if the problem persists."
            variant="error"
        />
    ),
};

// Real-world examples
export const SaveSuccess: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="success"
                    onClick={() => {
                        toast({
                            title: 'Changes saved',
                            description: 'Your document has been saved successfully.',
                            variant: 'success',
                        });
                    }}
                >
                    Save Document
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const DeleteConfirmation: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="error"
                    onClick={() => {
                        toast({
                            title: 'Item deleted',
                            description: 'The item has been permanently deleted.',
                            variant: 'error',
                            action: (
                                <Button size="sm" variant="neutral" onClick={() => console.log('Undo delete')}>
                                    Undo
                                </Button>
                            ),
                        });
                    }}
                >
                    Delete Item
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const FormValidation: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    onClick={() => {
                        toast({
                            title: 'Validation error',
                            description: 'Please fill in all required fields.',
                            variant: 'error',
                        });
                    }}
                >
                    Submit Form
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const NetworkError: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="error"
                    onClick={() => {
                        toast({
                            title: 'Connection lost',
                            description: 'Unable to connect to the server. Please check your internet connection.',
                            variant: 'error',
                            action: (
                                <Button size="sm" variant="neutral" onClick={() => console.log('Retry')}>
                                    Retry
                                </Button>
                            ),
                        });
                    }}
                >
                    Simulate Network Error
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const UploadSuccess: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="success"
                    onClick={() => {
                        toast({
                            title: 'Upload complete',
                            description: 'Your file has been uploaded successfully.',
                            variant: 'success',
                            action: (
                                <Button size="sm" variant="neutral" onClick={() => console.log('View file')}>
                                    View
                                </Button>
                            ),
                        });
                    }}
                >
                    Upload File
                </Button>
                <Toaster />
            </div>
        );
    },
};

export const PermissionDenied: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    variant="error"
                    onClick={() => {
                        toast({
                            title: 'Access denied',
                            description: 'You do not have permission to perform this action.',
                            variant: 'error',
                        });
                    }}
                >
                    Access Resource
                </Button>
                <Toaster />
            </div>
        );
    },
};

// Multiple toasts
export const MultipleToasts: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Button
                    onClick={() => {
                        toast({
                            title: 'First notification',
                            description: 'This is the first toast.',
                            variant: 'info',
                        });
                        setTimeout(() => {
                            toast({
                                title: 'Second notification',
                                description: 'This is the second toast.',
                                variant: 'success',
                            });
                        }, 500);
                        setTimeout(() => {
                            toast({
                                title: 'Third notification',
                                description: 'This is the third toast.',
                                variant: 'warning',
                            });
                        }, 1000);
                    }}
                >
                    Show Multiple Toasts
                </Button>
                <Toaster />
            </div>
        );
    },
};

// Auto-dismiss example
export const AutoDismiss: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center space-y-2 mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">This toast will auto-dismiss after 3 seconds</p>
                </div>
                <Button
                    onClick={() => {
                        toast({
                            title: 'Auto-dismissing notification',
                            description: 'This will disappear automatically.',
                            variant: 'info',
                        });
                    }}
                >
                    Show Auto-Dismiss Toast
                </Button>
                <Toaster />
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
        const { toast } = useToast();

        return (
            <div className="dark p-8 rounded-lg bg-neutral-900">
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={() => {
                            toast({
                                title: 'Information',
                                description: 'This is an informational message.',
                                variant: 'info',
                            });
                        }}
                    >
                        Info
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            toast({
                                title: 'Success',
                                description: 'Operation completed successfully.',
                                variant: 'success',
                            });
                        }}
                    >
                        Success
                    </Button>
                    <Button
                        onClick={() => {
                            toast({
                                title: 'Warning',
                                description: 'Please proceed with caution.',
                                variant: 'warning',
                            });
                        }}
                    >
                        Warning
                    </Button>
                    <Button
                        variant="error"
                        onClick={() => {
                            toast({
                                title: 'Error',
                                description: 'Something went wrong.',
                                variant: 'error',
                            });
                        }}
                    >
                        Error
                    </Button>
                </div>
                <Toaster />
            </div>
        );
    },
};

// Interactive example
export const Interactive: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Try different toast combinations</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                toast({
                                    title: 'Info',
                                    variant: 'info',
                                });
                            }}
                        >
                            Info (no description)
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                toast({
                                    title: 'Info',
                                    description: 'With description',
                                    variant: 'info',
                                });
                            }}
                        >
                            Info (with description)
                        </Button>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => {
                                toast({
                                    title: 'Success',
                                    variant: 'success',
                                });
                            }}
                        >
                            Success (no description)
                        </Button>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => {
                                toast({
                                    title: 'Success',
                                    description: 'With description',
                                    variant: 'success',
                                });
                            }}
                        >
                            Success (with description)
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                toast({
                                    title: 'Success with action',
                                    description: 'Click the action button',
                                    variant: 'success',
                                    action: (
                                        <Button size="sm" variant="neutral" onClick={() => alert('Action clicked!')}>
                                            Action
                                        </Button>
                                    ),
                                });
                            }}
                        >
                            Success with action
                        </Button>
                        <Button
                            size="sm"
                            variant="error"
                            onClick={() => {
                                toast({
                                    title: 'Error with undo',
                                    description: 'You can undo this action',
                                    variant: 'error',
                                    action: (
                                        <Button size="sm" variant="neutral" onClick={() => alert('Undone!')}>
                                            Undo
                                        </Button>
                                    ),
                                });
                            }}
                        >
                            Error with undo
                        </Button>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    },
};

// Stack of toasts
export const ToastStack: Story = {
    render: () => {
        const { toast } = useToast();

        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center space-y-2 mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Click to add a toast to the stack</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        size="sm"
                        onClick={() => {
                            toast({
                                title: 'New info message',
                                description: `Message #${Math.floor(Math.random() * 100)}`,
                                variant: 'info',
                            });
                        }}
                    >
                        Add Info
                    </Button>
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                            toast({
                                title: 'Success message',
                                description: `Operation #${Math.floor(Math.random() * 100)} completed`,
                                variant: 'success',
                            });
                        }}
                    >
                        Add Success
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            toast({
                                title: 'Warning message',
                                description: `Warning #${Math.floor(Math.random() * 100)}`,
                                variant: 'warning',
                            });
                        }}
                    >
                        Add Warning
                    </Button>
                    <Button
                        size="sm"
                        variant="error"
                        onClick={() => {
                            toast({
                                title: 'Error message',
                                description: `Error #${Math.floor(Math.random() * 100)}`,
                                variant: 'error',
                            });
                        }}
                    >
                        Add Error
                    </Button>
                </div>
                <Toaster />
            </div>
        );
    },
};
