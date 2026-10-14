import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
const EM_DASH = String.fromCharCode(0x2014);
const noEmDash = () => expect(document.body.textContent).not.toContain(EM_DASH);

import { AddAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/AddAccountAttributeDialog';
import { EditAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/EditAccountAttributeDialog';
import { DeleteAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/DeleteAccountAttributeDialog';
import { isValidAccountAttribute } from '@/lib/core/utils/account-validation';

const change = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

const accountValidators = {
    validateKey: (k: string) => (isValidAccountAttribute(k) ? undefined : 'Invalid key'),
    validateValue: (v: string) => (isValidAccountAttribute(v) ? undefined : 'Invalid value'),
};

describe('AddAccountAttributeDialog', () => {
    it('titles, duplicate key, confirm', () => {
        const onConfirm = jest.fn();
        render(<AddAccountAttributeDialog open onOpenChange={jest.fn()} entityName="jdoe" existingKeys={['country']} onConfirm={onConfirm} />);
        expect(screen.getByText('Add account attribute')).toBeInTheDocument();
        change(/Key/, 'country');
        change(/Value/, 'x');
        expect(screen.getByText('This attribute key already exists')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add attribute' })).toBeDisabled();
        change(/Key/, 'site');
        fireEvent.click(screen.getByRole('button', { name: 'Add attribute' }));
        expect(onConfirm).toHaveBeenCalledWith('site', 'x');
        noEmDash();
    });

    it('regex errors for key and value with aria-describedby', () => {
        render(<AddAccountAttributeDialog open onOpenChange={jest.fn()} entityName="jdoe" onConfirm={jest.fn()} {...accountValidators} />);
        expect(screen.getByText('Add account attribute')).toBeInTheDocument();
        change(/Key/, 'bad key!');
        change(/Value/, 'ok');
        expect(screen.getByText('Invalid key')).toBeInTheDocument();
        expect(screen.getByLabelText(/Key/)).toHaveAttribute('aria-describedby', 'attr-key-error');
        expect(screen.getByRole('button', { name: 'Add attribute' })).toBeDisabled();
        change(/Key/, 'good');
        change(/Value/, 'x'.repeat(31));
        expect(screen.getByText('Invalid value')).toBeInTheDocument();
        expect(screen.getByLabelText(/Value/)).toHaveAttribute('aria-describedby', 'attr-value-error');
        expect(screen.getByRole('button', { name: 'Add attribute' })).toBeDisabled();
    });

    it('renders the warning slot for admin only', () => {
        render(
            <AddAccountAttributeDialog
                open
                onOpenChange={jest.fn()}
                entityName="jdoe"
                onConfirm={jest.fn()}
                warning={({ key }) => (key === 'admin' ? <p>Grants admin rights</p> : null)}
            />,
        );
        change(/Key/, 'country');
        expect(screen.queryByText('Grants admin rights')).not.toBeInTheDocument();
        change(/Key/, 'admin');
        expect(screen.getByText('Grants admin rights')).toBeInTheDocument();
    });

    it('renders the server error', () => {
        render(<AddAccountAttributeDialog open onOpenChange={jest.fn()} entityName="jdoe" onConfirm={jest.fn()} error="Denied" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Denied');
    });
});

describe('DeleteAccountAttributeDialog', () => {
    it('renders title, warning and confirms', () => {
        const onConfirm = jest.fn();
        render(
            <DeleteAccountAttributeDialog
                open
                onOpenChange={jest.fn()}
                entityName="jdoe"
                attributeKey="k"
                attributeValue="v"
                warning={<p>Careful</p>}
                onConfirm={onConfirm}
            />,
        );
        expect(screen.getByText('Delete account attribute')).toBeInTheDocument();
        expect(screen.getByText('Careful')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete attribute' }));
        expect(onConfirm).toHaveBeenCalled();
        noEmDash();
    });
});

describe('EditAccountAttributeDialog', () => {
    const renderEdit = (props: Partial<React.ComponentProps<typeof EditAccountAttributeDialog>> = {}) => {
        const onConfirm = jest.fn();
        render(
            <EditAccountAttributeDialog
                open
                onOpenChange={jest.fn()}
                entityName="jdoe"
                attributeKey="country-ch"
                currentValue="user"
                onConfirm={onConfirm}
                validateValue={accountValidators.validateValue}
                {...props}
            />,
        );
        return onConfirm;
    };
    const save = () => screen.getByRole('button', { name: 'Save' });

    it('shows the delete and create warning, a locked key and the current value', () => {
        renderEdit();
        expect(screen.getByText('Rucio cannot update attributes in place', { exact: false })).toBeInTheDocument();
        expect(screen.getByText(/Saving deletes the attribute and creates it again with the new value/)).toBeInTheDocument();
        expect(screen.getByLabelText('Key')).toHaveValue('country-ch');
        expect(screen.getByLabelText('Key')).toBeDisabled();
        expect(screen.getByLabelText(/Value/)).toHaveValue('user');
        noEmDash();
    });

    it('disables Save while the value is unchanged, empty or invalid', () => {
        renderEdit();
        expect(save()).toBeDisabled();
        change(/Value/, '   ');
        expect(save()).toBeDisabled();
        change(/Value/, 'bad value!');
        expect(screen.getByText('Invalid value')).toBeInTheDocument();
        expect(save()).toBeDisabled();
        change(/Value/, ' user ');
        expect(save()).toBeDisabled();
    });

    it('submits the trimmed new value', () => {
        const onConfirm = renderEdit();
        change(/Value/, ' group ');
        fireEvent.click(save());
        expect(onConfirm).toHaveBeenCalledWith('group');
    });

    it('renders the extra warning and the server error', () => {
        renderEdit({ warning: <p>role note</p>, error: 'server said no' });
        expect(screen.getByText('role note')).toBeInTheDocument();
        expect(screen.getByText('server said no')).toBeInTheDocument();
    });
});
