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
        <div className="flex space-x-2 items-center">
            <Heading text={`Hello, ${header.activeAccount.rucioAccount}!`} />
            <AccountRoleBadge className="text-xl" value={header.activeAccount.role} />
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

    useEffect(() => {
        // TODO: handle error view models
        start({
            url: '/api/feature/list-rules?scope=*',
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
        <div className="flex flex-col space-y-3 w-full">
            <div className="h-14">
                <AccountHeading />
            </div>
            <RulesView />
            <UsageView />
        </div>
    );
};
