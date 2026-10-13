import React from 'react';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { render, screen } from '@testing-library/react';
import { AccountEmailCell, AccountNameCell, accountHref } from '@/component-library/pages/Account/list/ListAccountsTable';

describe('ListAccountsTable cells', () => {
    it('renders "none" for a null email, never "null"', () => {
        render(<AccountEmailCell value={null} />);
        expect(screen.getByText('none')).toBeInTheDocument();
        expect(screen.queryByText('null')).not.toBeInTheDocument();
    });

    it('renders a copyable email', () => {
        render(<AccountEmailCell value="jdoe@example.com" />);
        expect(screen.getByText('jdoe@example.com')).toBeInTheDocument();
    });

    it('links the account cell to /account/<name>', () => {
        const open = jest.spyOn(window, 'open').mockImplementation(() => null);
        render(<AccountNameCell value="jdoe" />);
        screen.getByRole('button').click();
        expect(open).toHaveBeenCalledWith('/account/jdoe', '_blank', 'noopener,noreferrer');
        expect(accountHref('a b')).toBe('/account/a%20b');
        open.mockRestore();
    });
});

describe('NullBadge', () => {
    it('still renders "null" without a label', () => {
        render(<NullBadge />);
        expect(screen.getByText('null')).toBeInTheDocument();
    });
});
