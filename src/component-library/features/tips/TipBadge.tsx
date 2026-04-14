import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { HiQuestionMarkCircle, HiLightBulb } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

/**
 * TipBadge - A trigger button for contextual tips
 * Displays a help icon that users can click to see a tip
 *
 * @example
 * ```tsx
 * <TipBadge tipId="did-search-scope" onClick={() => showTip('did-search-scope')} />
 * <TipBadge size="lg" variant="highlighted" />
 * ```
 */

const tipBadgeVariants = cva(
    cn(
        'inline-flex items-center justify-center rounded-full',
        'cursor-pointer transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        'dark:focus:ring-offset-neutral-900',
    ),
    {
        variants: {
            size: {
                sm: 'h-4 w-4',
                md: 'h-5 w-5',
                lg: 'h-6 w-6',
            },
            variant: {
                default: cn(
                    'text-neutral-500 dark:text-neutral-400',
                    'hover:text-brand-500 dark:hover:text-brand-400',
                    'hover:bg-brand-100 dark:hover:bg-brand-900/50',
                ),
                subtle: cn('text-neutral-400 dark:text-neutral-500', 'hover:text-neutral-600 dark:hover:text-neutral-300'),
                highlighted: cn(
                    'text-brand-600 dark:text-brand-400',
                    'bg-brand-100 dark:bg-brand-900/50',
                    'hover:bg-brand-200 dark:hover:bg-brand-800/50',
                ),
                pulse: cn(
                    'text-brand-600 dark:text-brand-400',
                    'bg-brand-100 dark:bg-brand-900/50',
                    'animate-pulse',
                    'hover:animate-none hover:bg-brand-200 dark:hover:bg-brand-800/50',
                ),
            },
        },
        defaultVariants: {
            size: 'md',
            variant: 'default',
        },
    },
);

const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

export interface TipBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof tipBadgeVariants> {
    /** The tip ID this badge is associated with */
    tipId?: string;
    /** Use lightbulb icon instead of question mark */
    useLightbulb?: boolean;
}

export const TipBadge = React.forwardRef<HTMLButtonElement, TipBadgeProps>(
    ({ className, size = 'md', variant, tipId, useLightbulb = false, ...props }, ref) => {
        const Icon = useLightbulb ? HiLightBulb : HiQuestionMarkCircle;
        const iconSize = iconSizeClasses[size || 'md'];

        return (
            <button
                ref={ref}
                type="button"
                className={cn(tipBadgeVariants({ size, variant }), className)}
                aria-label={tipId ? `Show tip: ${tipId}` : 'Show tip'}
                data-tip-id={tipId}
                {...props}
            >
                <Icon className={iconSize} aria-hidden="true" />
            </button>
        );
    },
);

TipBadge.displayName = 'TipBadge';
