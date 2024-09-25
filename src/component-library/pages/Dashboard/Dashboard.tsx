import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { getSiteHeader } from '@/app/(rucio)/queries';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { AccountRoleBadge } from '@/component-library/features/badges/account/AccountRoleBadge';
import { TopRulesWidget } from '@/component-library/pages/Dashboard/widgets/TopRulesWidget';
import { useEffect, useState } from 'react';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import useStreamReader, { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';

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
        <div className="flex space-x-2 items-center">
            <Heading text={`Hello, ${header.activeAccount.rucioAccount}!`} />
            <AccountRoleBadge className="text-xl" value={header.activeAccount.role} />
        </div>
    );
};

const RulesView = () => {
    const [rules, setRules] = useState<RuleViewModel[]>([]);
    const { start, stop, error, status } = useStreamReader<RuleViewModel>();

    useEffect(() => {
        setTimeout(() => {
            start({
                url: '/api/feature/list-rules?scope=*',
                onData: data => {
                    setRules(prevState => [...prevState, ...data]);
                },
            });
        }, 1000);
    }, []);

    useEffect(() => {}, [status]);

    return <TopRulesWidget rules={rules} isLoading={status === StreamingStatus.RUNNING} errorMessage={error?.message} />;
};

export const Dashboard = () => {
    // Widget with top 10 rses

    // Widgets handle fetching themselves

    return (
        <div className="flex flex-col space-y-2 w-full">
            <div className="h-14">
                <AccountHeading />
            </div>
            <RulesView />
        </div>
    );
};
