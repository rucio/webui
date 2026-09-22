import React from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
import { Badge } from '@/component-library/atoms/misc/Badge';

/**
 * Maps DID types to semantic badge variants from the design system.
 *
 * Semantic color assignments:
 * - File: Error (red) - Most granular data unit
 * - Dataset: Success (green) - Collection of files
 * - Container: Info (brand purple) - Contains datasets
 * - Collection: Warning (amber) - Special grouping
 * - Derived: Info (brand purple) - Computed/derived data
 * - All/Unknown: Neutral (gray) - Default/undefined states
 */
const typeVariants: Record<DIDType, 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
    [DIDType.ALL]: 'neutral',
    [DIDType.COLLECTION]: 'warning',
    [DIDType.CONTAINER]: 'info',
    [DIDType.DATASET]: 'success',
    [DIDType.DERIVED]: 'info',
    [DIDType.FILE]: 'error',
    [DIDType.UNKNOWN]: 'neutral',
};

export const DIDTypeBadge = (props: { value: DIDType; className?: string }) => {
    return <Badge value={props.value} variant={typeVariants[props.value]} className={props.className} />;
};
