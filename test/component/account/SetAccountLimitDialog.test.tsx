import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Radix Checkbox measures itself with ResizeObserver, which jsdom lacks.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: unknown }).ResizeObserver ??= ResizeObserverStub;

const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { SetAccountLimitDialog } from '@/component-library/features/mutations/account/SetAccountLimitDialog';

const rses = ['CERN-DISK', 'BNL-DISK'];
const setup = (props = {}) => {
    const onSubmit = jest.fn();
    render(<SetAccountLimitDialog open onOpenChange={jest.fn()} account="jdoe" rses={rses} onSubmit={onSubmit} {...props} />);
    return onSubmit;
};
const submit = (name = 'Set limit') => screen.getByRole('button', { name });
const change = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('SetAccountLimitDialog', () => {
    it('sends base 10 bytes for 2 TB', () => {
        const onSubmit = setup();
        expect(submit()).toBeDisabled();
        change('RSE *', 'CERN-DISK');
        change('Limit *', '2');
        change('Unit', 'TB');
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'CERN-DISK', bytes: 2_000_000_000_000 });
        noEmDash();
    });

    it('sends -1 for Unlimited', () => {
        const onSubmit = setup();
        change('RSE *', 'BNL-DISK');
        fireEvent.click(screen.getByRole('checkbox', { name: 'Unlimited' }));
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'BNL-DISK', bytes: -1 });
    });

    it('takes an RSE expression for global limits', () => {
        const onSubmit = setup();
        change(/Scope/, 'global');
        change(/RSE expression/, 'tier=1');
        change('Limit *', '1.5');
        change('Unit', 'PB');
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'global', rseExpression: 'tier=1', bytes: 1_500_000_000_000_000 });
    });

    it('locks locality and RSE in edit mode and prefills the amount', () => {
        const onSubmit = setup({ initial: { locality: 'local', rseExpression: 'CERN-DISK', bytes: 3_000_000_000_000 } });
        expect(screen.getByLabelText(/Scope/)).toBeDisabled();
        expect(screen.getByLabelText('RSE *')).toBeDisabled();
        expect(screen.getByLabelText('Limit *')).toHaveValue(3);
        expect(screen.getByLabelText('Unit')).toHaveValue('TB');
        fireEvent.click(submit('Save limit'));
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'CERN-DISK', bytes: 3_000_000_000_000 });
    });

    it('prefills Unlimited in edit mode', () => {
        setup({ initial: { locality: 'global', rseExpression: 'tier=1', bytes: -1 } });
        expect(screen.getByRole('checkbox', { name: 'Unlimited' })).toBeChecked();
        expect(screen.getByLabelText(/RSE expression/)).toBeDisabled();
    });

    it('rejects a negative amount', () => {
        setup();
        change('RSE *', 'CERN-DISK');
        change('Limit *', '-5');
        expect(submit()).toBeDisabled();
    });
});
