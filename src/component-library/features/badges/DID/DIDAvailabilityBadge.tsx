import React from 'react';
import { DIDAvailability } from '@/lib/core/entity/rucio';
import { Badge } from '@/component-library/atoms/misc/Badge';

/**
 * Maps DID availability states to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - Available: Success (green) - DID is accessible
 * - Lost: Warning (amber) - DID temporarily unavailable
 * - Deleted: Error (red) - DID permanently removed
 * - Unknown: Neutral (gray) - Undefined state
 */
const typeVariants: Record<DIDAvailability, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    Unknown: 'neutral',
    Available: 'success',
    Deleted: 'error',
    Lost: 'warning',
};

export const DIDAvailabilityBadge = (props: { value: DIDAvailability; className?: string }) => {
    return <Badge value={props.value} variant={typeVariants[props.value]} className={props.className} />;
};
