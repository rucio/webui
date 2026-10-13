import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    QuotaLimitCell,
    QuotaRemainingCell,
    QuotaUsageCell,
    ResolvedRsesCell,
    quotaUsage,
} from '@/component-library/pages/Account/details/AccountQuotasTable';
import { AttributeKeyCell } from '@/component-library/pages/Account/details/AccountAttributesTable';
import { IdentityCell } from '@/component-library/pages/Account/details/AccountIdentitiesTable';
import { formatDecimalFileSize } from '@/component-library/features/utils/text-formatters';

describe('quota cells', () => {
    it('renders Unlimited, No quota and base 10 sizes', () => {
        const { rerender } = render(<QuotaLimitCell value={-1} />);
        expect(screen.getByText('Unlimited')).toBeInTheDocument();
        rerender(<QuotaLimitCell value={null} />);
        expect(screen.getByText('No quota')).toBeInTheDocument();
        rerender(<QuotaLimitCell value={10 * 1e12} />);
        expect(screen.getByText('10 TB')).toBeInTheDocument();
    });

    it('formats sizes in base 10', () => {
        expect(formatDecimalFileSize(1e12)).toBe('1 TB');
        expect(formatDecimalFileSize(1_500_000_000)).toBe('1.5 GB');
        expect(formatDecimalFileSize(0)).toBe('0 Bytes');
        expect(formatDecimalFileSize(512)).toBe('512 Bytes');
    });

    it('computes usage colours: warning above 90 percent, error at or above 100', () => {
        expect(quotaUsage(50, 100)).toEqual({ percentage: 50, variant: 'success' });
        expect(quotaUsage(95, 100)).toEqual({ percentage: 95, variant: 'warning' });
        expect(quotaUsage(100, 100)).toEqual({ percentage: 100, variant: 'error' });
        expect(quotaUsage(120, 100)).toEqual({ percentage: 120, variant: 'error' });
        expect(quotaUsage(10, -1)).toBeNull();
        expect(quotaUsage(10, null)).toBeNull();
    });

    it('colours the progress bar at 95 and 120 percent', () => {
        const { rerender } = render(<QuotaUsageCell data={{ bytesUsed: 95, bytesLimit: 100 }} />);
        let fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
        expect(fill.className).toContain('bg-base-warning-600');
        expect(screen.getByText('95%')).toBeInTheDocument();

        rerender(<QuotaUsageCell data={{ bytesUsed: 120, bytesLimit: 100 }} />);
        fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
        expect(fill.className).toContain('bg-base-error-600');
        expect(screen.getByText('120%')).toBeInTheDocument();
    });

    it('hides the progress bar for unlimited or no quota', () => {
        const { rerender } = render(<QuotaUsageCell data={{ bytesUsed: 95, bytesLimit: -1 }} />);
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        rerender(<QuotaUsageCell data={{ bytesUsed: 95, bytesLimit: null }} />);
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('shows what is left, or how far over the quota the account is', () => {
        const { rerender } = render(<QuotaRemainingCell data={{ bytesLimit: 2e12, bytesRemaining: 1e12 }} />);
        expect(screen.getByText('1 TB')).toBeInTheDocument();
        rerender(<QuotaRemainingCell data={{ bytesLimit: 1e12, bytesRemaining: -2e11 }} />);
        expect(screen.getByText('Over by 200 GB')).toBeInTheDocument();
        rerender(<QuotaRemainingCell data={{ bytesLimit: -1, bytesRemaining: null }} />);
        expect(screen.getByText('Unlimited')).toBeInTheDocument();
    });

    it('expands a global expression to its resolved RSEs', () => {
        render(<ResolvedRsesCell data={{ rseExpression: 'tier=1', resolvedRses: ['CERN-DISK', 'BNL-DISK'] }} />);
        expect(screen.getByText('tier=1')).toBeInTheDocument();
        expect(screen.queryByText('CERN-DISK')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /2 RSEs/ }));
        expect(screen.getByText('CERN-DISK')).toBeInTheDocument();
        expect(screen.getByText('BNL-DISK')).toBeInTheDocument();
    });
});

describe('AttributeKeyCell', () => {
    it('renders a badge for the admin attribute', () => {
        render(<AttributeKeyCell value="admin" />);
        expect(screen.getByText('admin')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders a badge for country attributes', () => {
        render(<AttributeKeyCell value="country-ch" />);
        expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders plain keys without a badge', () => {
        const { container } = render(<AttributeKeyCell value="sign-gcs" />);
        expect(container).toHaveTextContent(/^sign-gcs$/);
    });
});

describe('IdentityCell', () => {
    it('shows the identity in monospace with the full value as a tooltip', () => {
        const key = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK0wmN/Cr3JXqmLW7u+g9pTh+wyqDHpSQEIQczXkVx9q jdoe@host';
        render(<IdentityCell value={key} />);
        const text = screen.getByText(key);
        expect(text).toHaveAttribute('title', key);
        expect(text.className).toContain('font-mono');
    });
});
