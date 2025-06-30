import React from 'react';
import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

export const ClickableCell = (props: { href: string; children: React.ReactNode; className?: string }) => {
    const onClick = () => {
        window.open(props.href, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={cn('flex items-center cursor-pointer', props.className)} onClick={onClick}>
            <HiExternalLink className="flex-shrink-0 text-lg mr-1 text-neutral-900 dark:text-neutral-100" />
            {props.children}
        </div>
    );
};
