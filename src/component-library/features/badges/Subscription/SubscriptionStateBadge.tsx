import { SubscriptionState } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const stateString: Record<SubscriptionState, string> = {
    [SubscriptionState.ACTIVE]: 'Active',
    [SubscriptionState.INACTIVE]: 'Inactive',
    [SubscriptionState.NEW]: 'New',
    [SubscriptionState.UPDATED]: 'Updated',
    [SubscriptionState.BROKEN]: 'Broken',
    [SubscriptionState.UNKNOWN]: 'Unknown',
};

/**
 * Maps subscription states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - UPDATED: Success (green) - Most common state, subscription has created rules
 * - ACTIVE: Info (brand purple) - Subscription is active and running
 * - NEW: Info (brand purple) - New subscription (tied to retroactive option)
 * - INACTIVE: Neutral (gray) - Subscription is disabled
 * - BROKEN: Error (red) - Subscription is in error state
 * - UNKNOWN: Neutral (gray) - Undefined state
 */
const stateVariants: Record<SubscriptionState, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    [SubscriptionState.UPDATED]: 'success',
    [SubscriptionState.ACTIVE]: 'info',
    [SubscriptionState.NEW]: 'info',
    [SubscriptionState.INACTIVE]: 'neutral',
    [SubscriptionState.BROKEN]: 'error',
    [SubscriptionState.UNKNOWN]: 'neutral',
};

export const SubscriptionStateBadge = (props: { value: SubscriptionState; className?: string }) => {
    return <Badge value={stateString[props.value]} variant={stateVariants[props.value]} className={props.className} />;
};
