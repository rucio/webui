import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListAccountsTips } from '@/component-library/pages/Account/list/ListAccountsTips';

const EM_DASH = String.fromCharCode(0x2014);

describe('ListAccountsTips', () => {
    it('explains the active-only listing and the wildcard', () => {
        render(<ListAccountsTips />);
        expect(screen.getByText(/Only active accounts are listed/)).toBeInTheDocument();
        expect(screen.getByText(/Name:/)).toBeInTheDocument();
        expect(screen.getByRole('list')).toHaveTextContent(/wildcard/i);
    });

    it('uses no em dashes, per the project copy rule', () => {
        const { container } = render(<ListAccountsTips />);
        expect(container.textContent).not.toContain(EM_DASH);
    });
});
