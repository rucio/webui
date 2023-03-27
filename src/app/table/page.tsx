'use client'

import { RSE } from "@/lib/core/entity/rucio"
import { proxy, wrap } from "comlink"
import { useReducer, useState } from "react"
import type { IFetch } from "@/app/query/page"
import { createColumnHelper, useReactTable, getCoreRowModel, TableOptions, flexRender } from "@tanstack/react-table"
import '@/component-library/outputtailwind.css'

const defaultData: RSE[] = [
    {
        id: '-1',
        name: 'T1-UK-London',
        city: 'London',
        country: 'Wakanda',
        continent: 'Africa',
        latitude: 1,
        longitude: 1,
        rse_type: 'DISK',
        volatile: true,
    },
    {
        id: '-2',
        name: 'T1-UK-London',
        city: 'London',
        country: 'Wakanda',
        continent: 'Africa',
        latitude: 1,
        longitude: 1,
        rse_type: 'DISK',
        volatile: true,
    },
    
]

const columnHelper = createColumnHelper<RSE>()

const columns: any[] = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('city', {
        header: 'City',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('country', {
        header: 'Country',
    }),
    columnHelper.accessor('continent', {
        header: 'Continent',
    }),
    columnHelper.accessor('latitude', {
        header: 'Latitude',
    }),
    columnHelper.accessor('longitude', {
        header: 'Longitude',
    }),
    columnHelper.accessor('rse_type', {
        header: 'RSE Type',
    }),
    columnHelper.accessor('volatile', {
        header: 'Volatile',
    }),
]

export default function RSETable() {
    const [rses, setRSEs] = useState<RSE[]>(defaultData)
    const rerender = useReducer(() => ({}), {})[1]

    const table = useReactTable<RSE>({
        data: rses,
        columns: columns,
        getCoreRowModel: getCoreRowModel()
    } as TableOptions<RSE>)

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                List RSEs
            </h1>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </div>
    )



    // const fetchRSEs = async () => {
    //     const worker = new Worker('/fetch_stream.js')
    //     const Fetch = wrap<IFetch>(worker)
    //     const fetcher = await new Fetch(
    //         'http://localhost:3000/api/stream',
    //         proxy(setRSEs),
    //         () => false
    //     )

    // }
}