import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { pick } from './radix-select';
import { AddIdentityDialog } from '@/component-library/features/mutations/account/AddIdentityDialog';
import { IdentityType } from '@/lib/core/entity/account';
import { IDENTITY_TYPE_HINTS } from '@/lib/core/utils/account-validation';

const setup = (props = {}) => {
    const onSubmit = jest.fn();
    render(<AddIdentityDialog open onOpenChange={jest.fn()} account="jdoe" onSubmit={onSubmit} {...props} />);
    return onSubmit;
};
const submit = () => screen.getByRole('button', { name: 'Add identity' });
const change = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('AddIdentityDialog', () => {
    it('uses the placeholder from IDENTITY_TYPE_HINTS for each type', async () => {
        setup();
        for (const hint of Object.values(IDENTITY_TYPE_HINTS)) {
            await pick(/^Type/, hint.label);
            expect(screen.getByLabelText(/^Identity/)).toHaveAttribute('placeholder', hint.placeholder);
        }
        noEmDash();
    });

    it('shows Password and Confirm only for USERPASS', async () => {
        setup();
        expect(screen.queryByLabelText(/^Password/)).not.toBeInTheDocument();
        await pick(/^Type/, 'Username and password');
        expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm password/)).toBeInTheDocument();
        expect(screen.getByText(/Passwords cannot be changed from the WebUI/)).toBeInTheDocument();
    });

    it('blocks submit on a password mismatch and submits when they match', async () => {
        const onSubmit = setup();
        await pick(/^Type/, 'Username and password');
        change(/^Identity/, 'jdoe');
        change(/Email/, 'a@b.org');
        change(/^Password/, 'fake-pass');
        change(/Confirm password/, 'other');
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm password/)).toHaveAttribute('aria-describedby', 'add-identity-confirm-error');
        expect(submit()).toBeDisabled();
        change(/Confirm password/, 'fake-pass');
        expect(submit()).toBeEnabled();
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({
            identity: 'jdoe',
            authType: IdentityType.USERPASS,
            email: 'a@b.org',
            password: 'fake-pass',
            isDefault: false,
        });
    });

    it('uses a textarea for SSH', async () => {
        setup();
        await pick(/^Type/, 'SSH key');
        expect(screen.getByLabelText(/^Identity/).tagName).toBe('TEXTAREA');
    });

    it('omits the password for other types, even after switching away from USERPASS', async () => {
        const onSubmit = setup();
        await pick(/^Type/, 'Username and password');
        change(/^Password/, 'fake-pass');
        await pick(/^Type/, 'OIDC');
        change(/^Identity/, 'SUB=1, ISS=https://iam/');
        change(/Email/, 'a@b.org');
        expect(screen.getByText('Default account for this identity')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(submit());
        const values = onSubmit.mock.calls[0][0];
        expect(values).toEqual({ identity: 'SUB=1, ISS=https://iam/', authType: IdentityType.OIDC, email: 'a@b.org', isDefault: true });
        expect('password' in values).toBe(false);
    });

    it('requires a valid email', async () => {
        setup();
        change(/^Identity/, 'CN=x');
        change(/Email/, 'nope');
        expect(submit()).toBeDisabled();
    });

    it('renders the server error', async () => {
        setup({ error: 'Identity already exists' });
        expect(screen.getByRole('alert')).toHaveTextContent('Identity already exists');
    });
});
