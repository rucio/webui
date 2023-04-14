import { H3 } from "@/component-library/components/Text/Headings/H3"
import { P } from "@/component-library/components/Text/Content/P"
import { Button } from "../Button/Button"
import { Number } from "../Text/Content/Number"
import { DIDTypeTag } from "../Tags/DIDTypeTag"
import { NumInput } from "../Input/NumInput"
import { Label } from "../Text/Content/Label"

import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi"

import { twMerge } from "tailwind-merge"

import { useEffect, useState } from "react"

import { DIDDTO } from "@/lib/core/data/rucio-dto"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { FetchStatus } from "@tanstack/react-query"
import {
    createColumnHelper, flexRender, getCoreRowModel, TableOptions,
    useReactTable, getPaginationRowModel, getFilteredRowModel, Table,
    Column, Row } from "@tanstack/react-table"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "@/component-library/outputtailwind.css";
import "reflect-metadata";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Dropdown } from "../Dropdown/Dropdown"
import { TextInput } from "../Input/TextInput"

const Filter = (
    props: {
        column: Column<any, any>,
        table: Table<any>
    }
) => {
    const { column, table } = props;
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === "number" ? (
        <div className="flex space-x-2">
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
            />
        </div>
    ) : (
        <span className="w-full pr-4">
            <TextInput
                placeholder="Filter Results"
                onChange={(e) => column.setFilterValue(e.target.value)}
            />
        </span>

    );
}

