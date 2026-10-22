import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { pick } from './radix-select';
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
    it('sends base 10 bytes for 2 TB', async () => {
        const onSubmit = setup();
        expect(submit()).toBeDisabled();
        await pick('RSE *', 'CERN-DISK');
        change('Limit *', '2');
        await pick('Unit', 'TB');
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'CERN-DISK', bytes: 2_000_000_000_000 });
        noEmDash();
    });

    it('sends -1 for Unlimited', async () => {
        const onSubmit = setup();
        await pick('RSE *', 'BNL-DISK');
        fireEvent.click(screen.getByRole('checkbox', { name: 'Unlimited' }));
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'BNL-DISK', bytes: -1 });
    });

    it('takes an RSE expression for global limits', async () => {
        const onSubmit = setup();
        fireEvent.click(screen.getByRole('radio', { name: 'Global (per RSE expression)' }));
        change('RSE expression *', 'tier=1');
        change('Limit *', '1.5');
        await pick('Unit', 'PB');
        fireEvent.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'global', rseExpression: 'tier=1', bytes: 1_500_000_000_000_000 });
    });

    it('locks locality and RSE in edit mode and prefills the amount', async () => {
        const onSubmit = setup({ initial: { locality: 'local', rseExpression: 'CERN-DISK', bytes: 3_000_000_000_000 } });
        expect(screen.getByRole('radio', { name: 'Local (per RSE)' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Local (per RSE)' })).toBeDisabled();
        expect(screen.getByRole('radio', { name: 'Global (per RSE expression)' })).toBeDisabled();
        expect(screen.getByLabelText('RSE *')).toBeDisabled();
        expect(screen.getByLabelText('Limit *')).toHaveValue(3);
        expect(screen.getByLabelText('Unit')).toHaveTextContent('TB');
        fireEvent.click(submit('Save limit'));
        expect(onSubmit).toHaveBeenCalledWith({ locality: 'local', rseExpression: 'CERN-DISK', bytes: 3_000_000_000_000 });
    });

    it('prefills Unlimited in edit mode', async () => {
        setup({ initial: { locality: 'global', rseExpression: 'tier=1', bytes: -1 } });
        expect(screen.getByRole('checkbox', { name: 'Unlimited' })).toBeChecked();
        expect(screen.getByLabelText('RSE expression *')).toBeDisabled();
    });

    it('rejects a negative amount', async () => {
        setup();
        await pick('RSE *', 'CERN-DISK');
        change('Limit *', '-5');
        expect(submit()).toBeDisabled();
    });

    it('shows a loading hint while the RSEs load', () => {
        setup({ rses: [], rsesLoading: true });
        expect(screen.getByText('Loading RSEs...')).toBeInTheDocument();
    });

    it('shows why the RSE select is empty when loading the RSEs failed', () => {
        setup({ rses: [], rsesError: 'Could not load the RSE list.' });
        expect(screen.getByText('Could not load the RSE list.')).toBeInTheDocument();
        noEmDash();
    });

    it('says so when there are no RSEs', () => {
        setup({ rses: [] });
        expect(screen.getByText(/No RSEs found/)).toBeInTheDocument();
        noEmDash();
    });

    it('shows no RSE hint once the RSEs are loaded, or for a global limit', () => {
        setup({ rsesLoading: false });
        expect(screen.queryByText(/Loading RSEs|No RSEs found/)).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('radio', { name: 'Global (per RSE expression)' }));
        expect(screen.queryByText(/Loading RSEs|No RSEs found/)).not.toBeInTheDocument();
    });
});
