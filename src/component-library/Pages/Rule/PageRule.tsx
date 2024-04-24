import { useState, useEffect } from "react"

import { twMerge } from "tailwind-merge";
var format = require("date-format")

import { LockState } from "@/lib/core/entity/rucio";
import { Tabs } from "../../Misc/Tabs";
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
import { Titleth, Contenttd, Generaltable } from "../../Helpers/Metatable";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { Heading } from "../Helpers/Heading";
import { Body } from "../Helpers/Body";
import { RuleMetaViewModel, RulePageLockEntryViewModel } from "@/lib/infrastructure/data/view-model/rule";
import { Button } from "@/component-library/Button/Button";
import { HiRocketLaunch } from "react-icons/hi2";


export interface PageRulePageProps {
    ruleMeta: RuleMetaViewModel;
    ruleLocks: UseComDOM<RulePageLockEntryViewModel>
    ruleBoostFunc: () => void;
    ruleBoostShow: boolean;
}


export const PageRule = (
    props: PageRulePageProps
) => {
    const [subpageIndex, setSubpageIndex] = useState(0);

    useEffect(() => {
        if (subpageIndex === 1 && props.ruleLocks.query.data.all.length === 0) {
            // Opened locks tab, but no data yet => start load
            console.log(props.ruleLocks.query.data)
            props.ruleLocks.start()
        }
    }, [subpageIndex])

    const meta = props.ruleMeta;

    const columnHelper = createColumnHelper<RulePageLockEntryViewModel>()
    const tablecolumns = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        className="dark:text-text-0 text-text-1000"
                        name="DID"
                    />
                )
            },
            cell: info => {
                return (
                    <P className="break-all pr-1 dark:text-text-0 text-text-1000">{info.getValue()}</P>
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
                        className="dark:text-text-0 text-text-1000"
                    />
                )
            },
            cell: info => {
                return (
                    <P className="break-all dark:text-text-0 text-text-1000">{info.getValue()}</P>
                )
            }
        }),
        columnHelper.accessor("state", {
            id: "state",
            cell: info => <LockStateTag className="dark:text-text-0 text-text-1000" lockState={info.getValue()} tiny={windowSize[0] <= 768} />,
            header: info => {
                return (
                    <TableFilterDiscrete<LockState>
                        name="Lock"
                        keys={Object.values(LockState)}
                        renderFunc={state => state === undefined ? <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" /> : <LockStateTag lockState={state} tiny className="dark:text-text-0 text-text-1000"/>}
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
                            "flex flex-row justify-start",
                            "dark:text-text-0 text-text-1000"
                        )}
                    >
                        <H3>Links</H3>
                    </span>
                )
            },
            cell: info => {
                return (
                    <span className={twMerge("flex flex-row space-x-1 dark:text-text-0 text-text-1000")}>
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
                "flex flex-col space-y-2 w-full",
                "dark:text-text-0 text-text-1000"
            )}
        >
            <Heading
                title="View Rule"
                subtitle={`For rule ${props.ruleMeta.scope}:${props.ruleMeta.name}`}
                >
                <div
                    className={twMerge(
                        "w-full p-2 rounded",
                        "bg-neutral-200 dark:bg-neutral-900",
                        props.ruleBoostShow ? "" : "hidden"
                    )}
                >
                    <Button
                        label="Boost rule"
                        theme="orange"
                        icon={<HiRocketLaunch />}
                        onClick={() => props.ruleBoostFunc()}
                    />
                </div>
            </Heading>
            <Body>
                <Tabs
                    tabs={
                        ["Metadata", "Locks"]
                    } // remember difference between collections and files
                    _ariaControls={
                        ["subpage-metadata", "subpage-locks"]
                    }
                    active={0}
                    updateActive={(active) => { setSubpageIndex(active) }}
                />
                <SubPage
                    show={subpageIndex === 0}
                    id="subpage-metadata"
                    aria-labelledby="tab-0"
                    role="tabpanel"
                >
                    <div
                        className={twMerge(
                            "bg-neutral-100 dark:bg-neutral-900 p-2 mt-2 rounded-md",
                            "flex flex-col space-y-2"
                        )}
                    >
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Scope</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.scope}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Name</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.name}</Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Created At</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{format("yyyy-MM-dd", new Date(meta.created_at))}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Updated At</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{format("yyyy-MM-dd", new Date(meta.updated_at))}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Expires At</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">
                                    {
                                        format("yyyy-MM-dd", new Date(meta.expires_at))
                                        // add ability to extend lifetime here => or maybe not?? i think this might be bad UX
                                    }
                                </Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Locks OK</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">
                                    <P mono>{meta.locks_ok_cnt}</P>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Locks Replicating</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">
                                    <P mono>{meta.locks_replicating_cnt}</P>
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Locks Stuck</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">
                                    <P mono>{meta.locks_stuck_cnt}</P>
                                </Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Purge Replicas</Titleth>
                                <Contenttd >{<BoolTag val={meta.purge_replicas} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Split Container</Titleth>
                                <Contenttd>{<BoolTag val={meta.split_container} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Ignore Account Limit</Titleth>
                                <Contenttd>{<BoolTag val={meta.ignore_account_limit} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Ignore Availability</Titleth>
                                <Contenttd>{<BoolTag val={meta.ignore_availability} />}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Locked</Titleth>
                                <Contenttd>{<BoolTag val={meta.locked} />}</Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Copies</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.copies}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">ID</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000 font-mono">{meta.id}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">DID Type</Titleth>
                                <Contenttd><DIDTypeTag didtype={meta.did_type} /></Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Grouping</Titleth>
                                <Contenttd><DIDTypeTag didtype={meta.grouping} /></Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Priority</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.priority}</Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">RSE Expression</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000 font-mono">{meta.rse_expression}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Notification</Titleth>
                                <Contenttd><RuleNotificationTag notificationState={meta.notification} /></Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Account</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.account}</Contenttd>
                            </tr>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">Activity</Titleth>
                                <Contenttd className="dark:text-text-0 text-text-1000">{meta.activity}</Contenttd>
                            </tr>
                        </Generaltable>
                        <Generaltable>
                            <tr>
                                <Titleth className="dark:text-text-0 text-text-1000">State</Titleth>
                                <Contenttd><RuleStateTag state={meta.state} /></Contenttd>
                            </tr>
                        </Generaltable>
                    </div></SubPage>
                <SubPage
                    show={subpageIndex === 1}
                    id="subpage-locks"
                    aria-labelledby="tab-1"
                    role="tabpanel"
                >
                    <StreamedTable
                        tablecomdom={props.ruleLocks}
                        tablecolumns={tablecolumns}
                        tablestyling={{
                            visibility: {
                                // "state": windowSize[0] > 768,
                                "links": windowSize[0] > 768
                            },
                        }}
                    />
                </SubPage>
            </Body >

        </div>

    );
};
