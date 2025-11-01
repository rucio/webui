import React from 'react';
import { RSEType } from '@/lib/core/entity/rucio';
import { Badge } from '@/component-library/atoms/misc/Badge';

/**
 * Maps RSE types to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - DISK: Success (green) - Fast, online storage
 * - TAPE: Info (brand purple) - Archive, offline storage
 * - UNKNOWN: Warning (amber) - Undefined storage type
 */
const typeVariants: Record<RSEType, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    DISK: 'success',
    TAPE: 'info',
    UNKNOWN: 'warning',
};

export const RSETypeBadge = (props: { value: RSEType; className?: string }) => {
    return <Badge value={props.value} variant={typeVariants[props.value]} className={props.className} />;
};
