import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { HiX, HiExclamationCircle, HiInformationCircle, HiCheckCircle } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

/**
 * Alert component for displaying important messages to users.
 * Follows WCAG AAA contrast requirements and supports dark mode.
 *
 * @example
 * ```tsx
 * <Alert variant="error" message="Invalid credentials" onClose={() => {}} />
 * <Alert variant="success" message="Login successful" />
 * ```
 */

const alertVariants = cva(cn('relative w-full rounded-md border p-4', 'flex items-start gap-3', 'transition-colors duration-150'), {
    variants: {
        variant: {
            error: cn(
                'bg-base-error-50 dark:bg-base-error-950',
                'border-base-error-200 dark:border-base-error-800',
                'text-base-error-900 dark:text-base-error-100',
            ),
            warning: cn(
                'bg-base-warning-50 dark:bg-base-warning-950',
                'border-base-warning-200 dark:border-base-warning-800',
                'text-base-warning-900 dark:text-base-warning-100',
            ),
            success: cn(
                'bg-base-success-50 dark:bg-base-success-950',
                'border-base-success-200 dark:border-base-success-800',
                'text-base-success-900 dark:text-base-success-100',
            ),
            info: cn(
                'bg-base-info-50 dark:bg-base-info-950',
                'border-base-info-200 dark:border-base-info-800',
                'text-base-info-900 dark:text-base-info-100',
            ),
        },
    },
    defaultVariants: {
        variant: 'info',
    },
});

const iconVariants = cva('h-5 w-5 shrink-0', {
    variants: {
        variant: {
            // WCAG AAA compliant colors
            error: 'text-base-error-600 dark:text-base-error-400',
            warning: 'text-base-warning-700 dark:text-base-warning-400',
            success: 'text-base-success-600 dark:text-base-success-400',
            info: 'text-base-info-700 dark:text-base-info-400',
        },
    },
    defaultVariants: {
        variant: 'info',
    },
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    message: string;
    onClose?: () => void;
    showIcon?: boolean;
}

const getIcon = (variant: 'error' | 'warning' | 'success' | 'info' | null | undefined) => {
    switch (variant) {
        case 'error':
            return HiExclamationCircle;
        case 'warning':
            return HiExclamationCircle;
        case 'success':
            return HiCheckCircle;
        case 'info':
        default:
            return HiInformationCircle;
    }
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, message, onClose, showIcon = true, ...props }, ref) => {
    const Icon = getIcon(variant);

    return (
        <div ref={ref} role="alert" aria-live="polite" aria-atomic="true" className={cn(alertVariants({ variant }), className)} {...props}>
            {showIcon && <Icon className={iconVariants({ variant })} aria-hidden="true" />}
            <div className="flex-1 text-sm font-medium leading-5">{message}</div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                        'shrink-0 rounded p-1',
                        'hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                        'transition-colors duration-150',
                    )}
                    aria-label="Close alert"
                >
                    <HiX className="h-4 w-4" />
                </button>
            )}
        </div>
    );
});

Alert.displayName = 'Alert';
