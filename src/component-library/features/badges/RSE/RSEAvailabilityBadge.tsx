import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';

export const RSEAvailabilityBadge = (props: { operation: string; className?: string }) => {
    const classes = cn('bg-neutral-200 dark:bg-neutral-800', props.className);
    return <Badge value={props.operation} className={classes} />;
};
