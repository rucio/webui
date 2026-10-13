import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { EditAccountDialog } from '@/component-library/features/mutations/account/EditAccountDialog';
import { AccountType } from '@/lib/core/entity/rucio';

const setup = () => {
    const onSubmit = jest.fn();
    render(
        <EditAccountDialog
            open
            onOpenChange={jest.fn()}
            account="jdoe"
            initial={{ accountType: AccountType.USER, email: 'old@b.org' }}
            onSubmit={onSubmit}
        />,
    );
    return onSubmit;
};
const save = () => screen.getByRole('button', { name: 'Save changes' });

describe('EditAccountDialog', () => {
    it('is disabled until something changes', () => {
        setup();
        expect(save()).toBeDisabled();
        noEmDash();
    });

    it('submits only changed fields', () => {
        const onSubmit = setup();
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'new@b.org' } });
        fireEvent.click(save());
        expect(onSubmit).toHaveBeenCalledWith({ email: 'new@b.org' });
    });

    it('sends null email when the email is cleared', () => {
        const onSubmit = setup();
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: '' } });
        fireEvent.click(save());
        expect(onSubmit).toHaveBeenCalledWith({ email: null });
    });

    it('submits a changed type', () => {
        const onSubmit = setup();
        fireEvent.change(screen.getByLabelText(/Type/), { target: { value: AccountType.SERVICE } });
        fireEvent.click(save());
        expect(onSubmit).toHaveBeenCalledWith({ accountType: AccountType.SERVICE });
    });
});
