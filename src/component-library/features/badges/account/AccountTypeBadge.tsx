import React from 'react';
import { Badge, BadgeProps } from '@/component-library/atoms/misc/Badge';
import { AccountType } from '@/lib/core/entity/rucio';

type Variant = NonNullable<BadgeProps['variant']>;

export const ACCOUNT_TYPE_BADGES: Record<AccountType, { label: string; variant: Variant }> = {
    [AccountType.USER]: { label: 'User', variant: 'default' },
    [AccountType.GROUP]: { label: 'Group', variant: 'info' },
    [AccountType.SERVICE]: { label: 'Service', variant: 'warning' },
    [AccountType.UNKNOWN]: { label: 'Unknown', variant: 'neutral' },
};

export const AccountTypeBadge = (props: { value: AccountType; className?: string }) => {
    const { label, variant } = ACCOUNT_TYPE_BADGES[props.value] ?? ACCOUNT_TYPE_BADGES[AccountType.UNKNOWN];
    return <Badge value={label} variant={variant} className={props.className} />;
};
