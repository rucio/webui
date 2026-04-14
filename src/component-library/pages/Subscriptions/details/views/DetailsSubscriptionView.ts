import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';

export type DetailsSubscriptionProps = {
    account: string;
    name: string;
    meta: SubscriptionViewModel;
};

export type DetailsSubscriptionView = (props: DetailsSubscriptionProps) => React.ReactElement;
