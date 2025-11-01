import React from 'react';
import { Badge } from '@/component-library/atoms/misc/Badge';

/**
 * RSE Availability Badge - displays RSE operation status.
 * Uses neutral variant as operations are informational, not status-based.
 */
export const RSEAvailabilityBadge = (props: { operation: string; className?: string }) => {
    return <Badge value={props.operation} variant="neutral" className={props.className} />;
};
