import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { DeleteAccountLimitDialog } from '@/component-library/features/mutations/account/DeleteAccountLimitDialog';

describe('DeleteAccountLimitDialog', () => {
    it('shows the limit and submits locality and expression', () => {
        const onSubmit = jest.fn();
        render(
            <DeleteAccountLimitDialog open onOpenChange={jest.fn()} account="jdoe" locality="global" rseExpression="tier=1" onSubmit={onSubmit} />,
        );
        expect(screen.getByText('tier=1')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete limit' }));
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'global', rseExpression: 'tier=1' });
        expect(screen.getByText(/Usage is kept/)).toBeInTheDocument();
        noEmDash();
    });

    it('asks for the expression when editable and submits the trimmed value', () => {
        const onSubmit = jest.fn();
        render(
            <DeleteAccountLimitDialog open onOpenChange={jest.fn()} account="jdoe" locality="global" rseExpression="" editable onSubmit={onSubmit} />,
        );
        const submit = screen.getByRole('button', { name: 'Delete limit' });
        expect(submit).toBeDisabled();
        fireEvent.change(screen.getByLabelText(/RSE expression/), { target: { value: '  tier=9  ' } });
        expect(submit).toBeEnabled();
        fireEvent.click(submit);
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'global', rseExpression: 'tier=9' });
        noEmDash();
    });
});
