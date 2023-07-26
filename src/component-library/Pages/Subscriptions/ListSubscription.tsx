import { twMerge } from "tailwind-merge";
import { H3 } from "../../Text/Headings/H3";
import { P } from "../../Text/Content/P";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";
import { RuleStateTag } from "../../Tags/RuleStateTag";
import { RuleState } from "@/lib/core/entity/rucio";
import { useState, useEffect } from "react";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { Body } from "../Helpers/Body";
import { Heading } from "../Helpers/Heading";
import { SubscriptionRuleStatesViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";

export interface ListSubscriptionProps {
    comdom: UseComDOM<SubscriptionRuleStatesViewModel>
}

export const ListSubscription = (
    props: ListSubscriptionProps
) => {
    const columnHelper = createColumnHelper<SubscriptionRuleStatesViewModel>()
    const tablecolumns = [
        columnHelper.accessor("name", {
            id: "name",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Name"
                        placeholder="Filter by Subscription Name"
                        className="ml-1"
                    />
                )
            },
            cell: info => <P mono className="ml-1 break-all">{info.getValue()}</P>
        }),
        columnHelper.accessor("state_ok", {
            id: "state_ok",
            header: info => {
                return (
                    <TableSortUpDown
                        name="OK"
                        column={info.column}
                        element={
                            <RuleStateTag
                                className={isLg() ? "md:w-28" : ""}
                                tiny={!isLg()}
                                state={RuleState.OK}
                            />
                        }
                        stack
                    />
                )
            },
            cell: info => <P mono className="text-right pr-2">{info.getValue()}</P>,
            meta: {
                style: "w-12 lg:w-32",
            }
        }),
        columnHelper.accessor("state_replicating", {
            id: "state_replicating",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Replicating"
                        column={info.column}
                        element={
                            <RuleStateTag
                                className={isLg() ? "md:w-28" : ""}
                                tiny={!isLg()}
                                state={RuleState.Replicating}
                            />
                        }
                        stack
                    />
                )
            },
            cell: info => <P mono className="text-right pr-2">{info.getValue()}</P>,
            meta: {
                style: "w-12 lg:w-32",
            }
        }),
        columnHelper.accessor("state_stuck", {
            id: "state_stuck",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Stuck"
                        column={info.column}
                        element={
                            <RuleStateTag
                                className={isLg() ? "md:w-28" : ""}
                                tiny={!isLg()}
                                state={RuleState.Stuck}
                            />
                        }
                        stack
                    />
                )
            },
            cell: info => <P mono className="text-right pr-2">{info.getValue()}</P>,
            meta: {
                style: "w-12 lg:w-32",
            }
        }),
        columnHelper.accessor("state_suspended", {
            id: "state_suspended",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Suspended"
                        column={info.column}
                        element={
                            <RuleStateTag
                                className={isLg() ? "md:w-28" : ""}
                                tiny={!isLg()}
                                state={RuleState.Suspended}
                            />
                        }
                        stack
                    />
                )
            },
            cell: info => <P mono className="text-right pr-2">{info.getValue()}</P>,
            meta: {
                style: "w-12 lg:w-32",
            }
        }),
        columnHelper.display({
            id: "condensed_states",
            header: info => <H3 className="text-left">States</H3>,
            cell: info => {
                const MiniState = (props: { state: RuleState, amount: number }) => {
                    return (
                        <span
                            className={twMerge("flex flex-row space-x-1")}
                        >
                            <P mono className="text-right">{props.amount}</P>
                            <RuleStateTag tiny state={props.state} />
                        </span>
                    )
                }
                return (
                    <div
                        className={twMerge(
                            "flex flex-col space-y-1 p-1",
                            "items-end"
                        )}
                    >
                        <MiniState state={RuleState.OK} amount={info.row.original.state_ok} />
                        <MiniState state={RuleState.Replicating} amount={info.row.original.state_replicating} />
                        <MiniState state={RuleState.Stuck} amount={info.row.original.state_stuck} />
                        <MiniState state={RuleState.Suspended} amount={info.row.original.state_suspended} />
                    </div>
                )
            },
            meta: {
                style: "w-24"
            }
        })
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
    const isSm = () => windowSize[0] > 640  // 640px is the breakpoint for sm => is minimum sm sized
    const isLg = () => windowSize[0] > 1024 // 1024px is the breakpoint for lg => is minimum lg sized


    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <Heading title="List Subscriptions" />
            <Body>
                <StreamedTable<SubscriptionRuleStatesViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        visibility: {
                            "state_ok": isSm(),
                            "state_replicating": isSm(),
                            "state_stuck": isSm(),
                            "state_suspended": isSm(),
                            "condensed_states": !isSm(),
                        },
                        tableHeadRowStyle: "md:h-16",
                        tableBodyRowStyle: "h-8",
                    }}
                />
            </Body>
        </div>
    );
};
