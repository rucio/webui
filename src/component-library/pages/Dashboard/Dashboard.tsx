'use client';

import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { getSiteHeader } from '@/app/(rucio)/queries';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { AccountRoleBadge } from '@/component-library/features/badges/account/AccountRoleBadge';
import { TopRulesWidget } from '@/component-library/pages/Dashboard/widgets/TopRulesWidget';
import { useEffect, useRef, useState } from 'react';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import useStreamReader, { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { TopStorageUsageWidget } from '@/component-library/pages/Dashboard/widgets/TopStorageUsageWidget';

const AccountHeading = () => {
    const querySiteHeader = async () => {
        const viewModel = await getSiteHeader();
        if (viewModel.status !== 'success') throw new Error(viewModel.message);
        return viewModel;
    };

    const headerQueryKey = ['site_header'];
    const {
        data: header,
        error: headerError,
        isFetching: isHeaderFetching,
    } = useQuery<SiteHeaderViewModel, Error>({
        queryKey: headerQueryKey,
        queryFn: querySiteHeader,
        enabled: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
    });

    if (isHeaderFetching) return <LoadingSpinner />;

    if (headerError || !header?.activeAccount) {
        return (
            <WarningField>
                <span>Error loading information about the account: {headerError?.message}</span>
            </WarningField>
        );
    }

    return (
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-800 rounded-lg shadow-sm border border-brand-200 dark:border-brand-700 p-6 sm:p-8 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-600 dark:bg-brand-500 text-neutral-0 shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-700 dark:text-brand-200 mb-1">
                        Welcome back
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 dark:text-brand-100 truncate">
                            {header.activeAccount.rucioAccount}
                        </h2>
                        <AccountRoleBadge className="text-base" value={header.activeAccount.role} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsageView = () => {
    const usageBuffer = useRef<RSEAccountUsageViewModel[] | undefined>([]);
    const [usages, setUsages] = useState<RSEAccountUsageViewModel[]>();
    const { start, stop, error, status } = useStreamReader<RSEAccountUsageViewModel>();

    useEffect(() => {
        // TODO: handle error view models
        start({
            url: '/api/feature/list-account-rse-usage',
            onData: data => {
                if (!usageBuffer.current) {
                    usageBuffer.current = data;
                } else {
                    usageBuffer.current.push(...data);
                }
            },
        });
        usageBuffer.current = [];
    }, []);

    useEffect(() => {
        if (status === StreamingStatus.STOPPED && usageBuffer.current) {
            setUsages(usageBuffer.current);
        }
    }, [status]);

    const isLoading = (!usages && !error) || status === StreamingStatus.RUNNING;

    return <TopStorageUsageWidget usages={usages} isLoading={isLoading} errorMessage={error?.message} />;
};

const RulesView = () => {
    const rulesBuffer = useRef<RuleViewModel[] | undefined>([]);
    const [rules, setRules] = useState<RuleViewModel[]>();
    const { start, stop, error, status } = useStreamReader<RuleViewModel>();

    const getCreatedAfterDate = () => {
        // Only the rules that were created less than 15 days ago should get loaded
        const now = new Date();
        const fifteenDaysAgo = new Date(now.setDate(now.getDate() - 15));
        return fifteenDaysAgo.toISOString();
    };

    useEffect(() => {
        // TODO: handle error view models
        const params = new URLSearchParams({
            scope: '*',
            created_after: getCreatedAfterDate(),
        });
        start({
            url: '/api/feature/list-rules?' + params.toString(),
            onData: data => {
                if (!rulesBuffer.current) {
                    rulesBuffer.current = data;
                } else {
                    rulesBuffer.current.push(...data);
                }
            },
        });
        rulesBuffer.current = [];
    }, []);

    useEffect(() => {
        if (status === StreamingStatus.STOPPED && rulesBuffer.current) {
            setRules(rulesBuffer.current);
        }
    }, [status]);

    const isLoading = (!rules && !error) || status === StreamingStatus.RUNNING;

    return <TopRulesWidget rules={rules} isLoading={isLoading} errorMessage={error?.message} />;
};

export const Dashboard = () => {
    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                        Overview of your Rucio environment
                    </p>
                </header>

                {/* User Info Section */}
                <section className="mb-8" aria-label="User information">
                    <AccountHeading />
                </section>

                {/* Main Content */}
                <div className="space-y-8">
                    <section aria-label="Rule locks chart">
                        <RulesView />
                    </section>

                    <section aria-label="RSE usage">
                        <UsageView />
                    </section>
                </div>
            </div>
        </main>
    );
};
