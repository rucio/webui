import React from 'react';
import { cn } from '@/component-library/utils';

const CircleWithText = ({ text, className, onClick }: { text: string; onClick?: () => void; className?: string }) => {
    const classes = cn(
        'flex items-center justify-center',
        'w-12 h-12 rounded-full',
        'text-neutral-100',
        'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
        className,
        onClick ? 'cursor-pointer' : '',
    );

    return (
        <div className={classes} onClick={onClick}>
            <span className="text-lg">{text}</span>
        </div>
    );
};

export default CircleWithText;
