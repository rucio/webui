import { cn } from '@/component-library/utils';
import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';
import { ReactNode } from 'react';

const headerCommonClasses = cn(
    'h-[52px] px-4 py-2 space-x-2',
    'bg-neutral-200 dark:bg-neutral-700',
    'border-b border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
    'text-neutral-700 dark:text-neutral-300 font-medium',
    'flex grow items-center w-full',
    'whitespace-nowrap',
);

export const KeyValueLinkHeader = ({ href, children }: { href: string; children: ReactNode }) => {
    const onClick = () => {
        window.open(href, '_blank', 'noopener,noreferrer');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className={cn(headerCommonClasses, 'hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer')}
        >
            <HiExternalLink className="h-5 w-5" />
            {children}
        </div>
    );
};

export const KeyValueHeader = ({ href, children }: { href: string; children: ReactNode }) => {
    return <div className={headerCommonClasses}>{children}</div>;
};
