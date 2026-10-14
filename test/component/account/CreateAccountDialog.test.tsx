import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { CreateAccountDialog } from '@/component-library/features/mutations/account/CreateAccountDialog';
import { pick } from './radix-select';
import { AccountType } from '@/lib/core/entity/rucio';

const setup = (props = {}) => {
    const onSubmit = jest.fn();
    render(<CreateAccountDialog open onOpenChange={jest.fn()} onSubmit={onSubmit} {...props} />);
    return onSubmit;
};
const submit = () => screen.getByRole('button', { name: 'Create account' });
const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value } });

describe('CreateAccountDialog', () => {
    it('shows the hint, an error and a disabled submit for an invalid name', () => {
        setup();
        type('Name', 'Bad Name!');
        expect(screen.getByText(/lowercase letters/i, { selector: '[id$="-error"]' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/)).toHaveAttribute('aria-describedby', expect.stringContaining('create-account-name-error'));
        expect(submit()).toBeDisabled();
        noEmDash();
    });

    it('submits email null when the email is empty', () => {
        const onSubmit = setup();
        expect(submit()).toBeDisabled();
        type('Name', 'jdoe');
        expect(submit()).toBeEnabled();
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ account: 'jdoe', accountType: AccountType.USER, email: null });
    });

    it('submits the chosen type and email', async () => {
        const onSubmit = setup();
        type('Name', 'grp');
        await pick(/Type/, 'Group');
        type('Email', 'a@b.org');
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ account: 'grp', accountType: AccountType.GROUP, email: 'a@b.org' });
    });

    it('blocks an invalid email', () => {
        setup();
        type('Name', 'jdoe');
        type('Email', 'nope');
        expect(submit()).toBeDisabled();
    });

    it('renders the server error inside the dialog', () => {
        setup({ error: 'Account already exists' });
        expect(screen.getByRole('alert')).toHaveTextContent('Account already exists');
        noEmDash();
    });
});
