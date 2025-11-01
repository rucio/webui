import * as React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/component-library/features/layout/PageContainer';
import { RucioLogo } from '@/component-library/atoms/branding/RucioLogo';
import { AnimatedBackground } from '@/component-library/atoms/branding/AnimatedBackground';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Button } from '@/component-library/atoms/form/button';

export interface NotFoundPageProps {
    /**
     * The 404 code to display
     * @default "404"
     */
    code?: string;
    /**
     * Heading text below the 404 code
     * @default "Page not found"
     */
    heading?: string;
    /**
     * Help message to display
     * @default "The page you're looking for doesn't exist or has been moved."
     */
    message?: string;
    /**
     * URL to navigate to when return button is clicked
     * @default "/"
     */
    returnUrl?: string;
    /**
     * Label for the return button
     * @default "Return to Home"
     */
    returnLabel?: string;
    /**
     * Size of the logo
     * @default 146
     */
    logoSize?: number;
    /**
     * Whether to show animated background
     * @default true
     */
    showAnimatedBackground?: boolean;
    /**
     * Additional CSS classes for the container
     */
    className?: string;
}

/**
 * NotFoundPage component
 *
 * A full-page 404 error state with the Rucio logo, animated background, and navigation.
 * Used by Next.js for non-existent routes and can be used in Storybook for testing.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <NotFoundPage />
 *
 * // Custom message and return URL
 * <NotFoundPage
 *   heading="Resource Not Found"
 *   message="The dataset you're looking for could not be found."
 *   returnUrl="/datasets"
 *   returnLabel="Browse Datasets"
 * />
 *
 * // Without animated background
 * <NotFoundPage showAnimatedBackground={false} />
 * ```
 */
export const NotFoundPage = React.forwardRef<HTMLDivElement, NotFoundPageProps>(
    (
        {
            code = '404',
            heading = 'Page not found',
            message = "The page you're looking for doesn't exist or has been moved.",
            returnUrl = '/',
            returnLabel = 'Return to Home',
            logoSize = 146,
            showAnimatedBackground = true,
            className,
        },
        ref,
    ) => {
        return (
            <div ref={ref} className={`relative min-h-screen ${className || ''}`}>
                {/* Animated Background */}
                {showAnimatedBackground && <AnimatedBackground />}

                <PageContainer centered={true} className="relative z-10 min-h-screen flex items-center justify-center">
                    <div
                        className="flex flex-col items-center justify-center space-y-8 text-center"
                        role="alert"
                        aria-live="polite"
                        aria-label="Page not found"
                    >
                        {/* Rucio Logo */}
                        <RucioLogo
                            width={logoSize}
                            height={logoSize}
                            className="text-brand-500 dark:text-brand-400"
                            aria-label="Rucio Logo"
                        />

                        {/* 404 Heading */}
                        <div className="space-y-4">
                            <h1 className="text-neutral-900 dark:text-neutral-100 text-6xl sm:text-7xl md:text-8xl font-bold">{code}</h1>

                            <Heading text={heading} size="md" className="text-neutral-700 dark:text-neutral-300" />
                        </div>

                        {/* Help Message */}
                        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-md">{message}</p>

                        {/* Call to Action */}
                        <Link href={returnUrl} className="mt-4">
                            <Button variant="default" size="lg" aria-label={returnLabel}>
                                {returnLabel}
                            </Button>
                        </Link>
                    </div>
                </PageContainer>
            </div>
        );
    },
);

NotFoundPage.displayName = 'NotFoundPage';
