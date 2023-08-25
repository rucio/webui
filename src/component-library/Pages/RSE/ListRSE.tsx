import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { RSEType } from "@/lib/core/entity/rucio";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";
import { BoolTag } from "../../Tags/BoolTag";
import { HiDotsHorizontal } from "react-icons/hi";
import { RSETypeTag } from "../../Tags/RSETypeTag";
import { TableFilterBoolean } from "../../StreamedTables/TableFilterBoolean";
import { TableInternalLink } from "../../StreamedTables/TableInternalLink";
import useReponsiveHook from "../../Helpers/ResponsiveHook";
import { Body } from "../Helpers/Body";
import { Heading } from "../Helpers/Heading";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";

export const ListRSE = (
    props: {
        comdom: UseComDOM<RSEViewModel>
    }
) => {
    const columnHelper = createColumnHelper<RSEViewModel>()
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
            <Heading
                title="List RSEs"
            />
            <Body>
                <StreamedTable<RSEViewModel>
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
            </Body>
        </div>
    );
};
