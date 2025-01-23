'use client';

import React, { ReactNode } from 'react';
import { Header } from '@/component-library/features/layout/Header';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

type LayoutProps = {
    children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    const siteHeaderQueryKey = ['site-header'];
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const querySiteHeader = async () => {
        const url = '/api/feature/get-site-header';

        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();
        if (validator.isValid(json)) return json;
        return null;
    };

    const {
        data: siteHeaderViewModel,
        error: siteHeaderError,
        isFetching: isSiteHeaderFetching,
    } = useQuery<SiteHeaderViewModel>({
        queryKey: siteHeaderQueryKey,
        queryFn: querySiteHeader,
        enabled: true,
        retry: false,
        refetchOnWindowFocus: false,
    });

    return (
        <div className="min-h-screen flex flex-col bg-neutral-0 dark:bg-neutral-900">
            <Header siteHeader={siteHeaderViewModel} siteHeaderError={siteHeaderError} isSiteHeaderFetching={isSiteHeaderFetching} />
            <main className="flex flex-col grow px-4 py-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-48 3xl:px-64">{children}</main>
            <Toaster />
        </div>
    );
};
