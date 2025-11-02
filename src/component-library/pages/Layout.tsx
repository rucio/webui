'use client';

import React, { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderClient } from '@/component-library/features/layout/HeaderClient';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { addRecentPage } from '@/lib/utils/recent-pages-storage';

type LayoutProps = {
    children: ReactNode;
    siteHeader?: SiteHeaderViewModel;
    siteHeaderError?: Error;
};

/**
 * Get page title from pathname
 */
function getPageTitle(pathname: string): string {
    // Remove leading slash and split by slashes
    const segments = pathname.replace(/^\//, '').split('/');

    // If empty, it's the home/dashboard
    if (segments.length === 0 || segments[0] === '') {
        return 'Dashboard';
    }

    // Map common routes to titles
    const routeMap: Record<string, string> = {
        dashboard: 'Dashboard',
        did: 'DIDs',
        rule: 'Rules',
        rse: 'RSEs',
        subscription: 'Subscriptions',
    };

    // Get the first segment as the base route
    const baseRoute = segments[0];
    const baseTitle = routeMap[baseRoute] || baseRoute;

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

/**
 * Client layout component that provides the main page structure.
 * Site header data is provided by the server layout component.
 * Tracks page visits for the command palette's recent pages feature.
 */
export const Layout = ({ children, siteHeader, siteHeaderError }: LayoutProps) => {
    const pathname = usePathname();

    // Track page visits
    useEffect(() => {
        if (pathname) {
            const title = getPageTitle(pathname);
            addRecentPage(pathname, title);
        }
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderClient siteHeader={siteHeader} siteHeaderError={siteHeaderError} isSiteHeaderFetching={false} />
            <main id="main-content" className="flex flex-col grow px-4 py-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-48 3xl:px-64">
                {children}
            </main>
            <Toaster />
        </div>
    );
};
