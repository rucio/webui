import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const spinnerVariants = cva('animate-spin', {
    variants: {
        size: {
            sm: 'h-4 w-4',
            md: 'h-6 w-6',
            lg: 'h-8 w-8',
            xl: 'h-12 w-12',
        },
        variant: {
            default: 'text-brand-600 dark:text-brand-500',
            neutral: 'text-neutral-900 dark:text-neutral-100',
            success: 'text-base-success-600 dark:text-base-success-500',
            error: 'text-base-error-600 dark:text-base-error-500',
            warning: 'text-base-warning-600 dark:text-base-warning-500',
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'default',
    },
});

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement>, VariantProps<typeof spinnerVariants> {}

export const LoadingSpinner = ({ className, size, variant, ...props }: LoadingSpinnerProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(spinnerVariants({ size, variant }), className)}
            role="status"
            aria-label="Loading"
            {...props}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};
