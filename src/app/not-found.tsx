import { NotFoundPage } from '@/component-library/pages/system/NotFoundPage';

/**
 * 404 Not Found page for the Rucio WebUI
 *
 * Displayed when a user navigates to a route that doesn't exist.
 * Features an animated background, Rucio branding, and clear navigation.
 * Automatically rendered by Next.js for non-existent routes.
 *
 * @component
 * @example
 * // Automatically rendered by Next.js for non-existent routes
 */
export default function NotFound() {
    return <NotFoundPage />;
}
