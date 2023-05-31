import { useState, useEffect } from "react"

import { twMerge } from "tailwind-merge";
var format = require("date-format")

import { RuleMeta, RuleNotification } from "@/lib/core/entity/rucio";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables.d";
import { LockState } from "@/lib/core/entity/rucio";
import { Tabs } from "../../Tabs/Tabs";
import { SubPage } from "../../Helpers/SubPage";
import { H3 } from "../../Text/Headings/H3";
import { P } from "../../Text/Content/P";
import { BoolTag } from "../../Tags/BoolTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { RuleStateTag } from "../../Tags/RuleStateTag";
import { LockStateTag } from "../../Tags/LockStateTag";
import { RuleNotificationTag } from "../../Tags/RuleNotificationTag";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { createColumnHelper } from "@tanstack/react-table";
import { HiDotsHorizontal, HiExternalLink } from "react-icons/hi";
import { TableExternalLink } from "../../StreamedTables/TableExternalLink";
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";
import { TableFilterString } from "../../StreamedTables/TableFilterString";


export interface RulePageLockEntry {
    scope: string;
    name: string;
    rse: string;
    state: LockState;
    ddm_link: string;
    fts_link: string;
}

export interface PageRulePageProps {
    ruleMeta: RuleMeta;
    ruleLocks: TableData<RulePageLockEntry>
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

    const columnHelper = createColumnHelper<RulePageLockEntry>()
    const tableColumns = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="DID"
                    />
                )
            },
            cell: info => {
                return (
                    <P className="break-all pr-1">{info.getValue()}</P>
                )
            }
        }),
        columnHelper.accessor("rse", {
            id: "rse",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="RSE"
                    />
                )
            },
            cell: info => {
                return (
                    <P className="break-all">{info.getValue()}</P>
                )
            }
        }),
        columnHelper.accessor("state", {
            id: "state",
            cell: info => <LockStateTag lockState={info.getValue()} tiny={windowSize[0] <= 768} />,
            header: info => {
                return (
                    <TableFilterDiscrete<LockState>
                        name="Lock"
                        keys={Object.values(LockState)}
                        renderFunc={state => state === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <LockStateTag lockState={state} tiny />}
                        column={info.column}
                    />
                )
            },
            meta: {
                style: "w-6 sm:w-8 md:w-32"
            }
        }),
        columnHelper.display({
            id: "links",
            header: info => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-start"
                        )}
                    >
                        <H3>Links</H3>
                    </span>
                )
            },
            cell: info => {
                return (
                    <span className={twMerge("flex flex-row space-x-1")}>
                        <TableExternalLink href={info.row.original.ddm_link} label="DDM" />
                        <TableExternalLink href={info.row.original.fts_link} label="FTS" />
                    </span>
                )
            },
            meta: {
                style: "w-32"
            }
        }),
    ]

    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);

    useEffect(() => {
        setWindowSize([window.innerWidth, window.innerHeight])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

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
                    "rounded-md p-2 border",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <Tabs
                    tabs={
                        ["Metadata", "Locks"]
                    } // remember difference between collections and files
                    _ariaControls={
                        ["subpage-metadata", "subpage-locks"]
                    }
                    active={0}
                    updateActive={(active) => {setSubpageIndex(active)}}
                />
                <SubPage
                    show={subpageIndex === 0}
                    id="subpage-metadata"
                    aria-labelledby="tab-0"
                    role="tabpanel"
                >
                    <div
                        className={twMerge(
                            "bg-stone-100 dark:bg-gray-900 p-2 mt-2 rounded-md",
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
                                        // add ability to extend lifetime here => or maybe not?? i think this might be bad UX
                                    }
                                </Contenttd>
                            </tr>
                        </Ruletable>
                        <Ruletable>
                            <tr>
                                <Titletd>Locks OK</Titletd>
                                <Contenttd>
                                        <P mono>{meta.locks_ok_cnt}</P>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Locks Replicating</Titletd>
                                <Contenttd>
                                        <P mono>{meta.locks_replicating_cnt}</P>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titletd>Locks Stuck</Titletd>
                                <Contenttd>
                                        <P mono>{meta.locks_stuck_cnt}</P>
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
                                <Contenttd><RuleNotificationTag notificationState={meta.notification} /></Contenttd>
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
                    aria-labelledby="tab-1"
                    role="tabpanel"
                >
                    <StreamedTable
                        tableData={props.ruleLocks}
                        tableColumns={tableColumns}
                        tableStyling={{
                            visibility: {
                                // "state": windowSize[0] > 768,
                                "links": windowSize[0] > 768
                            },
                        }}
                    />
                </SubPage>

            </div>
        </div>

    );
};
