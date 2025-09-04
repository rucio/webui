import { RuleNotification } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';

const notificationString: Record<RuleNotification, string> = {
    C: 'Close',
    N: 'No',
    P: 'Progress',
    Y: 'Yes',
};

const notificationColorClasses: Record<RuleNotification, string> = {
    Y: 'bg-base-success-500',
    P: 'bg-base-info-500',
    C: 'bg-base-warning-400',
    N: 'bg-base-error-500',
};

export const RuleNotificationBadge = (props: { value: RuleNotification; className?: string }) => {
    const classes = cn(notificationColorClasses[props.value], props.className);
    return <Badge value={notificationString[props.value]} className={classes}></Badge>;
};
