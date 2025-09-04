import { RuleGrouping } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { cn } from '@/component-library/utils';

const groupingString: Record<RuleGrouping, string> = {
    A: 'All',
    D: 'Dataset',
    N: 'None',
};

const groupingColorClasses: Record<RuleGrouping, string> = {
    A: 'bg-base-success-500',
    D: 'bg-base-warning-400',
    N: 'bg-base-error-500',
};

export const RuleGroupingBadge = (props: { value: RuleGrouping; className?: string }) => {
    const classes = cn(groupingColorClasses[props.value], props.className);
    return <Badge value={groupingString[props.value]} className={classes} />;
};
