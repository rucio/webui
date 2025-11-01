import { RuleNotification } from '@/lib/core/entity/rucio';
import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

const notificationString: Record<RuleNotification, string> = {
    C: 'Close',
    N: 'No',
    P: 'Progress',
    Y: 'Yes',
};

/**
 * Maps rule notification states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - Yes: Success (green) - Notifications enabled
 * - Progress: Info (brand purple) - Progress notifications
 * - Close: Warning (amber) - Close notifications only
 * - No: Error (red) - Notifications disabled
 */
const notificationVariants: Record<RuleNotification, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    Y: 'success',
    P: 'info',
    C: 'warning',
    N: 'error',
};

export const RuleNotificationBadge = (props: { value: RuleNotification; className?: string }) => {
    return <Badge value={notificationString[props.value]} variant={notificationVariants[props.value]} className={props.className} />;
};
