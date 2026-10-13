import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { DeleteAccountDialog } from '@/component-library/features/mutations/account/DeleteAccountDialog';

describe('DeleteAccountDialog', () => {
    it('enables submit only when the typed name matches exactly', () => {
        const onSubmit = jest.fn();
        render(<DeleteAccountDialog open onOpenChange={jest.fn()} account="jdoe" onSubmit={onSubmit} />);
        const btn = screen.getByRole('button', { name: 'Delete account' });
        const input = screen.getByLabelText(/Type jdoe to confirm/);
        expect(btn).toBeDisabled();
        fireEvent.change(input, { target: { value: 'jdo' } });
        expect(btn).toBeDisabled();
        fireEvent.change(input, { target: { value: 'JDOE' } });
        expect(btn).toBeDisabled();
        fireEvent.change(input, { target: { value: 'jdoe' } });
        expect(btn).toBeEnabled();
        fireEvent.click(btn);
        expect(onSubmit).toHaveBeenCalledWith({ account: 'jdoe' });
        expect(screen.getByText(/soft deleted/)).toBeInTheDocument();
        noEmDash();
    });
});
