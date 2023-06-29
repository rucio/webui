import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { RSE, RSEType } from "@/lib/core/entity/rucio";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { createColumnHelper } from "@tanstack/react-table";
import { H3 } from "../../Text/Headings/H3";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";
import { BoolTag } from "../../Tags/BoolTag";
import { HiDotsHorizontal } from "react-icons/hi";
import { RSETypeTag } from "../../Tags/RSETypeTag";
import { TableFilterBoolean } from "../../StreamedTables/TableFilterBoolean";
import { TableInternalLink } from "../../StreamedTables/TableInternalLink";
import useReponsiveHook from "../../Helpers/ResponsiveHook";
import { Button } from "../../Button/Button";

export const ListRSE = (
    props: {
        comdom: UseComDOM<RSE>
    }
) => {
    const columnHelper = createColumnHelper<RSE>()
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
        columnHelper.accessor("rse_type", {
            id: "rse_type",
            header: info => {
                return (
                    <TableFilterDiscrete<RSEType>
                        name="RSE Type"
                        keys={Object.values(RSEType)}
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <RSETypeTag rsetype={key} forcesmall />}
                        column={info.column}
                        stack
                    />
                )
            },
            cell: info => <RSETypeTag rsetype={info.getValue()} />,
            meta: {
                style: "w-8 md:w-32"
            }
        }),
        columnHelper.accessor("volatile", {
            id: "volatile",
            cell: info => <BoolTag val={info.getValue()} />,
            header: info => {
                return (
                    <TableFilterBoolean
                        name="Volatile"
                        column={info.column}
                        stack
                    />
                )
            },
            meta: {
                style: "w-36"
            }
        }),
        columnHelper.accessor("deterministic", {
            id: "deterministic",
            cell: info => <BoolTag val={info.getValue()} />,
            header: info => {
                return (
                    <TableFilterBoolean
                        name="Deterministic"
                        column={info.column}
                        stack
                    />
                )
            },
            meta: {
                style: "w-36"
            }
        }),
        columnHelper.accessor("staging_area", {
            id: "staging_area",
            cell: info => <BoolTag val={info.getValue()} />,
            header: info => {
                return (
                    <TableFilterBoolean
                        name="Staging"
                        column={info.column}
                        stack
                    />
                )
            },
            meta: {
                style: "w-36"
            }
        })
    ]

    const responsive = useReponsiveHook()

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
                        "flex flex-col space-y-2 md:flex-row md:justify-between md:items-baseline md:space-y-0 w-full",
                        "bg-white dark:bg-gray-800"
                    )}
                >
                    <span className="flex flex-row justify-between space-x-4">
                        <H3>List RSEs</H3>
                    </span>
                </div>

            </div>
            <div
                className={twMerge(
                    "p-0 md:p-2",
                    "rounded-md border",
                    "bg-white dark:bg-gray-800",
                )}
            >
                <StreamedTable<RSE>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableHeadRowStyle: "md:h-16",
                        visibility: {
                            volatile: responsive.md,
                            deterministic: responsive.md,
                            staging_area: responsive.md,
                        }
                    }}
                />
            </div>
        </div>
    );
};
