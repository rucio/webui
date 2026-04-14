import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { MutationDialog } from './MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { Button } from '@/component-library/atoms/form/button';

const meta: Meta<typeof MutationDialog> = {
    title: 'Features/Mutations/MutationDialog',
    component: MutationDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        submitVariant: {
            control: 'select',
            options: ['default', 'success', 'error', 'neutral'],
            description: 'Variant of the submit button',
        },
        loading: {
            control: 'boolean',
            description: 'Shows loading state on submit button',
        },
    },
};

export default meta;
type Story = StoryObj<typeof MutationDialog>;

// Interactive wrapper for stories that need open/close state
const DialogWrapper = (props: Omit<React.ComponentProps<typeof MutationDialog>, 'open' | 'onOpenChange'> & { triggerLabel?: string }) => {
    const [open, setOpen] = useState(false);
    const { triggerLabel = 'Open Dialog', ...dialogProps } = props;
    return (
        <>
            <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
            <MutationDialog open={open} onOpenChange={setOpen} {...dialogProps} />
        </>
    );
};

export const Default: Story = {
    render: () => (
        <DialogWrapper
            title="Confirm Action"
            description="Are you sure you want to proceed?"
            onSubmit={() => alert('Submitted!')}
            submitLabel="Confirm"
        >
            <p className="text-sm text-neutral-700 dark:text-neutral-300">This is the dialog content area. You can place any form fields or messages here.</p>
        </DialogWrapper>
    ),
};

export const Destructive: Story = {
    render: () => (
        <DialogWrapper
            title="Delete Item"
            description="This action cannot be undone."
            onSubmit={() => alert('Deleted!')}
            submitLabel="Delete"
            submitVariant="error"
            triggerLabel="Open Destructive Dialog"
        >
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Are you sure you want to permanently delete this item?</p>
        </DialogWrapper>
    ),
};

export const WithFormFields: Story = {
    render: () => {
        const [name, setName] = useState('');
        return (
            <DialogWrapper
                title="Rename Dataset"
                description="Enter a new name for this dataset."
                onSubmit={() => alert(`New name: ${name}`)}
                submitLabel="Rename"
                submitVariant="success"
                triggerLabel="Rename Dataset"
            >
                <div>
                    <label htmlFor="dataset-name" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        New name <span className="text-base-error-600">*</span>
                    </label>
                    <Input id="dataset-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter dataset name" />
                </div>
            </DialogWrapper>
        );
    },
};

export const Loading: Story = {
    render: () => (
        <DialogWrapper
            title="Processing"
            description="Please wait while the operation completes."
            onSubmit={() => {}}
            submitLabel="Save"
            loading={true}
            triggerLabel="Open Loading Dialog"
        >
            <p className="text-sm text-neutral-700 dark:text-neutral-300">The operation is in progress...</p>
        </DialogWrapper>
    ),
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark">
            <DialogWrapper
                title="Dark Mode Dialog"
                description="This dialog is displayed in dark mode."
                onSubmit={() => alert('Submitted!')}
                submitLabel="Confirm"
                triggerLabel="Open in Dark Mode"
            >
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Content renders correctly in dark mode.</p>
            </DialogWrapper>
        </div>
    ),
    globals: {
        backgrounds: {
            value: "dark"
        }
    },
};
