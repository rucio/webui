/**
 * Get page title from pathname
 */
export function getPageTitle(pathname: string): string {
    // Remove leading slash and split by slashes
    const segments = pathname.replace(/^\//, '').split('/');

    // If empty, it's the home/dashboard
    if (segments.length === 0 || segments[0] === '') {
        return 'Dashboard';
    }

    // Map common routes to titles
    const routeMap: Record<string, string> = {
        dashboard: 'Dashboard',
        accounts: 'Accounts',
        account: 'Account',
        did: 'DIDs',
        rule: 'Rules',
        rse: 'RSEs',
        subscription: 'Subscriptions',
    };

    // Get the first segment as the base route
    const baseRoute = segments[0];
    const baseTitle = routeMap[baseRoute] || baseRoute;

    // Account detail pages are /account/<name>
    if (baseRoute === 'account' && segments.length > 1 && segments[1] !== '') {
        return `Account: ${decodeURIComponent(segments[1])}`;
    }

    // If it's a detail page (has more segments), try to extract name
    if (segments.length > 2 && segments[1] === 'page') {
        const itemName = decodeURIComponent(segments[2]);
        return `${baseTitle} - ${itemName}`;
    }

    // If it's a list page
    if (segments.length > 1 && segments[1] === 'list') {
        return `${baseTitle} List`;
    }

    // If it's a create page
    if (segments.length > 1 && segments[1] === 'create') {
        return `Create ${baseTitle.slice(0, -1)}`;
    }

    return baseTitle;
}
