import { ReplicaState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const stateString: Record<ReplicaState, string> = {
    Available: 'Available',
    Bad: 'Bad',
    Being_Deleted: 'Being Deleted',
    Copying: 'Copying',
    Temporary_Unavailable: 'Temporary Unavailable',
    Unavailable: 'Unavailable',
    Unknown: 'Unknown',
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
    Available: 'success',
    Bad: 'error',
    Being_Deleted: 'error',
    Copying: 'info',
    Temporary_Unavailable: 'warning',
    Unavailable: 'warning',
    Unknown: 'neutral',
};

export const ReplicaStateBadge = (props: { value: ReplicaState; className?: string }) => {
    return <Badge value={stateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
