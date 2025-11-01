import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const fieldVariants = cva(
    'flex items-center rounded px-3 py-1 transition-colors border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
    {
        variants: {
            variant: {
                default: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100',
                subtle: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
                brand: 'bg-brand-100 dark:bg-brand-900 text-brand-900 dark:text-brand-100 border-brand-600 dark:border-brand-500',
                success: 'bg-base-success-100 dark:bg-base-success-900 text-base-success-900 dark:text-base-success-100 border-base-success-600 dark:border-base-success-500',
                error: 'bg-base-error-100 dark:bg-base-error-900 text-base-error-900 dark:text-base-error-100 border-base-error-600 dark:border-base-error-500',
                warning: 'bg-base-warning-100 dark:bg-base-warning-900 text-base-warning-900 dark:text-base-warning-100 border-base-warning-600 dark:border-base-warning-500',
            },
            size: {
                sm: 'text-xs px-2 py-0.5',
                md: 'text-sm px-3 py-1',
                lg: 'text-base px-4 py-2',
            },
            fullWidth: {
                true: 'w-full',
                false: 'w-fit',
            },
            truncate: {
                true: 'whitespace-nowrap overflow-hidden text-ellipsis',
                false: 'overflow-x-auto whitespace-nowrap',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            fullWidth: false,
            truncate: false,
        },
    },
);

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof fieldVariants> {}

export const Field = ({ className, variant, size, fullWidth, truncate, children, ...props }: FieldProps) => {
    return (
        <div className={cn(fieldVariants({ variant, size, fullWidth, truncate }), className)} {...props}>
            {children}
        </div>
    );
};

export { fieldVariants };
