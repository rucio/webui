import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/component-library/utils';

const inputVariants = cva(
    cn(
        'flex w-full rounded-md',
        'border',
        'px-3 py-2',
        'text-neutral-900 dark:text-neutral-100',
        'placeholder:text-neutral-500',
        'focus:ring-0',
        'focus:outline-none',
        'transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
    ),
    {
        variants: {
            variant: {
                default: cn(
                    'border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                    'bg-neutral-100 dark:bg-neutral-800',
                    'focus:shadow-brand',
                    'focus:border-1 focus:border-brand-500',
                    'dark:focus:border-1 dark:focus:border-brand-500',
                ),
                error: cn(
                    'border-base-error-600 dark:border-base-error-500',
                    'bg-base-error-50 dark:bg-base-error-950',
                    'focus:shadow-none',
                    'focus:border-2 focus:border-base-error-600',
                    'dark:focus:border-2 dark:focus:border-base-error-500',
                ),
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    onEnterKey?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, error, onEnterKey, onKeyDown, ...props }, ref) => {
        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && onEnterKey) {
                onEnterKey(event);
            }
            // Call the base callback
            if (onKeyDown) {
                onKeyDown(event);
            }
        };

        const computedVariant = error ? 'error' : variant;

        return (
            <input
                type={type}
                className={cn(inputVariants({ variant: computedVariant }), 'h-10', className)}
                ref={ref}
                onKeyDown={handleKeyDown}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof inputVariants> {
    error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant, error, ...props }, ref) => {
    const computedVariant = error ? 'error' : variant;

    return (
        <textarea
            className={cn(inputVariants({ variant: computedVariant }), 'h-40', className)}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Input, Textarea, inputVariants };
