import { ReplicaState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const stateString: Record<ReplicaState, string> = {
    [ReplicaState.AVAILABLE]: 'Available',
    [ReplicaState.BAD]: 'Bad',
    [ReplicaState.BEING_DELETED]: 'Being Deleted',
    [ReplicaState.COPYING]: 'Copying',
    [ReplicaState.TEMPORARY_UNAVAILABLE]: 'Temporary Unavailable',
    [ReplicaState.UNAVAILABLE]: 'Unavailable',
    [ReplicaState.UNKNOWN]: 'Unknown',
};

/**
 * Maps replica states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - Available: Success (green) - Replica is accessible
 * - Copying: Info (brand purple) - Transfer in progress
 * - Temporary_Unavailable: Warning (amber) - Temporarily inaccessible
 * - Bad: Error (red) - Corrupted replica
 * - Being_Deleted: Error (red) - Deletion in progress
 * - Unavailable: Neutral (gray) - Not accessible
 * - Unknown: Neutral (gray) - Undefined state
 */
const stateVariants: Record<ReplicaState, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    [ReplicaState.AVAILABLE]: 'success',
    [ReplicaState.BAD]: 'error',
    [ReplicaState.BEING_DELETED]: 'error',
    [ReplicaState.COPYING]: 'info',
    [ReplicaState.TEMPORARY_UNAVAILABLE]: 'warning',
    [ReplicaState.UNAVAILABLE]: 'warning',
    [ReplicaState.UNKNOWN]: 'neutral',
};

export const ReplicaStateBadge = (props: { value: ReplicaState; className?: string }) => {
    return <Badge value={stateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
