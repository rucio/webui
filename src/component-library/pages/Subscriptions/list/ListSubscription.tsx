import { ListSubscriptionTable } from '@/component-library/pages/Subscriptions/list/ListSubscriptionTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';

type ListSubscriptionProps = {
    initialData?: SubscriptionRuleStatesViewModel[];
};

export const ListSubscription = (props: ListSubscriptionProps) => {
    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<SubscriptionRuleStatesViewModel>(props.initialData);

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Subscriptions" />
            <ListSubscriptionTable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
