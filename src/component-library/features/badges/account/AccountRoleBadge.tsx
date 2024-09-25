import { RuleState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';
import { Role } from '@/lib/core/entity/account';

const stateColorClasses: Record<Role, string> = {
    Admin: 'bg-base-success-500',
    User: 'bg-base-neutral-0 dark:bg-base-neutral-900',
};

export const AccountRoleBadge = (props: { value: Role; className?: string }) => {
    const classes = cn(stateColorClasses[props.value], props.className);
    return <Badge value={props.value.toString()} className={classes} />;
};
