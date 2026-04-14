'use client';

import * as React from 'react';
import { cn } from '@/component-library/utils';

export interface DetailActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

/**
 * A horizontal action bar for detail pages. Place between the page heading and tabs/content.
 * Renders action buttons in a responsive flex row with consistent spacing.
 *
 * @example
 * ```tsx
 * <DetailActions>
 *     <Button variant="error" onClick={() => setDeleteOpen(true)}>Delete Rule</Button>
 *     <Button variant="default" onClick={() => setBoostOpen(true)}>Boost Rule</Button>
 * </DetailActions>
 * ```
 */
export const DetailActions: React.FC<DetailActionsProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-2',
                'rounded-lg',
                'bg-neutral-100/50 dark:bg-neutral-800/50',
                'border border-neutral-200 dark:border-neutral-700',
                'px-4 py-3',
                className,
            )}
            role="toolbar"
            aria-label="Actions"
            {...props}
        >
            {children}
        </div>
    );
};
