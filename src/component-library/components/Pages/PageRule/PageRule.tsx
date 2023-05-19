import { useState, useEffect } from "react"

import { twMerge } from "tailwind-merge";
var format = require("date-format")

import { RuleMeta, RuleNotification } from "@/lib/core/entity/rucio";
import { LockState } from "@/lib/core/entity/rucio";
import { Tabs } from "../../Tabs/Tabs";
import { SubPage } from "../../Helpers/SubPage";
import { H3 } from "../../Text/Headings/H3";
import { BoolTag } from "../../Tags/BoolTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { RuleStateTag } from "../../Tags/RuleStateTag";
import { LockStateTag } from "../../Tags/LockStateTag";
import { RuleNotificationTag } from "../../Tags/RuleNotificationTag";

export interface PageRulePageProps {
    ruleMeta: RuleMeta;
}

const Titletd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "font-bold w-28 md:w-48 pl-1 dark:text-white",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}
const Contenttd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "break-all dark:text-gray-100 pr-1",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}

const Ruletable: React.FC<JSX.IntrinsicElements["table"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <table
            className={twMerge(
                "bg-white dark:bg-gray-700",
                "w-full rounded border-separate border-spacing-y-1",
                className ?? ""
            )}
            {...otherprops}
        >
            <tbody className="w-full">
                {props.children}
            </tbody>
        </table>
    )
}

export const PageRule = (
    props: PageRulePageProps
) => {
    const [subpageIndex, setSubpageIndex] = useState(0);
    const meta = props.ruleMeta;
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
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
                        <H3>Rule Page for {props.ruleMeta.scope}:{props.ruleMeta.name}</H3>
                    </span>
                </div>

            </div>
            <div
                className={twMerge(
                    "min-w-0",
                    "lg:col-span-2",
                    "flex flex-col",
                    "rounded-md p-2 border"
                )}
            >
                <Tabs
                    tabs={
                        ["Metadata", "Locks"]
                    } // remember difference between collections and files
                    active={0}
                    handleClick={(event: any) => { console.log(event.target.dataset.id); setSubpageIndex(Number(event.target.dataset.id)) }}
                />
                <SubPage
                    show={subpageIndex === 0}
                    id="subpage-metadata"
                >
                    <div
                        className={twMerge(
                            "bg-stone-100 p-2 mt-2 rounded-md",
                            "flex flex-col space-y-2"
                        )}
                    >

                        <Ruletable>
                            <tr>
                                <Titletd>Scope</Titletd>
                                <Contenttd>{meta.scope}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Name</Titletd>
                                <Contenttd>{meta.name}</Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Created At</Titletd>
                                <Contenttd>{format("yyyy-MM-dd", meta.created_at)}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Updated At</Titletd>
                                <Contenttd>{format("yyyy-MM-dd", meta.updated_at)}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Expires At</Titletd>
                                <Contenttd>
                                    {
                                        format("yyyy-MM-dd", meta.expires_at)
                                        // add ability to extend lifetime here
                                    }
                                </Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Locks OK</Titletd>
                                <Contenttd>
                                    <span className="flex flex-row space-x-2 justify-end">
                                        <LockStateTag lockState={LockState.OK} tiny className={meta.locks_ok_cnt > 0 ? "" : "hidden"}/>
                                        <span className="font-mono">{meta.locks_ok_cnt}</span>
                                    </span>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Locks Replicating</Titletd>
                                <Contenttd>
                                    <span className="flex flex-row space-x-2 justify-end">
                                        <LockStateTag lockState={LockState.Replicating} tiny className={meta.locks_replicating_cnt > 0 ? "" : "hidden"}/>
                                        <span className="font-mono">{meta.locks_replicating_cnt}</span>
                                    </span>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Locks Stuck</Titletd>
                                <Contenttd>
                                    <span className="flex flex-row space-x-2 justify-end">
                                        <LockStateTag lockState={LockState.Stuck} tiny className={meta.locks_stuck_cnt > 0 ? "" : "hidden"}/>
                                        <span className="font-mono">{meta.locks_stuck_cnt}</span>
                                    </span>
                                </Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Purge Replicas</Titletd>
                                <Contenttd>{<BoolTag val={meta.purge_replicas} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Split Container</Titletd>
                                <Contenttd>{<BoolTag val={meta.split_container} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Ignore Account Limit</Titletd>
                                <Contenttd>{<BoolTag val={meta.ignore_account_limit} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Ignore Availability</Titletd>
                                <Contenttd>{<BoolTag val={meta.ignore_availability} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Locked</Titletd>
                                <Contenttd>{<BoolTag val={meta.locked} />}</Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Copies</Titletd>
                                <Contenttd>{meta.copies}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>ID</Titletd>
                                <Contenttd className="font-mono">{meta.id}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>DID Type</Titletd>
                                <Contenttd><DIDTypeTag didtype={meta.did_type} /></Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Grouping</Titletd>
                                <Contenttd><DIDTypeTag didtype={meta.grouping} /></Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Priority</Titletd>
                                <Contenttd>{meta.priority}</Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>RSE Expression</Titletd>
                                <Contenttd className="font-mono">{meta.rse_expression}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Notification</Titletd>
                                <Contenttd><RuleNotificationTag notificationState={meta.notification}/></Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Account</Titletd>
                                <Contenttd>{meta.account}</Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Activity</Titletd>
                                <Contenttd>{meta.activity}</Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>State</Titletd>
                                <Contenttd><RuleStateTag state={meta.state} /></Contenttd>
                            </tr>
                        </Ruletable>

                    </div></SubPage>
                <SubPage

                    show={subpageIndex === 1}
                    id="subpage-locks"
                >
                    subpage locks
                </SubPage>

            </div>
        </div>

    );
};
