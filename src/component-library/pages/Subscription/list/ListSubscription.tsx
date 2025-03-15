import { useEffect, useState } from 'react';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { ListSubscriptionTable } from '@/component-library/pages/Subscription/list/ListSubscriptionTable';
import { getSiteHeader } from '@/app/(rucio)/queries';

type ListSubscriptionProps = {
    initialData?: SubscriptionRuleStatesViewModel[];
};

export const ListSubscription = (props: ListSubscriptionProps) => {
    const [accountName, setAccountName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<SubscriptionRuleStatesViewModel>([]);
    const [startedStreaming, setStartedStreaming] = useState(false);

    useEffect(() => {
        const fetchSiteHeader = async () => {
            try {
                setIsLoading(true);
                const data: SiteHeaderViewModel = await getSiteHeader();
                if (data && data.activeAccount) {
                    setAccountName(data.activeAccount.rucioAccount);
                    setError(null);
                } else {
                    setError('No active account found');
                    toast({
                        variant: 'warning',
                        title: 'Warning',
                        description: 'No active account found',
                    });
                }
            } catch (error) {
                setError('Failed to retrieve account information');
                toast({
                    variant: 'error',
                    title: 'Error',
                    description: 'Failed to retrieve account information',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSiteHeader();
    }, [toast]);

    useEffect(() => {
        if (!accountName || accountName === 'Unknown' || !gridApi || startedStreaming) return;

        const fetchSubscriptionData = async () => {
            try {
                startStreaming('/api/feature/list-subscription-rule-states');
                setStartedStreaming(true);
            } catch (error) {
                toast({
                    variant: 'error',
                    title: 'Error',
                    description: 'Failed to retrieve subscription data',
                });
            }
        };

        fetchSubscriptionData();

        return () => {
            stopStreaming();
        };
    }, [accountName, gridApi, startStreaming, stopStreaming, toast, startedStreaming]);

    if (isLoading) {
        return (
            <InfoField>
                <span>Loading account information...</span>
            </InfoField>
        );
    }

    if (error || !accountName) {
        return (
            <WarningField>
                <span>{error || 'Failed to load account information'}</span>
            </WarningField>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Subscriptions" />
            <Heading size="sm" text={`for account ${accountName}`} />
            <div className="flex flex-col md:flex-1">
                <ListSubscriptionTable account={accountName} streamingHook={streamingHook} onGridReady={onGridReady} />
            </div>
        </div>
    );
};