export const DIDListTable = (
    props: {
        data: any,
        fetchstatus: FetchStatus,
        onChange: (selected: string[]) => void,
        pageSize: number,
        selected?: string[],
    }
) => {
    const columnHelper = createColumnHelper<DIDDTO>()



    const columns: any[] = [
        {
            id: 'selection',
            header: () => <span className="w-8" />,
            cell: (props: any) => {
                return <span className="ml-2 w-8">
                    <input
                        type="checkbox"
                        disabled={false}
                        checked={props.row.getIsSelected()}
                        onChange={(event: any) => {
                            if (event.target.checked) {
                                setSelectedDIDs([...selectedDIDs, props.row.original.rse_id])
                            }
                            else {
                                setSelectedDIDs(selectedDIDs.filter((did) => did !== props.row.original.rse_id))
                            }
                            props.row.getToggleSelectedHandler()(event)
                        }}
                    />
                </span>
            },
        },
        columnHelper.accessor('name', {
            id: 'name',
            cell: (info) => {
                return (
                    <div className="flex flex-row items-center justify-between mr-2">
                        <span className="text-left select-all">
                            <P mono>{info.getValue()}</P>
                        </span>
                        <DIDTypeTag type={info.row.original.did_type} />
                    </div>
                )
            },
        }),
        columnHelper.accessor('scope', {
            id: 'scope',
            cell: (info) => { <P mono>{info.getValue()}</P> },
        }),
        columnHelper.accessor('did_type', {
            id: 'did_type',
            cell: (info) => <P mono>{info.getValue()}</P>,
        }),
        columnHelper.accessor('bytes', {
            id: 'bytes',
            cell: (info) => <P mono><Number number={info.getValue()} /></P>,
        }),
        columnHelper.accessor('length', {
            id: 'length',
            cell: (info) => <P mono>{info.getValue()}</P>,
        }),
    ]
    const [columnVisibility, setColumnVisibility] = useState(
        {
            selection: true,
            name: true,
            bytes: true,
            scope: false,
            did_type: false,
            length: false,
        }
    )

    const table = useReactTable<DIDDTO>({
        data: props.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
        enableRowSelection: true,
        state: {
            columnVisibility: columnVisibility,
        }
    } as TableOptions<DIDDTO>)

    const [selectedDIDs, setSelectedDIDs] = useState<string[]>(props.selected ?? [])
    useEffect(() => {
        setSelectedDIDs(props.selected ?? [])
    }, [props.selected])
    useEffect(() => {
        props.onChange(selectedDIDs)
    }, [selectedDIDs])

    const [pageSize, setPageSize] = useState(props.pageSize)
    useEffect(() => {
        setPageSize(props.pageSize)
    }, [props.pageSize])
    useEffect(() => {
        table.setPageSize(pageSize)
    }, [pageSize])

    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])

    return (
        <div className="flex flex-col space-y-2">
            <div className="w-full flex justify-center space-x-2">
                <nav className="w-[400px] flex justify-center space-x-2">
                    <span className="w-1/3 flex space-x-2">
                        <Button
                            onClick={() => {
                                table.setPageIndex(0)
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronDoubleLeft />}
                        />
                        <Button
                            onClick={() => {
                                table.previousPage()
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronLeft />}
                        />
                    </span>
                    <span className="w-1/3 inline-flex space-x-2 items-end">

                        <NumInput value={table.getState().pagination.pageIndex + 1} />
                        <span className="w-full">
                            <P>
                                of {table.getPageCount()}
                            </P>
                        </span>
                    </span>
                    <span className="w-1/3 space-x-2 flex">
                        <Button
                            onClick={() => {
                                table.nextPage()
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronRight />}
                        />
                        <Button
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronDoubleRight />}
                        />
                    </span>
                </nav>
                <div className="flex flex-row space-x-2 items-end">
                    <Label label="page-size">
                        <P>Rows per page:</P>
                    </Label>
                    <span className="w-24 h-full">
                        <Dropdown
                            label={String(pageSize)}
                            options={[10, 20, 50, 100].map(num => String(num))}
                            handleChange={(element: any) => {
                                setPageSize(parseInt(element))
                            }}
                            id="page-size"
                        />
                    </span>
                </div>
            </div>
            <div className={`h-[${pageSize * 30}px] border dark:border-2 rounded-md ${props.fetchstatus === "fetching" ? "hover:cursor-wait" : ""}`}>
                <table className="table-fixed w-full text-left">
                    <thead className="w-full">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className="w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-12"
                            >
                                <th className="w-8 grow-0"></th>
                                <th className="w-2/3 md:1/2 flex-auto">
                                    <div className="flex flex-row items-center space-x-8">
                                        <span className="shrink-0">
                                            <H3>DID Name</H3>
                                        </span>
                                        <Filter column={table.getColumn("name")} table={table} />
                                    </div>
                                </th>
                                <th className="flex-initial"><H3>Size</H3></th>
                            </tr>
                        ))}
                    </thead>
                    <tbody
                        className="w-full"
                    >
                        {table.getRowModel().rows.map((row) => {
                            const classes = "w-full border-b dark:border-gray-200 hover:cursor-pointer h-16 md:h-8 "  // maybe handle spinnywheel here
                            const classesNormal = classes + "hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 "
                            const classesSelected = classes + "bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                            const did_name = row.original.name
                            const isDIDSelected = selectedDIDs.includes(did_name)
                            return (
                                <tr
                                    className={isDIDSelected ? classesSelected : classesNormal}
                                    key={row.id}
                                    onClick={(event) => {
                                        // if there is no more quota remaining, do nothing on click
                                        if (isDIDSelected) {
                                            setSelectedDIDs(selectedDIDs.filter(id => id !== did_name))
                                        } else {
                                            setSelectedDIDs([...selectedDIDs, did_name])
                                        }
                                        row.getToggleSelectedHandler()(event)
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className={cell.column.id === "quota_bytes" ? "hidden sm:table-cell" : ""}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-1/3 flex justify-center space-x-2">
                    <span className="w-1/3 flex space-x-2">
                        <Button
                            onClick={() => {
                                table.setPageIndex(0)
                            }}
                            disabled={!table.getCanPreviousPage()}
                            label={"<<"}
                        />
                        <Button
                            onClick={() => {
                                table.previousPage()
                            }}
                            disabled={!table.getCanPreviousPage()}
                            label={"<"}
                        />
                    </span>
                    <span className="w-1/3 inline-flex space-x-2">
                        <NumInput
                            value={pageIndex + 1}
                            onChange={(event) => {
                                setPageIndex(event.target.value - 1)
                            }}
                            min={1}
                            max={table.getPageCount()}
                        />
                        <span className="w-full mt-2">
                            <P>
                                of {table.getPageCount()}
                            </P>
                        </span>
                    </span>
                    <span className="w-1/3 space-x-2 flex">
                        <Button
                            onClick={() => {
                                table.nextPage()
                            }}
                            disabled={!table.getCanNextPage()}
                            label={">"}
                        />
                        <Button
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)
                            }}
                            disabled={!table.getCanNextPage()}
                            label={">>"}
                        />
                    </span>
                </div>
            </div>
        </div>
    )
}