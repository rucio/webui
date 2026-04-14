import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { HiX, HiInformationCircle, HiCheckCircle, HiExclamationCircle, HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { Tip, TipVariant } from '@/lib/infrastructure/tips/tip-registry';

/**
 * TipCard - A card component for displaying tip content
 * Used in both popovers and the global tips panel
 *
 * @example
 * ```tsx
 * <TipCard tip={tip} onDismiss={() => dismissTip(tip.id)} />
 * <TipCard tip={tip} compact showDismissButton={false} />
 * ```
 */

const tipCardVariants = cva(cn('relative rounded-lg border', 'flex items-start gap-3', 'transition-colors duration-150'), {
    variants: {
        variant: {
            info: cn(
                'bg-base-info-50 dark:bg-base-info-950',
                'border-base-info-200 dark:border-base-info-800',
                'text-base-info-900 dark:text-base-info-100',
            ),
            success: cn(
                'bg-base-success-50 dark:bg-base-success-950',
                'border-base-success-200 dark:border-base-success-800',
                'text-base-success-900 dark:text-base-success-100',
            ),
            warning: cn(
                'bg-base-warning-50 dark:bg-base-warning-950',
                'border-base-warning-200 dark:border-base-warning-800',
                'text-base-warning-900 dark:text-base-warning-100',
            ),
        },
        compact: {
            true: 'p-3',
            false: 'p-4',
        },
        dismissed: {
            true: 'opacity-50',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'info',
        compact: false,
        dismissed: false,
    },
});

const iconVariants = cva('shrink-0', {
    variants: {
        variant: {
            info: 'text-base-info-600 dark:text-base-info-400',
            success: 'text-base-success-600 dark:text-base-success-400',
            warning: 'text-base-warning-600 dark:text-base-warning-400',
        },
        size: {
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
        },
    },
    defaultVariants: {
        variant: 'info',
        size: 'md',
    },
});

const getIcon = (variant: TipVariant | undefined) => {
    switch (variant) {
        case 'success':
            return HiCheckCircle;
        case 'warning':
            return HiExclamationCircle;
        case 'info':
        default:
            return HiInformationCircle;
    }
};

export interface TipCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof tipCardVariants> {
    /** The tip to display */
    tip: Tip;
    /** Whether to show the dismiss button */
    showDismissButton?: boolean;
    /** Callback when dismiss button is clicked */
    onDismiss?: () => void;
    /** Whether the tip has been dismissed */
    isDismissed?: boolean;
}

export const TipCard = React.forwardRef<HTMLDivElement, TipCardProps>(
    ({ className, tip, compact = false, showDismissButton = true, onDismiss, isDismissed = false, ...props }, ref) => {
        const variant = tip.variant || 'info';
        const Icon = tip.icon || getIcon(variant);
        const iconSize = compact ? 'sm' : 'md';

        return (
            <div
                ref={ref}
                className={cn(tipCardVariants({ variant, compact, dismissed: isDismissed }), className)}
                role="note"
                aria-label={tip.title}
                {...props}
            >
                <Icon className={iconVariants({ variant, size: iconSize })} aria-hidden="true" />

                <div className="flex-1 min-w-0">
                    <h4 className={cn('font-semibold leading-tight', compact ? 'text-sm' : 'text-sm')}>{tip.title}</h4>

                    <p className={cn('mt-1 leading-relaxed', compact ? 'text-xs' : 'text-sm', 'opacity-90')}>{tip.content}</p>

                    {tip.learnMoreUrl && (
                        <a
                            href={tip.learnMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'inline-flex items-center gap-1 mt-2',
                                compact ? 'text-xs' : 'text-sm',
                                'font-medium underline underline-offset-2',
                                'hover:opacity-80 transition-opacity',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 rounded',
                            )}
                        >
                            Learn more
                            <HiExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                    )}
                </div>

                {showDismissButton && tip.dismissible !== false && onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className={cn(
                            'shrink-0 rounded p-1',
                            'hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10',
                            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
                            'transition-colors duration-150',
                        )}
                        aria-label={`Dismiss tip: ${tip.title}`}
                    >
                        <HiX className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                    </button>
                )}
            </div>
        );
    },
);

TipCard.displayName = 'TipCard';
