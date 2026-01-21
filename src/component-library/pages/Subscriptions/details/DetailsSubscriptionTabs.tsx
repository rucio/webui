import { useState } from 'react';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { cn } from '@/component-library/utils';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { DetailsSubscriptionView } from './views/DetailsSubscriptionView';
import { DetailsSubscriptionFilter } from './views/DetailsSubscriptionFilter';
import { DetailsSubscriptionRules } from './views/DetailsSubscriptionRules';

type DetailsSubscriptionTabsProps = {
    account: string;
    name: string;
    meta: SubscriptionViewModel;
};

export const DetailsSubscriptionTabs = ({ account, name, meta }: DetailsSubscriptionTabsProps) => {
    const tabNames = ['Filter', 'Replication Rules'];
    const [activeIndex, setActiveIndex] = useState(0);

    // Map tab names to view components
    const allTabs: Map<string, DetailsSubscriptionView> = new Map([
        ['Filter', DetailsSubscriptionFilter],
        ['Replication Rules', DetailsSubscriptionRules],
    ]);

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
            {tabNames.map((tabName, index) => {
                const ViewComponent = allTabs.get(tabName);
                if (!ViewComponent) return null;

                const visibilityClass = index === activeIndex ? 'flex' : 'hidden';
                const viewClasses = cn('flex-col h-[calc(100vh-22rem)]', visibilityClass);

                return (
                    <div key={tabName} className={viewClasses}>
                        <ViewComponent account={account} name={name} meta={meta} />
                    </div>
                );
            })}
        </>
    );
};
