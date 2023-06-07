'use client'
import { H3 } from "@/component-library/components/Text/Headings/H3"
import { P } from "@/component-library/components/Text/Content/P"
import { DIDSelectTable } from "@/component-library/components/StreamedTables/DIDSelectTable"

import { twMerge } from "tailwind-merge"

import { useEffect, useState } from "react"

import { DIDLong } from "@/lib/core/entity/rucio"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { createColumnHelper, flexRender, getCoreRowModel, TableOptions, useReactTable, Row } from "@tanstack/react-table"

const columnHelper = createColumnHelper<DIDLong>()



export default function RSEAccountUsage() {

    const {
        query,
        dataSink,
        status,
        comDOMStatus,
        start,
        stop,
        pause,
        resume,
        clean,
        pollInterval,
        errors,
        resolveError,
        resolveAllErrors
    } = useComDOM<DIDLong>(
        'http://localhost:3000/api/listdids',
        [],
        false,
        Infinity,
        200,
        true
    )

    return (
        <div className="dark:bg-gray-900">
            <div className="flex-row">
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={async () => {
                    console.log("starting")
                    await start()
                }}>Start</button>
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={async () => {
                    await stop()
                }}>Stop</button>
                <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={async () => {
                    pause()
                }}>Pause</button>
                <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={resume}>Resume</button>
                <button className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={clean}>Clean</button>
                <div className="flex flex-row">Poll Interval: {pollInterval}</div>
            </div>
            <div className="p-4">
                <DIDSelectTable
                    tableData={{
                        data: query.data,
                        fetchStatus: query.fetchStatus,
                        pageSize: 10
                    }}
                    onChange={(selected: string[]) => {}}
                />
            </div>
            <P>{query.fetchStatus}. The selection state of the table is printed to the console each time the state changes.</P>
        </div>
    )
}