import { twMerge } from "tailwind-merge";
import { H3 } from "../../Text/Headings/H3";
import { Tabs } from "../../Tabs/Tabs";
import { SubPage } from "../../Helpers/SubPage";
import { useState } from "react";
import { Titletd, Contenttd, Generaltable } from "../../Helpers/Metatable";
import { SubscriptionMeta } from "@/lib/core/entity/rucio";
import { DateTag } from "../../Tags/DateTag";
import { BoolTag } from "../../Tags/BoolTag";
import { SubscriptionStateTag } from "../../Tags/SubscriptionStateTag";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { Collapsible } from "../../Helpers/Collapsible";
import { Accordion } from "../../Helpers/Accordion";
import { Code } from "../../Text/Content/Code";
import { AreaInput } from "../../Input/AreaInput";
import { Button } from "../../Button/Button";
import { PageSubscriptionJSONEditor } from "./PageSubscriptionJSONEditor";
import { Type } from "@sinclair/typebox";
import { SubscriptionFilter, SubscriptionReplicationRules } from "@/lib/core/entity/subscription";

export interface PageSubscriptionPageProps {
    subscriptionMeta: SubscriptionMeta
    editFilter: (filter: string) => void
    editReplicationRules: (rules: string) => void
}

export const PageSubscription = (
    props: PageSubscriptionPageProps
) => {
    const [subpageIndex, setSubpageIndex] = useState<number>(0);
    const meta = props.subscriptionMeta
    return (
        <div
            className={twMerge("flex flex-col space-y-2 w-full")}
        >
            <div
                className={twMerge(
                    "rounded-md w-full",
                    "border dark:border-2 dark:border-gray-200 p-2",
                    "flex flex-col items-start space-y-2",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <div
                    className={twMerge(
                        "flex flex-col space-y-2 lg:flex-row lg:justify-between lg:items-baseline lg:space-y-0 w-full",
                        "bg-white dark:bg-gray-800"
                    )}
                >
                    <span className="flex flex-row justify-between space-x-4">
                        <H3>Subscription Page for {props.subscriptionMeta.name}</H3>
                    </span>
                </div>
            </div>
            <div
                className={twMerge(
                    "min-w-0",
                    "lg:col-span-2",
                    "flex flex-col",
                    "rounded-md p-2 border",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <Tabs
                    tabs={["Metadata", "Edit Subscription"]}
                    _ariaControls={["metadata", "edit-subscription"]}
                    active={0}
                    updateActive={active => { setSubpageIndex(active) }}
                />
                <SubPage
                    show={subpageIndex === 0}
                    id="subpage-metadata"
                    aria-labelledby="tab-0"
                    role="tabpanel"
                >
                    <div
                        className={twMerge(
                            "flex flex-col space-y-2",
                            "md:grid md:grid-cols-2 md:gap-2",
                            "w-full",
                        )}
                    >
                        <div>
                            <Accordion name="Filter" className="p-1">
                                <Code>
                                    {meta.filter}
                                </Code>
                            </Accordion>
                            <Accordion name="Replication Rules" className="p-1">
                                <Code>
                                    {meta.replication_rules}
                                </Code>
                            </Accordion>
                        </div>
                        <div
                            className={twMerge(
                                "bg-stone-100 dark:bg-gray-900 p-2 mt-2 rounded-md",
                                "flex flex-col space-y-2"
                            )}
                        >
                            <Generaltable>
                                <tr>
                                    <Titletd>Name</Titletd>
                                    <Contenttd>{meta.name}</Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Account</Titletd>
                                    <Contenttd>{meta.account}</Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Comments</Titletd>
                                    <Contenttd>{meta.comments}</Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>ID</Titletd>
                                    <Contenttd>{meta.id}</Contenttd>
                                </tr>
                            </Generaltable>
                            <Generaltable>
                                <tr>
                                    <Titletd>Created At</Titletd>
                                    <Contenttd><DateTag date={meta.created_at} /></Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Last Processed</Titletd>
                                    <Contenttd><DateTag date={meta.last_processed} /></Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Updated At</Titletd>
                                    <Contenttd><DateTag date={meta.updated_at} /></Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Lifetime</Titletd>
                                    <Contenttd><DateTag date={meta.lifetime} /></Contenttd>
                                </tr>
                            </Generaltable>
                            <Generaltable>
                                <tr>
                                    <Titletd>State</Titletd>
                                    <Contenttd><SubscriptionStateTag state={meta.state} /></Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Retroactive</Titletd>
                                    <Contenttd><BoolTag val={meta.retroactive} /></Contenttd>
                                </tr>
                                <tr>
                                    <Titletd>Policy ID</Titletd>
                                    <Contenttd>{meta.policyid}</Contenttd>
                                </tr>
                            </Generaltable>
                        </div>
                    </div>
                </SubPage>
                <SubPage
                    show={subpageIndex === 1}
                    id="subpage-edit-subscription"
                    aria-labelledby="tab-1"
                    role="tabpanel"
                >
                    <div className="flex flex-col space-y-2">
                        <Accordion name="Filter" className="p-1">
                            <PageSubscriptionJSONEditor
                                defaultString={meta.filter}
                                submit={props.editFilter}
                                schema={SubscriptionFilter}
                            />
                        </Accordion>
                        <Accordion name="Replication Rules" className="p-1">
                            <PageSubscriptionJSONEditor
                                defaultString={meta.replication_rules}
                                submit={props.editReplicationRules}
                                schema={SubscriptionReplicationRules}
                            />
                        </Accordion>
                    </div>
                </SubPage>
            </div>
        </div>
    );
};
