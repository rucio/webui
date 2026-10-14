import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsAccountQuotas } from '@/component-library/pages/Account/details/DetailsAccountQuotas';
import { AccountQuotas } from '@/component-library/pages/Account/details/details-account-types';

const GLOBAL_ERROR = 'Rucio could not list the global quotas: RSE Expression resulted in an empty set.';

const quotas = (data: AccountQuotas) => ({ data, isLoading: false });

describe('DetailsAccountQuotas', () => {
    it('shows the global error in place of the global table and keeps the local section', () => {
        render(<DetailsAccountQuotas quotas={quotas({ local: [], global: [], globalError: GLOBAL_ERROR })} canManage={false} />);
        expect(screen.getByText(GLOBAL_ERROR)).toBeInTheDocument();
        expect(screen.getByText('No local quotas or usage.')).toBeInTheDocument();
        expect(screen.queryByText('No global quotas.')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Remove by expression' })).not.toBeInTheDocument();
    });

    it('lets a manager remove a global quota by its expression', () => {
        const onDeleteLimit = jest.fn();
        render(
            <DetailsAccountQuotas quotas={quotas({ local: [], global: [], globalError: GLOBAL_ERROR })} canManage onDeleteLimit={onDeleteLimit} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Remove by expression' }));
        expect(onDeleteLimit).toHaveBeenCalledWith({ locality: 'global', rseExpression: '' });
    });
});
