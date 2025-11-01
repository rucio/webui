import { RuleState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const stateString: Record<RuleState, string> = {
    [RuleState.REPLICATING]: 'Replicating',
    [RuleState.OK]: 'OK',
    [RuleState.STUCK]: 'Stuck',
    [RuleState.SUSPENDED]: 'Suspended',
    [RuleState.WAITING_APPROVAL]: 'Waiting',
    [RuleState.INJECT]: 'Inject',
    [RuleState.UNKNOWN]: 'Unknown',
};

/**
 * Maps rule states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - OK: Success (green) - Rule completed successfully
 * - REPLICATING: Warning (amber) - In progress
 * - STUCK: Error (red) - Failed state
 * - SUSPENDED: Neutral (gray) - Paused/inactive
 * - WAITING_APPROVAL: Info (brand purple) - Pending action
 * - INJECT: Info (brand purple) - Initial state
 * - UNKNOWN: Neutral (gray) - Undefined state
 */
const stateVariants: Record<RuleState, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    [RuleState.REPLICATING]: 'warning',
    [RuleState.OK]: 'success',
    [RuleState.STUCK]: 'error',
    [RuleState.SUSPENDED]: 'neutral',
    [RuleState.WAITING_APPROVAL]: 'info',
    [RuleState.INJECT]: 'info',
    [RuleState.UNKNOWN]: 'neutral',
};

export const RuleStateBadge = (props: { value: RuleState; className?: string }) => {
    return <Badge value={stateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
