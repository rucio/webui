import { LockState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';

const stateString: Record<LockState, string> = {
    O: 'OK',
    R: 'Replicating',
    S: 'Stuck',
    U: 'Unknown',
};

const stateColorClasses: Record<LockState, string> = {
    O: 'bg-base-success-500',
    R: 'bg-base-warning-400',
    S: 'bg-base-error-500',
    U: 'bg-neutral-0 dark:bg-neutral-900',
};

export const LockStateBadge = (props: { value: LockState; className?: string }) => {
    const classes = cn(stateColorClasses[props.value], props.className);
    return <Badge value={stateString[props.value]} className={classes} />;
};
