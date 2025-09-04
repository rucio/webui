import React from 'react';
import { DIDAvailability } from '@/lib/core/entity/rucio';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { twMerge } from 'tailwind-merge';

const typeColorClasses: Record<DIDAvailability, string> = {
    Unknown: 'bg-neutral-0 dark:bg-neutral-900',
    Available: 'bg-base-success-500',
    Deleted: 'bg-base-error-500',
    Lost: 'bg-base-warning-400',
};

export const DIDAvailabilityBadge = (props: { value: DIDAvailability; className?: string }) => {
    const classes = twMerge(typeColorClasses[props.value], props.className);
    return <Badge value={props.value} className={classes} />;
};
