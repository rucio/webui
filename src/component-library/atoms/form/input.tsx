import * as React from 'react';

import { cn } from '@/component-library/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onEnterKey?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, onEnterKey, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onEnterKey) {
            onEnterKey(event);
        }
        // Call the base callback
        if (onKeyDown) {
            onKeyDown(event);
        }
    };

    return (
        <input
            type={type}
            className={cn(
                'flex w-full rounded-md',
                'h-10',
                'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'rounded-md',
                'bg-neutral-100 dark:bg-neutral-800',
                'px-3 py-2',
                'text-neutral-900 dark:text-neutral-100',
                'placeholder:text-neutral-500',
                'focus:ring-0 focus:shadow-brand',
                'focus:outline-none focus:border-1 focus:border-brand-500',
                'dark:focus:border-1 dark:focus:border-brand-500',
                className,
            )}
            ref={ref}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };