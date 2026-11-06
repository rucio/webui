import { LockState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { lockStateString } from '@/lib/core/entity/state-to-string';

/**
 * Maps lock states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - OK: Success (green) - Lock completed successfully
 * - Replicating: Warning (amber) - Lock in progress
 * - Stuck: Error (red) - Lock failed
 * - Unknown: Neutral (gray) - Undefined state
 */
const stateVariants: Record<LockState, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    [LockState.OK]: 'success',
    [LockState.REPLICATING]: 'warning',
    [LockState.STUCK]: 'error',
    [LockState.UNKNOWN]: 'neutral',
};

export const LockStateBadge = (props: { value: LockState; className?: string }) => {
    return <Badge value={lockStateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
