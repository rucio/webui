import { RSEAccountUsageLimit } from "@/lib/core/entity/rucio";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { twMerge } from "tailwind-merge";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { H3 } from "../../Text/Headings/H3";
import { P } from "../../Text/Content/P";
import { Number } from "../../Text/Content/Number";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";
import { useState, useEffect } from "react";
import { TableFilterString } from "../../StreamedTables/TableFilterString";

export const CreateRuleRSETable = (
    props: {
        tableData: TableData<RSEAccountUsageLimit>,
        handleChange: (data: RSEAccountUsageLimit[]) => void,
        askApproval?: boolean
    }
) => {
    const columnHelper = createColumnHelper<RSEAccountUsageLimit>()
    const isNoQuotaLeftFunction = (row: Row<RSEAccountUsageLimit>) => {
        let noQuota = (row.original.quota_bytes && row.original.quota_bytes < row.original.used_bytes)
        return props.askApproval ? false : noQuota
    }
    const tablecolumns = [
        columnHelper.display({
            id: "selection",
            header: info => <span className="w-8" />,
            cell: info => {
                return (
                    <span className="ml-1 w-6 sm:ml-2 sm:w-8">
                        <input
                            type="checkbox"
                            disabled={!info.row.getCanSelect()}
                            checked={info.row.getIsSelected()}
                            onClick={e => {
                                info.row.toggleSelected()
                            }}
                        />
                    </span>
                )
            },
            meta: {
                style: "w-6 sm:w-8"
            }
        }),
        columnHelper.accessor("rse_id", {
            id: "rse_id",
            header: info => <H3 className="text-left">RSE ID</H3>,
            cell: info => <P mono>{info.getValue()}</P>
        }),
        columnHelper.accessor("rse", {
            id: "rse",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="RSE Name"
                    />
                )
            },
            cell: info => <P mono className="break-all">{info.getValue()}</P>
        }),
        columnHelper.accessor('used_bytes', {
            id: 'used_bytes',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Used"
                        column={info.column}
                        className="pl-2"
                        stack
                    />
                )
            },
            cell: info => {
                // if value is greater than quota bytes, print in red
                return (
                    <P mono className={twMerge(
                        isNoQuotaLeftFunction(info.row) ? "text-red-500 dark:text-red-500 font-bold" : "",
                        "text-right"
                    )}>
                        <Number number={info.getValue()} />
                    </P>
                )
            },
            meta: {
                style: "w-24"
            }
        }),
        columnHelper.accessor(row => row.quota_bytes - row.used_bytes, {
            id: 'remaining_bytes',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Remaining"
                        column={info.column}
                        className="pl-2"
                        stack
                        nocollapse
                    />
                )
            },
            cell: info => {
                // if value is greater than quota bytes, print in red
                return (
                    <P mono className={twMerge(
                        isNoQuotaLeftFunction(info.row) ? "text-red-500 dark:text-red-500 font-bold" : "",
                        "text-right"
                    )}>
                        <Number number={info.getValue()} />
                    </P>
                )
            },
            meta: {
                style: "w-24"
            }
        }),
        columnHelper.accessor('quota_bytes', {
            id: 'quota_bytes',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Quota"
                        column={info.column}
                        className="pl-2"
                        stack
                    />
                )
            },
            cell: (props) => {
                return <P mono className="text-right"><Number number={props.row.original.quota_bytes} /></P>
            },
            meta: {
                style: "w-24"
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
    const isMd = () => windowSize[0] > 768  // 768px is the breakpoint for md => is minimum md sized

    return (
        <StreamedTable
            tabledata={props.tableData}
            tablecolumns={tablecolumns}
            tableselecting={{
                handleChange: props.handleChange,
                enableRowSelection: true,
                enableMultiRowSelection: true,
            }}
            tablestyling={{
                visibility: {
                    "rse_id": false,
                    "used_bytes": isMd(),
                    "quota_bytes": isMd(),
                }
            }}
        />
    );
};
