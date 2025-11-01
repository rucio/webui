import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center font-medium transition-colors border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
    {
        variants: {
            variant: {
                default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
                success: 'bg-base-success-100 dark:bg-base-success-900 text-base-success-900 dark:text-base-success-100 border-base-success-600 dark:border-base-success-500',
                error: 'bg-base-error-100 dark:bg-base-error-900 text-base-error-900 dark:text-base-error-100 border-base-error-600 dark:border-base-error-500',
                warning: 'bg-base-warning-100 dark:bg-base-warning-900 text-base-warning-900 dark:text-base-warning-100 border-base-warning-600 dark:border-base-warning-500',
                info: 'bg-brand-100 dark:bg-brand-900 text-brand-900 dark:text-brand-100 border-brand-600 dark:border-brand-500',
                neutral: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300',
            },
            size: {
                sm: 'text-xs px-2 py-0.5 rounded',
                md: 'text-sm px-3 py-1 rounded',
                lg: 'text-base px-4 py-1.5 rounded-md',
            },
            shape: {
                rounded: '',
                pill: 'rounded-full',
                square: 'rounded-none',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            shape: 'rounded',
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    value?: string;
    children?: React.ReactNode;
}

export const Badge = ({ value, children, className, variant, size, shape, ...props }: BadgeProps) => {
    return (
        <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
            {children || value}
        </div>
    );
};

export { badgeVariants };
