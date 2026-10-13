import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { IdentityType } from '@/lib/core/entity/account';
import { AccountStatusBadge } from '@/component-library/features/badges/account/AccountStatusBadge';
import { AccountTypeBadge } from '@/component-library/features/badges/account/AccountTypeBadge';
import { IdentityTypeBadge } from '@/component-library/features/badges/account/IdentityTypeBadge';

const EM_DASH = String.fromCharCode(0x2014);
type V = 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

// A class unique to each variant (tailwind-merge drops overridden shared classes).
const MARKER: Record<V, string> = {
    default: 'bg-neutral-100',
    success: 'bg-base-success-100',
    error: 'bg-base-error-100',
    warning: 'bg-base-warning-100',
    info: 'bg-brand-100',
    neutral: 'bg-neutral-200',
};

const expectBadge = (label: string, variant: V) => {
    const el = screen.getByText(label);
    expect(el.className).toContain(MARKER[variant]);
    expect(el.textContent).not.toContain(EM_DASH);
};

describe('AccountStatusBadge', () => {
    const cases: [AccountStatus, string, V][] = [
        [AccountStatus.ACTIVE, 'Active', 'success'],
        [AccountStatus.SUSPENDED, 'Suspended', 'warning'],
        [AccountStatus.DELETED, 'Deleted', 'error'],
        [AccountStatus.UNKNOWN, 'Unknown', 'neutral'],
    ];
    it.each(cases)('renders %s', (value, label, variant) => {
        render(<AccountStatusBadge value={value} />);
        expectBadge(label, variant);
    });
});

describe('AccountTypeBadge', () => {
    const cases: [AccountType, string, V][] = [
        [AccountType.USER, 'User', 'info'],
        [AccountType.GROUP, 'Group', 'neutral'],
        [AccountType.SERVICE, 'Service', 'default'],
        [AccountType.UNKNOWN, 'Unknown', 'neutral'],
    ];
    it.each(cases)('renders %s', (value, label, variant) => {
        render(<AccountTypeBadge value={value} />);
        expectBadge(label, variant);
    });
});

describe('IdentityTypeBadge', () => {
    const cases: [IdentityType, string, V][] = [
        [IdentityType.X509, 'X509', 'info'],
        [IdentityType.GSS, 'GSS', 'default'],
        [IdentityType.USERPASS, 'Userpass', 'warning'],
        [IdentityType.SSH, 'SSH', 'neutral'],
        [IdentityType.SAML, 'SAML', 'neutral'],
        [IdentityType.OIDC, 'OIDC', 'success'],
        [IdentityType.UNKNOWN, 'Unknown', 'neutral'],
    ];
    it.each(cases)('renders %s', (value, label, variant) => {
        render(<IdentityTypeBadge value={value} />);
        expectBadge(label, variant);
    });

    it('covers every enum value', () => {
        expect(cases.map(c => c[0]).sort()).toEqual(Object.values(IdentityType).sort());
    });
});
