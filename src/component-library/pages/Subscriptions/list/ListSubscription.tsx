import { ListSubscriptionTable } from '@/component-library/pages/Subscriptions/list/ListSubscriptionTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useEffect, useState } from 'react';

type ListSubscriptionProps = {
    initialData?: SubscriptionRuleStatesViewModel[];
};

export const ListSubscription = (props: ListSubscriptionProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming } = useTableStreaming<SubscriptionRuleStatesViewModel>(props.initialData);
    const [startedStreaming, setStartedStreaming] = useState(false);

    useEffect(() => {
        if (gridApi !== null && !startedStreaming) {
            startStreaming('/api/feature/list-subscription-rule-states');
            setStartedStreaming(true);
        }
    }, [gridApi, startStreaming]);

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Subscriptions" />
            <ListSubscriptionTable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
