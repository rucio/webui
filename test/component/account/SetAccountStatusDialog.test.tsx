import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { SetAccountStatusDialog } from '@/component-library/features/mutations/account/SetAccountStatusDialog';
import { AccountStatus } from '@/lib/core/entity/rucio';

describe('SetAccountStatusDialog', () => {
    it.each([
        ['suspend', 'Suspend account', AccountStatus.SUSPENDED],
        ['reactivate', 'Reactivate account', AccountStatus.ACTIVE],
    ] as const)('%s mode submits the matching status', (mode, label, status) => {
        const onSubmit = jest.fn();
        render(<SetAccountStatusDialog open onOpenChange={jest.fn()} account="jdoe" mode={mode} onSubmit={onSubmit} />);
        fireEvent.click(screen.getByRole('button', { name: label }));
        expect(onSubmit).toHaveBeenCalledWith({ status });
        noEmDash();
    });

    it('describes the effect', () => {
        const { rerender } = render(<SetAccountStatusDialog open onOpenChange={jest.fn()} account="jdoe" mode="suspend" onSubmit={jest.fn()} />);
        expect(screen.getByText(/Existing sessions keep working until their tokens expire/)).toBeInTheDocument();
        rerender(<SetAccountStatusDialog open onOpenChange={jest.fn()} account="jdoe" mode="reactivate" onSubmit={jest.fn()} />);
        expect(screen.getByText(/become visible again/)).toBeInTheDocument();
    });

    it('renders the server error', () => {
        render(<SetAccountStatusDialog open onOpenChange={jest.fn()} account="jdoe" mode="suspend" onSubmit={jest.fn()} error="Not allowed" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Not allowed');
    });
});
