import React from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

/**
 * Component which may be used as an AG Grid cell renderer.
 * It creates a clickable component which opens the specified URL in a new browser tab.
 * @param {string} props.href specified URL which opens after clicking the component.
 * @param {React.ReactNode} props.children the content displayed inside the clickable component.
 * @param {string} props.className optional additional styling of the component.
 * @returns Clickable component.
 */
export const ClickableCell = (props: { href: string; children: React.ReactNode; className?: string }) => {
    const onClick = () => {
        window.open(props.href, '_blank', 'noopener,noreferrer');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={cn('flex items-center cursor-pointer', props.className)}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <HiExternalLink className="shrink-0 text-lg mr-1 text-neutral-900 dark:text-neutral-100" />
            {props.children}
        </div>
    );
};
