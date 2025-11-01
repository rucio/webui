'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/component-library/pages/system/ErrorPage';

/**
 * Error boundary for the Rucio WebUI
 *
 * Catches and displays errors that occur throughout the application.
 * Provides options to retry the failed action or return to the dashboard.
 * Automatically rendered by Next.js when an error occurs.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error that was thrown
 * @param {() => void} props.reset - Function to reset the error boundary and retry
 *
 * @example
 * // Automatically rendered by Next.js when an error occurs
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log error to console for debugging
        console.error('Application error:', {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
        });
    }, [error]);

    return <ErrorPage errorMessage={error.message} errorDigest={error.digest} onRetry={reset} />;
}
