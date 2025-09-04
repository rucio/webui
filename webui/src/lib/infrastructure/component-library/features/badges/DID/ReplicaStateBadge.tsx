import { ReplicaState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';

const stateString: Record<ReplicaState, string> = {
    Available: 'Available',
    Bad: 'Bad',
    Being_Deleted: 'Being Deleted',
    Copying: 'Copying',
    Temporary_Unavailable: 'Temporary Unavailable',
    Unavailable: 'Unavailable',
    Unknown: 'Unknown',
};

const stateColorClasses: Record<ReplicaState, string> = {
    Available: 'bg-base-success-500',
    Bad: 'bg-base-error-500',
    Being_Deleted: 'bg-base-error-300',
    Copying: 'bg-base-info-500',
    Temporary_Unavailable: 'bg-base-warning-400',
    Unavailable: 'bg-neutral-0 dark:bg-neutral-800',
    Unknown: 'bg-neutral-0 dark:bg-neutral-800',
};

export const ReplicaStateBadge = (props: { value: ReplicaState; className?: string }) => {
    const classes = cn(stateColorClasses[props.value], props.className);
    return <Badge value={stateString[props.value]} className={classes} />;
};
