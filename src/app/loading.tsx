import { LoadingPage } from '@/component-library/pages/system/LoadingPage';

/**
 * Loading page for the Rucio WebUI
 *
 * Displayed during route transitions throughout the application.
 * Automatically rendered by Next.js during page loads and route changes.
 *
 * @component
 * @example
 * // Automatically displayed by Next.js during route transitions
 */
export default function Loading() {
    return <LoadingPage />;
}
