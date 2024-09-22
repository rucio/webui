import React from 'react';
import { RSEType } from '@/lib/core/entity/rucio';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { twMerge } from 'tailwind-merge';

const typeColorClasses: Record<RSEType, string> = {
    DISK: 'bg-base-info-500',
    TAPE: 'bg-extra-rose-500',
    UNKNOWN: 'bg-base-warning-400',
};

export const RSETypeBadge = (props: { value: RSEType; className?: string }) => {
    const classes = twMerge(typeColorClasses[props.value], props.className);
    return <Badge value={props.value} className={classes} />;
};
