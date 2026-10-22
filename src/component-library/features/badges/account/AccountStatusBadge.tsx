import React from 'react';
import { Badge, BadgeProps } from '@/component-library/atoms/misc/Badge';
import { AccountStatus } from '@/lib/core/entity/rucio';

type Variant = NonNullable<BadgeProps['variant']>;

export const ACCOUNT_STATUS_BADGES: Record<AccountStatus, { label: string; variant: Variant }> = {
    [AccountStatus.ACTIVE]: { label: 'Active', variant: 'success' },
    [AccountStatus.SUSPENDED]: { label: 'Suspended', variant: 'warning' },
    [AccountStatus.DELETED]: { label: 'Deleted', variant: 'error' },
    [AccountStatus.UNKNOWN]: { label: 'Unknown', variant: 'neutral' },
};

export const AccountStatusBadge = (props: { value: AccountStatus; className?: string }) => {
    const { label, variant } = ACCOUNT_STATUS_BADGES[props.value] ?? ACCOUNT_STATUS_BADGES[AccountStatus.UNKNOWN];
    return <Badge value={label} variant={variant} className={props.className} />;
};
