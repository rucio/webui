import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { AddAttributeDialog, AddAttributeDialogProps } from './AddAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { isValidAccountAttribute } from '@/lib/core/utils/account-validation';

const meta: Meta<typeof AddAttributeDialog> = {
    title: 'Features/Mutations/Attributes/AddAttributeDialog',
    component: AddAttributeDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <>
                <Story />
                <Toaster />
            </>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AddAttributeDialog>;

type WrapperProps = Partial<Omit<AddAttributeDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add attribute</Button>
            <AddAttributeDialog
                entityLabel="RSE"
                entityName="CERN-DISK"
                existingKeys={['fts', 'site', 'tier']}
                onConfirm={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

const accountProps: WrapperProps = {
    entityLabel: 'account',
    entityName: 'jdoe',
    existingKeys: ['country'],
    keyPlaceholder: 'e.g., country',
    valuePlaceholder: 'e.g., CH',
    validateKey: key => (isValidAccountAttribute(key) ? undefined : 'Use up to 30 letters, digits, and - _ \\ / . characters'),
    validateValue: value => (isValidAccountAttribute(value) ? undefined : 'Use up to 30 letters, digits, and - _ \\ / . characters'),
    warning: ({ key }) =>
        key === 'admin' ? <Alert variant="warning" message="The admin attribute grants administrator rights to this account." /> : null,
};

export const RSE: Story = {
    render: () => <Wrapper />,
};

export const RSENoExistingKeys: Story = {
    render: () => <Wrapper existingKeys={[]} />,
};

export const Account: Story = {
    render: () => <Wrapper {...accountProps} />,
};

export const Loading: Story = {
    render: () => <Wrapper {...accountProps} loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper {...accountProps} error="You do not have permission to change attributes on this account." />,
};
