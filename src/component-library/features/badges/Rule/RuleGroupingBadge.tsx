import { RuleGrouping } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const groupingString: Record<RuleGrouping, string> = {
    A: 'All',
    D: 'Dataset',
    N: 'None',
};

/**
 * Maps rule grouping types to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - All: Info (brand purple) - Grouped by all files
 * - Dataset: Success (green) - Grouped by dataset
 * - None: Neutral (gray) - No grouping
 */
const groupingVariants: Record<RuleGrouping, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    A: 'info',
    D: 'success',
    N: 'neutral',
};

export const RuleGroupingBadge = (props: { value: RuleGrouping; className?: string }) => {
    return <Badge value={groupingString[props.value]} variant={groupingVariants[props.value]} className={props.className} />;
};
