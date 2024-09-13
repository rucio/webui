import { twMerge } from 'tailwind-merge';
import React from 'react';

export const Badge = ({ value, className, ...props }: { value: string; className?: string }) => {
    const badgeClasses = twMerge(
        'inline',
        'rounded',
        'px-3',
        'text-neutral-900 dark:text-neutral-100',
        'bg-opacity-50',
        'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
        className,
    );

    return (
        <div className={badgeClasses} {...props}>
            {value}
        </div>
    );
};
