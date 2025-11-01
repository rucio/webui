import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { HiOutlineRefresh } from 'react-icons/hi';

import { cn } from '@/component-library/utils';

const buttonVariants = cva(
    cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-md border border-neutral-900 border-opacity-10 dark:border-none',
        'font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        'bg-opacity-90 dark:bg-opacity-70 hover:bg-opacity-90 dark:hover:bg-opacity-70',
    ),
    {
        variants: {
            variant: {
                default: 'bg-opacity-80 bg-brand-600 text-neutral-100 hover:bg-brand-700 dark:hover:bg-brand-500',
                success: 'bg-base-success-600 text-neutral-100 hover:bg-base-success-700 dark:hover:bg-base-success-500',
                error: 'bg-base-error-600 text-neutral-100 hover:bg-base-error-700 dark:hover:bg-base-error-500',
                neutral:
                    'bg-neutral-300 text-neutral-900 dark:bg-opacity-90 dark:bg-neutral-700 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-6 w-6 rounded',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <HiOutlineRefresh className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                {children}
            </button>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
