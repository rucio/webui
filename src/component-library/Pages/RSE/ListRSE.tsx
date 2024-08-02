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
import { TextInput } from "@/component-library/Input/TextInput";
import { useState } from "react";
import { Button } from "@/component-library/Button/Button";

const defaultRSEQuery = "*";

export const ListRSE = (
    props: {
        comdom: UseComDOM<RSEViewModel>
        setRSEQuery: (rseExpression: string) => void
    }
) => {

    const [rseSearchQuery, setRSESearchQuery] = useState<string>(defaultRSEQuery)
    const setInputAsQuery = (searchPattern: string) => {
        setRSESearchQuery(searchPattern !== '' ? searchPattern : defaultRSEQuery)
    }

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
                    <TableInternalLink href={"/rse/page/" + info.getValue()}>
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
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" /> : <RSETypeTag rsetype={key} forcesmall />}
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
            >
                <form
                    className={twMerge(
                        "flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full",
                    )}
                    aria-label="RSE Search"
                >
                    <label
                        className={twMerge(
                            "w-fit flex-none",
                            "text-text-1000 dark:text-text-0"
                        )}
                        htmlFor='rse-search-pattern'
                    >
                        RSE Search Pattern
                    </label>
                    <TextInput
                        onBlur={(event: any) => { setInputAsQuery(event.target.value) }}
                        onEnterkey={(e) => {
                            e.preventDefault()
                            setInputAsQuery(e.target.value)
                            props.setRSEQuery(rseSearchQuery)
                            props.comdom.start()
                        }}
                        id="rse-search-pattern"
                        placeholder={defaultRSEQuery}
                    />
                    <Button
                        type="button"
                        label="Search"
                        onClick={(e: any) => {
                            e.preventDefault()
                            props.setRSEQuery(rseSearchQuery)
                            props.comdom.start()
                        }}
                        className={twMerge(
                            "w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0"
                        )}
                        id="rse-button-search"
                    />
                </form>
            </Heading>
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
