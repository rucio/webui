import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { DetailsSubscriptionFilter } from './views/DetailsSubscriptionFilter';
import { DetailsSubscriptionRules } from './views/DetailsSubscriptionRules';

type DetailsSubscriptionSectionsProps = {
    account: string;
    name: string;
    meta: SubscriptionViewModel;
};

export const DetailsSubscriptionSections = ({ account, name, meta }: DetailsSubscriptionSectionsProps) => {
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Filter Section */}
            <section className="col-span-12 lg:col-span-5">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-6 flex flex-col h-[calc(100vh-28rem)]">
                    <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                        Filter
                    </h3>
                    <div className="flex-1 min-h-0">
                        <DetailsSubscriptionFilter account={account} name={name} meta={meta} />
                    </div>
                </div>
            </section>

            {/* Rules Section */}
            <section className="col-span-12 lg:col-span-7">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-6 flex flex-col h-[calc(100vh-28rem)]">
                    <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                        Replication Rules
                    </h3>
                    <div className="flex-1 min-h-0">
                        <DetailsSubscriptionRules account={account} name={name} meta={meta} />
                    </div>
                </div>
            </section>
        </div>
    );
};
