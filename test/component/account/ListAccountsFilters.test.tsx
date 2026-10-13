import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListAccountsFilters, EMPTY_FILTERS } from '@/component-library/pages/Account/list/ListAccountsFilters';

const setup = (filters = EMPTY_FILTERS) => {
    const onChange = jest.fn();
    const onSearch = jest.fn();
    render(<ListAccountsFilters filters={filters} onChange={onChange} onSearch={onSearch} onStop={jest.fn()} isRunning={false} />);
    return { onChange, onSearch };
};

describe('ListAccountsFilters', () => {
    it('shows the given filter values', () => {
        setup({ account: 'j*', type: 'GROUP', identity: 'CN=x' });
        expect(screen.getByLabelText('Name')).toHaveValue('j*');
        expect(screen.getByLabelText('Identity')).toHaveValue('CN=x');
    });

    it('reports edits', () => {
        const { onChange } = setup();
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'ab' } });
        expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, account: 'ab' });
    });

    it('searches on Enter', () => {
        const { onSearch } = setup({ ...EMPTY_FILTERS, account: 'ab*' });
        fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Enter' });
        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('blocks an invalid name', () => {
        const { onSearch } = setup({ ...EMPTY_FILTERS, account: 'Bad Name' });
        expect(screen.getByRole('alert')).toBeInTheDocument();
        fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Enter' });
        expect(onSearch).not.toHaveBeenCalled();
    });
});
