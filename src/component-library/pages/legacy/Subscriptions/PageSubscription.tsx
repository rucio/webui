import { twMerge } from 'tailwind-merge';
import { Tabs } from '../../../atoms/legacy/Tabs/Tabs';
import { SubPage } from '../../../atoms/legacy/helpers/SubPage/SubPage';
import React, { useState } from 'react';
import { Titleth, Contenttd, Generaltable } from '../../../atoms/legacy/helpers/Metatable/Metatable';
import { DateTag } from '@/component-library/features/legacy/Tags/DateTag';
import { BoolTag } from '@/component-library/features/legacy/Tags/BoolTag';
import { SubscriptionStateTag } from '@/component-library/features/legacy/Tags/SubscriptionStateTag';
import { Accordion } from '../../../atoms/legacy/Accordion/Accordion';
import { Code } from '../../../atoms/legacy/text/content/Code/Code';
import { PageSubscriptionJSONEditor } from './PageSubscriptionJSONEditor';
import { Heading } from '@/component-library/pages/legacy/Helpers/Heading';
import { Body } from '@/component-library/pages/legacy/Helpers/Body';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { InfoField } from '@/component-library/features/fields/InfoField';

export interface PageSubscriptionPageProps {
    subscriptionViewModel: SubscriptionViewModel;
    editFilter: (filter: string) => void;
    editReplicationRules: (rules: string) => void;
}

export const PageSubscription = (props: PageSubscriptionPageProps) => {
    const [subpageIndex, setSubpageIndex] = useState<number>(0);
    const meta = props.subscriptionViewModel;
    return (
        <div className={twMerge('flex flex-col space-y-2 w-full')}>
            <InfoField>
                <span>This page is currently in development. We are working on improvements, so stay tuned!</span>
            </InfoField>
            <Heading
                className="text-text-1000 dark:text-text-0"
                title="View Subscription"
                subtitle={`For subscription ${props.subscriptionViewModel.name}`}
            />
            <Body>
                <Tabs
                    tabs={['Metadata', 'Edit Subscription']}
                    _ariaControls={['metadata', 'edit-subscription']}
                    active={0}
                    updateActive={active => {
                        setSubpageIndex(active);
                    }}
                />
                <SubPage show={subpageIndex === 0} id="subpage-metadata" aria-labelledby="tab-0" role="tabpanel">
                    <div className={twMerge('flex flex-col space-y-2', 'md:grid md:grid-cols-2 md:gap-2', 'w-full')}>
                        <div>
                            <Accordion name="Filter" className="p-1">
                                <Code>{meta.filter}</Code>
                            </Accordion>
                            <Accordion name="Replication Rules" className="p-1">
                                <Code>{meta.replication_rules}</Code>
                            </Accordion>
                        </div>
                        <div className={twMerge('bg-neutral-100 dark:bg-neutral-900 p-2 mt-2 rounded-md', 'flex flex-col space-y-2')}>
                            <Generaltable>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Name</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">{meta.name}</Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Account</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">{meta.account}</Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">ID</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">{meta.id}</Contenttd>
                                </tr>
                            </Generaltable>
                            <Generaltable>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Created At</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">
                                        <DateTag date={new Date(meta.created_at)} />
                                    </Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Last Processed</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">
                                        <DateTag date={new Date(meta.last_processed)} />
                                    </Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Updated At</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">
                                        <DateTag date={new Date(meta.updated_at)} />
                                    </Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Lifetime</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">
                                        <DateTag date={new Date(meta.lifetime)} />
                                    </Contenttd>
                                </tr>
                            </Generaltable>
                            <Generaltable>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">State</Titleth>
                                    <Contenttd>
                                        <SubscriptionStateTag state={meta.state} />
                                    </Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Retroactive</Titleth>
                                    <Contenttd>
                                        <BoolTag val={meta.retroactive} />
                                    </Contenttd>
                                </tr>
                                <tr>
                                    <Titleth className="text-text-1000 dark:text-text-0">Policy ID</Titleth>
                                    <Contenttd className="text-text-1000 dark:text-text-0">{meta.policyid}</Contenttd>
                                </tr>
                            </Generaltable>
                        </div>
                    </div>
                </SubPage>
                <SubPage show={subpageIndex === 1} id="subpage-edit-subscription" aria-labelledby="tab-1" role="tabpanel">
                    <div className="flex flex-col space-y-2">
                        <Accordion name="Filter" className="p-1">
                            <PageSubscriptionJSONEditor defaultString={meta.filter} submit={props.editFilter} />
                        </Accordion>
                        <Accordion name="Replication Rules" className="p-1">
                            <PageSubscriptionJSONEditor
                                defaultString={meta.replication_rules}
                                submit={props.editReplicationRules}
                            />
                        </Accordion>
                    </div>
                </SubPage>
            </Body>
        </div>
    );
};
