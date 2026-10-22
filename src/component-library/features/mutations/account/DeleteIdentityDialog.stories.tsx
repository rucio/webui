import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { DeleteIdentityDialog, DeleteIdentityDialogProps } from './DeleteIdentityDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { IdentityType } from '@/lib/core/entity/account';

const meta: Meta<typeof DeleteIdentityDialog> = {
    title: 'Features/Mutations/Account/DeleteIdentityDialog',
    component: DeleteIdentityDialog,
    parameters: { layout: 'centered' },
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
type Story = StoryObj<typeof DeleteIdentityDialog>;

type WrapperProps = Partial<Omit<DeleteIdentityDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                <HiOutlineTrash className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Remove identity
            </Button>
            <DeleteIdentityDialog
                account="jdoe"
                identity="CN=Jane Doe,OU=Users,DC=example,DC=org"
                authType={IdentityType.X509}
                isLastIdentity={false}
                isCurrentSessionIdentity={false}
                onSubmit={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

export const LastIdentity: Story = { render: () => <Wrapper isLastIdentity /> };

export const CurrentSessionIdentity: Story = { render: () => <Wrapper isCurrentSessionIdentity /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This identity is not linked to the account." /> };
