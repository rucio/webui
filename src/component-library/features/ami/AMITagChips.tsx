'use client';

import * as React from 'react';
import { cn } from '@/component-library/utils';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { AMITagInfo } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import { AMITagPopover } from './AMITagPopover';

export interface AMITagChipsProps {
    /** Tags in DID-name order. */
    tags: string[];
    /** Server results; when absent the chips render as plain text. */
    infos?: AMITagInfo[];
    isLoading?: boolean;
}

export const AMITagChips: React.FC<AMITagChipsProps> = ({ tags, infos, isLoading = false }) => {
    return (
        <div className="flex flex-wrap items-center gap-2" aria-busy={isLoading}>
            {tags.map(tag => {
                const info = infos?.find(i => i.tag === tag);
                if (info) return <AMITagPopover key={tag} info={info} />;
                return (
                    <Badge key={tag} variant="neutral" size="sm" shape="pill" className={cn('font-mono', isLoading && 'animate-pulse')}>
                        {tag}
                    </Badge>
                );
            })}
        </div>
    );
};

AMITagChips.displayName = 'AMITagChips';
