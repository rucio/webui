import { LockState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const stateString: Record<LockState, string> = {
    O: 'OK',
    R: 'Replicating',
    S: 'Stuck',
    U: 'Unknown',
};

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
    O: 'success',
    R: 'warning',
    S: 'error',
    U: 'neutral',
};

export const LockStateBadge = (props: { value: LockState; className?: string }) => {
    return <Badge value={stateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
