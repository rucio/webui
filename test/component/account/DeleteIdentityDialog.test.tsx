import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { DeleteIdentityDialog } from '@/component-library/features/mutations/account/DeleteIdentityDialog';
import { IdentityType } from '@/lib/core/entity/account';

const setup = (props: { isLastIdentity?: boolean; isCurrentSessionIdentity?: boolean } = {}) => {
    const onSubmit = jest.fn();
    render(
        <DeleteIdentityDialog
            open
            onOpenChange={jest.fn()}
            account="jdoe"
            identity="CN=jdoe"
            authType={IdentityType.X509}
            isLastIdentity={false}
            isCurrentSessionIdentity={false}
            onSubmit={onSubmit}
            {...props}
        />,
    );
    return onSubmit;
};

describe('DeleteIdentityDialog', () => {
    it('shows no warning by default and submits', () => {
        const onSubmit = setup();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Remove identity' }));
        expect(onSubmit).toHaveBeenCalledWith({ identity: 'CN=jdoe', authType: IdentityType.X509 });
    });

    it('warns about the last identity', () => {
        setup({ isLastIdentity: true });
        expect(screen.getByRole('alert')).toHaveTextContent(/last identity/i);
        noEmDash();
    });

    it('warns about the current session identity', () => {
        setup({ isCurrentSessionIdentity: true });
        expect(screen.getByRole('alert')).toHaveTextContent(/signed in with/i);
        noEmDash();
    });
});
