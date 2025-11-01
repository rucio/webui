import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const progressBarVariants = cva('rounded-full w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-900 border-opacity-10 dark:border-none overflow-hidden', {
    variants: {
        size: {
            sm: 'h-1.5',
            md: 'h-2.5',
            lg: 'h-4',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const progressFillVariants = cva('h-full rounded-full transition-all duration-300 ease-in-out', {
    variants: {
        variant: {
            default: 'bg-brand-600 bg-opacity-80 dark:bg-opacity-60',
            success: 'bg-base-success-600 bg-opacity-80 dark:bg-opacity-60',
            error: 'bg-base-error-600 bg-opacity-80 dark:bg-opacity-60',
            warning: 'bg-base-warning-600 bg-opacity-80 dark:bg-opacity-60',
        },
        indeterminate: {
            true: 'animate-pulse',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'success',
        indeterminate: false,
    },
});

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressBarVariants> {
    percentage?: number;
    variant?: 'default' | 'success' | 'error' | 'warning';
    indeterminate?: boolean;
    showLabel?: boolean;
}

export default function ProgressBar({ className, percentage = 0, size, variant, indeterminate = false, showLabel = false, ...props }: ProgressBarProps) {
    const validPercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <div className="w-full space-y-1">
            <div
                className={cn(progressBarVariants({ size }), className)}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : validPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={indeterminate ? 'Loading' : `${validPercentage}% complete`}
                {...props}
            >
                <div
                    className={cn(progressFillVariants({ variant, indeterminate }))}
                    style={{ width: indeterminate ? '100%' : `${validPercentage}%` }}
                />
            </div>
            {showLabel && !indeterminate && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 text-right">{validPercentage}%</p>
            )}
        </div>
    );
}

export { ProgressBar };
