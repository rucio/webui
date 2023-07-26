import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { Rule, RuleState } from "@/lib/core/entity/rucio";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { Button } from "../../Button/Button";
import { H3 } from "../../Text/Headings/H3";
import useReponsiveHook from "../../Helpers/ResponsiveHook";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableInternalLink } from "../../StreamedTables/TableInternalLink";
import { P } from "../../Text/Content/P";
import { DateTag } from "../../Tags/DateTag";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";
import { RuleStateTag } from "../../Tags/RuleStateTag";
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";
import { HiDotsHorizontal } from "react-icons/hi";
import { TextInput } from "../../Input/TextInput";
import { LabelledInput } from "../Login/LabelledInput";
import { MouseEventHandler } from "react";
import { AreaInput } from "../../Input/AreaInput";
import { Contenttd, Generaltable, Titleth } from "../../Helpers/Metatable";
import { Dropdown } from "../../Input/Dropdown";
import { DateInput } from "../../Input/DateInput";
import { useState } from "react";
import { Heading } from "../Helpers/Heading";
import { Body } from "../Helpers/Body";
import { RuleViewModel } from "@/lib/infrastructure/data/view-model/rule";

type ListRuleUserDefineQuery = Partial<{
    account: string
    rse_expression: string
    activity: string
    state: RuleState
    from_date: Date
    to_date: Date
}>

export const ListRule = (
    props: {
        comdom: UseComDOM<RuleViewModel>
    }
) => {
    const columnHelper = createColumnHelper<Rule>()
    const tablecolumns = [
        columnHelper.accessor("name", {
            id: "name",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Name"
                        placeholder="Filter by RSE Name"
                        className="ml-1"
                    />
                )
            },
            cell: info => {
                return (
                    <TableInternalLink href={"/rse/" + info.getValue()}>
                        {info.getValue()}
                    </TableInternalLink>
                )
            }
        }),
        columnHelper.accessor("account", {
            id: "account",
            cell: info => <P className="break-all">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Account"
                        placeholder="Filter by Account"
                        className="ml-1"
                    />
                )
            },
        }),
        columnHelper.accessor("rse_expression", {
            id: "rse_expression",
            cell: info => <P className="break-all" mono>{info.getValue()}</P>,
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="RSE Expression"
                        placeholder="Filter by RSE Expression"
                        className="ml-1"
                    />
                )
            },
        }),
        columnHelper.accessor("created_at", {
            id: "created_at",
            cell: info => <DateTag date={new Date(info.getValue())} className="flex flex-row justify-end" />,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Created At"
                        className="ml-1"
                        stack
                    />
                )
            },
            meta: {
                style: "w-36"
            }
        }),
        columnHelper.accessor("remaining_lifetime", {
            id: "remaining_lifetime",
            cell: info => <P className="text-right" mono>{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Lifetime Remaining"
                        className="ml-1"
                        stack
                    />
                )
            },
            meta: {
                style: "w-32"
            }
        }),
        columnHelper.accessor("state", {
            id: "state",
            cell: info => <RuleStateTag state={info.getValue()} />,
            header: info => {
                return (
                    <TableFilterDiscrete<RuleState>
                        column={info.column}
                        name="State"
                        keys={Object.values(RuleState)}
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <RuleStateTag state={key} tiny />}
                        stack
                    />
                )
            },
            meta: {
                style: "w-44"
            }
        }),
        columnHelper.accessor("locks_ok_cnt", {
            id: "locks_ok_cnt",
            cell: info => <P className="text-right">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks OK Count"
                        className="ml-1"
                        element={<RuleStateTag state={RuleState.OK} tiny />}
                        stack
                    />
                )
            },
            meta: {
                style: "w-16"
            }
        }),
        columnHelper.accessor("locks_replicating_cnt", {
            id: "locks_replicating_cnt",
            cell: info => <P className="text-right">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks Replicating Count"
                        className="ml-1"
                        element={<RuleStateTag state={RuleState.Replicating} tiny />}
                        stack
                    />
                )
            },
            meta: {
                style: "w-16"
            }
        }),
        columnHelper.accessor("locks_stuck_cnt", {
            id: "locks_stuck_cnt",
            cell: info => <P className="text-right">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks Stuck Count"
                        className="ml-1"
                        element={<RuleStateTag state={RuleState.Stuck} tiny />}
                        stack
                    />
                )
            },
            meta: {
                style: "w-16"
            }
        }),
    ]
    const [userdefinequery, setUserdefinequery] = useState<ListRuleUserDefineQuery>({
        account: undefined,
        rse_expression: undefined,
        activity: undefined,
        state: undefined,
        from_date: undefined,
        to_date: undefined,
    })
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <Heading
                title="List Rules"
            >
                <form
                    className={twMerge(
                        "w-full rounded flex flex-col space-y-2 items-center",
                    )}
                >
                    <fieldset
                        className={twMerge(
                            "w-full rounded",
                            "bg-gray-200 dark:bg-gray-900",
                        )}
                    >
                        <Generaltable
                            className={twMerge(
                                "bg-inherit dark:bg-inherit"
                            )}
                        >
                            <tr>
                                <Titleth>Account</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e => setUserdefinequery({ ...userdefinequery, account: e.target.value })}
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>RSE Expression</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e => setUserdefinequery({ ...userdefinequery, rse_expression: e.target.value })}
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Activity</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e => setUserdefinequery({ ...userdefinequery, activity: e.target.value })}
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Rule State</Titleth>
                                <Contenttd>
                                    <Dropdown<RuleState>
                                        keys={Object.values(RuleState)}
                                        renderFunc={key => key ?
                                            <RuleStateTag state={key} className="w-44" /> : <span>UNDEFINED</span>
                                        }
                                        handleChange={key => { setUserdefinequery({ ...userdefinequery, state: key }) }}
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Time Window</Titleth>
                                <Contenttd>
                                    <div
                                        className={twMerge(
                                            "flex p-1 rounded justify-start",
                                            "flex-col space-y-2 md:space-y-0",
                                            "md:flex-row md:space-x-2",
                                            "bg-gray-300 dark:bg-gray-900"
                                        )}
                                    >
                                        <div className="flex flex-row space-x-1 items-baseline">
                                            <label className="flex-none" htmlFor="from-date">From</label>
                                            <DateInput
                                                onchange={date => { setUserdefinequery({ ...userdefinequery, from_date: date }) }}
                                                id="from-date"
                                            />
                                        </div>
                                        <div className="flex flex-row space-x-1 items-baseline">
                                            <label className="flex-none" htmlFor="to-date">to</label>
                                            <DateInput
                                                onchange={date => { setUserdefinequery({ ...userdefinequery, to_date: date }) }}
                                                id="to-date"
                                            />
                                        </div>
                                    </div>
                                </Contenttd>
                            </tr>
                        </Generaltable>
                    </fieldset>
                    <Button
                        label="Search"
                        type="submit"
                        onClick={(e: any) => { e.preventDefault(); console.log(userdefinequery) }}
                    />
                </form>
            </Heading>

            <Body>
                <StreamedTable<RuleViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableHeadRowStyle: "md:h-16",
                    }}
                />
            </Body>
        </div>
    );
};
