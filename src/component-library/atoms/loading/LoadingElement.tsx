import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';
import { LoadingSpinner } from './LoadingSpinner';

const loadingElementVariants = cva('flex items-center justify-center', {
    variants: {
        context: {
            page: 'min-h-screen w-full',
            section: 'w-full h-full min-h-[20rem]',
            card: 'w-full h-32',
            inline: 'inline-flex',
            fullscreen: 'h-screen w-screen',
        },
        withText: {
            true: 'flex-col gap-4',
            false: '',
        },
    },
    defaultVariants: {
        context: 'section',
        withText: false,
    },
});

export interface LoadingElementProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingElementVariants> {
    /**
     * Size of the spinner
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Variant/color of the spinner
     */
    variant?: 'default' | 'neutral' | 'success' | 'error' | 'warning';
    /**
     * Text to display below the spinner
     */
    text?: string;
    /**
     * Description text to display below the main text
     */
    description?: string;
}

/**
 * LoadingElement - A properly centered loading indicator
 *
 * This component wraps LoadingSpinner with appropriate centering for different contexts.
 * Use this instead of using LoadingSpinner directly to ensure consistent loading states
 * across the application.
 *
 * @example
 * ```tsx
 * // Full page loading
 * <LoadingElement context="page" text="Loading data..." />
 *
 * // Section/card loading
 * <LoadingElement context="section" size="lg" />
 *
 * // Inline loading
 * <LoadingElement context="inline" size="sm" text="Processing..." />
 * ```
 */
export const LoadingElement = ({
    className,
    context,
    withText,
    size = 'md',
    variant = 'default',
    text,
    description,
    ...props
}: LoadingElementProps) => {
    const hasText = Boolean(text || description);

    return (
        <div
            className={cn(loadingElementVariants({ context, withText: hasText || withText }), className)}
            role="status"
            aria-live="polite"
            {...props}
        >
            <LoadingSpinner size={size} variant={variant} />
            {hasText && (
                <div className="text-center space-y-1">
                    {text && <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{text}</p>}
                    {description && <p className="text-xs text-neutral-600 dark:text-neutral-400">{description}</p>}
                </div>
            )}
        </div>
    );
};
