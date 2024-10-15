import { cn } from '@/component-library/utils';
import { Badge } from '@/component-library/atoms/misc/Badge';
import React from 'react';

export const NullBadge = (props: { className?: string }) => {
    const classes = cn('bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600', props.className);
    return <Badge value="null" className={classes} />;
};
