import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListAccountsTips } from '@/component-library/pages/Account/list/ListAccountsTips';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '@/lib/core/entity/rucio';

const EM_DASH = String.fromCharCode(0x2014);

describe('ListAccountsTips', () => {
    it('explains the active-only listing and the wildcard', () => {
        render(<ListAccountsTips />);
        expect(screen.getByText(/Only active accounts are listed/)).toBeInTheDocument();
        expect(screen.getByText(/Name:/)).toBeInTheDocument();
        expect(screen.getByRole('list')).toHaveTextContent(/wildcard/i);
    });

    it('explains the identity filter', () => {
        render(<ListAccountsTips />);
        expect(screen.getByText(/Identity:/)).toBeInTheDocument();
        expect(screen.getByRole('list')).toHaveTextContent(/certificate DN/);
    });

    it('lists every account type by its label, in italics', () => {
        render(<ListAccountsTips />);
        ACCOUNT_TYPES.forEach(type => expect(screen.getByText(ACCOUNT_TYPE_LABELS[type]).tagName).toBe('EM'));
        expect(screen.getByRole('list')).toHaveTextContent('one account type: User, Group or Service.');
    });

    it('uses no em dashes, per the project copy rule', () => {
        const { container } = render(<ListAccountsTips />);
        expect(container.textContent).not.toContain(EM_DASH);
    });
});
