import React from 'react';
import { Badge, BadgeProps } from '@/component-library/atoms/misc/Badge';
import { IdentityType } from '@/lib/core/entity/account';

type Variant = NonNullable<BadgeProps['variant']>;

export const IDENTITY_TYPE_BADGES: Record<IdentityType, { label: string; variant: Variant }> = {
    [IdentityType.X509]: { label: 'X509', variant: 'info' },
    [IdentityType.GSS]: { label: 'GSS', variant: 'default' },
    [IdentityType.USERPASS]: { label: 'Userpass', variant: 'warning' },
    [IdentityType.SSH]: { label: 'SSH', variant: 'neutral' },
    [IdentityType.SAML]: { label: 'SAML', variant: 'neutral' },
    [IdentityType.OIDC]: { label: 'OIDC', variant: 'success' },
    [IdentityType.UNKNOWN]: { label: 'Unknown', variant: 'neutral' },
};

export const IdentityTypeBadge = (props: { value: IdentityType; className?: string }) => {
    const { label, variant } = IDENTITY_TYPE_BADGES[props.value] ?? IDENTITY_TYPE_BADGES[IdentityType.UNKNOWN];
    return <Badge value={label} variant={variant} className={props.className} />;
};
