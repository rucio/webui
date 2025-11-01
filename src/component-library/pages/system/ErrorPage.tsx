'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/component-library/features/layout/PageContainer';
import { Section } from '@/component-library/features/layout/Section';
import { RucioLogo } from '@/component-library/atoms/branding/RucioLogo';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Button } from '@/component-library/atoms/form/button';

export interface ErrorPageProps {
    /**
     * Error heading text
     * @default "Something went wrong"
     */
    heading?: string;
    /**
     * Error message to display
     */
    errorMessage?: string;
    /**
     * Error digest/ID for tracking
     */
    errorDigest?: string;
    /**
     * Callback function when "Try Again" is clicked
     */
    onRetry?: () => void;
    /**
     * URL to navigate to when "Return" button is clicked
     * @default "/dashboard"
     */
    returnUrl?: string;
    /**
     * Label for the return button
     * @default "Return to Dashboard"
     */
    returnLabel?: string;
    /**
     * Size of the logo
     * @default 100
     */
    logoSize?: number;
    /**
     * Additional CSS classes for the container
     */
    className?: string;
    /**
     * Help text to display at the bottom
     */
    helpText?: string;
}

/**
 * ErrorPage component
 *
 * A full-page error state with the Rucio logo, error message, and action buttons.
 * Used by Next.js error boundaries and can be used in Storybook for testing.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ErrorPage errorMessage="Failed to load data" onRetry={() => window.location.reload()} />
 *
 * // Custom heading and return URL
 * <ErrorPage
 *   heading="Network Error"
 *   errorMessage="Unable to connect to server"
 *   returnUrl="/home"
 *   returnLabel="Return to Home"
 * />
 * ```
 */
export const ErrorPage = React.forwardRef<HTMLDivElement, ErrorPageProps>(
    (
        {
            heading = 'Something went wrong',
            errorMessage = 'An unexpected error occurred while processing your request.',
            errorDigest,
            onRetry,
            returnUrl = '/dashboard',
            returnLabel = 'Return to Dashboard',
            logoSize = 100,
            className,
            helpText = 'If this error persists, please contact your system administrator or check the browser console for more details.',
        },
        ref,
    ) => {
        return (
            <PageContainer ref={ref} centered={true} className={`min-h-screen flex items-center justify-center ${className || ''}`}>
                <Section className="max-w-2xl mx-auto text-center" role="alert" aria-live="assertive" aria-label="Application error">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Rucio Logo */}
                        <RucioLogo
                            width={logoSize}
                            height={logoSize}
                            className="text-base-error-500 dark:text-base-error-400"
                            aria-label="Rucio Logo"
                        />

                        {/* Error Heading */}
                        <div className="space-y-2">
                            <Heading text={heading} size="lg" className="text-base-error-500 dark:text-base-error-400" />

                            {/* Error Message */}
                            <p className="text-base text-neutral-600 dark:text-neutral-400">{errorMessage}</p>

                            {/* Error Digest (if available) */}
                            {errorDigest && <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono">Error ID: {errorDigest}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center mt-4">
                            {onRetry && (
                                <Button
                                    variant="default"
                                    size="default"
                                    onClick={onRetry}
                                    className="w-full sm:w-auto"
                                    aria-label="Try again and reload the page"
                                >
                                    Try Again
                                </Button>
                            )}

                            <Link href={returnUrl} className="w-full sm:w-auto">
                                <Button variant="neutral" size="default" className="w-full" aria-label={returnLabel}>
                                    {returnLabel}
                                </Button>
                            </Link>
                        </div>

                        {/* Help Text */}
                        {helpText && <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-8">{helpText}</p>}
                    </div>
                </Section>
            </PageContainer>
        );
    },
);

ErrorPage.displayName = 'ErrorPage';
