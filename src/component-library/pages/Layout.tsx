'use client';

import React, { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderClient } from '@/component-library/features/layout/HeaderClient';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { addRecentPage } from '@/lib/utils/recent-pages-storage';
import { getPageTitle } from '@/lib/utils/page-title';

type LayoutProps = {
    children: ReactNode;
    siteHeader?: SiteHeaderViewModel;
    siteHeaderError?: Error;
};

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
            <main id="main-content" className="flex flex-col grow px-4 py-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 min-w-0 overflow-x-hidden">
                {children}
            </main>
            <Toaster />
        </div>
    );
};
