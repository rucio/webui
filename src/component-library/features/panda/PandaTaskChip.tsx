'use client';

import * as React from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { Badge, badgeVariants } from '@/component-library/atoms/misc/Badge';

export interface PandaTaskChipProps {
    taskId: string;
    /** BigPanDA link; when absent the chip renders as plain text. */
    url?: string;
    isLoading?: boolean;
}

/** A PanDA task id rendered as a pill that links to BigPanDA (new tab). */
export const PandaTaskChip: React.FC<PandaTaskChipProps> = ({ taskId, url, isLoading = false }) => {
    if (!url) {
        return (
            <Badge variant="neutral" size="sm" shape="pill" className={cn('font-mono', isLoading && 'animate-pulse')} aria-busy={isLoading}>
                {taskId}
            </Badge>
        );
    }
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`PanDA task ${taskId}, opens BigPanDA in a new tab`}
            className={cn(
                badgeVariants({ variant: 'info', size: 'sm', shape: 'pill' }),
                'gap-1 font-mono no-underline hover:underline',
                'outline-none focus-visible:ring-1 focus-visible:ring-neutral-500',
            )}
        >
            {taskId}
            <HiExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
    );
};

PandaTaskChip.displayName = 'PandaTaskChip';
