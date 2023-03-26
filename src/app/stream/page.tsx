'use client'
import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Head from 'next/head';
import { Partytown } from '@builder.io/partytown/react';
import ReactDOM from 'react-dom';
import { debug } from 'util';
import { wrap, proxy } from 'comlink'
import Script from 'next/script';


export type Props = {
    columns: string[],
    endpointUrl: string
}

type RowProps = {
    data: RowData
}

export type RowData = {
    id: number,
    name: string
}

export function PartyTownStreamWorker() {
    return (
        <Script id="" strategy='worker'>
            
        </Script>
    )
}

const Row = ({ data }: RowProps) => {
    return (
        <tr>
            <td>{data.id}</td>
            <td>{data.name}</td>
        </tr>
    )
}

async function comLinkTestWithCallback(callback: (batchID:number, data: any, done: boolean) => void) {
    const streamObjects = wrap(new Worker('/stream_worker.js'))  
    await streamObjects('http://localhost:3000/api/stream', proxy(callback))
}


const StreamingTable = () => {
    const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);
    const [tableBodyRootElement, setTableBodyRootElement] = useState<Root | null>(null);
    const [rows, setRows] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const worker = useRef()
    const rowElements = useMemo(() => {
        return rows.map((row: RowData) => {
            // eslint-disable-next-line react/jsx-key
            return <Row key={row.id} data={row} />
        });
    }, [rows]);

    
    function callback(batchID: number, data: any, done: boolean) {
        console.log('Batch ID:', batchID)
        console.log('Existing Rows:', rows)
        console.log('New Rows:', data.length)
        console.log('Done:', done)
        if (done) {
            console.log('Done')
            // do not add suspense
            return;
        }
        else {
            // add suspense
            const appendElementList = data.map((row: RowData) => {
                // eslint-disable-next-line react/jsx-key
                return <Row key={row.id} data={row} />
            })
            rowElements.push(
                <Suspense fallback={<div>Loading...</div>}>
                </Suspense>
            )
            
        }
        setRows( (prevRowData) => {
            // only return new data
            
            data.forEach((row: RowData) => {
                if (prevRowData.find((prevRow: RowData) => prevRow.id === row.id)) {
                    return;
                }
                prevRowData.push(row);
            })

            return [...prevRowData]
        })
    }
    
    

    useEffect(() => {
        comLinkTestWithCallback(callback);
    }, [])

    useEffect(() => {
        if (tableBodyRootElement === null) {
            console.log('tableBodyRootElement is null')
            return;
        }
        console.log('tableBodyRootElement in other useEffect', tableBodyRootElement)
        // const rowElements = rows.map((row: RowData) => {
        // eslint-disable-next-line react/jsx-key
        // return <Row data={row} />
        // })
        tableBodyRootElement.render(rowElements);
    }, [tableBodyRootElement, rowElements]);


    useEffect(() => {
        if (tableBodyRef === null) {
            console.log('tableBodyRef is null')
            return;
        }
        if (tableBodyRef.current === null) {
            console.log('tableBodyRef.current is null')
            return;
        }
        if (tableBodyRef.current.id === '' || tableBodyRef.current.id === null) {
            console.log('tableBodyRef.current.id is empty')
            return;
        }
        const tableBody = document.getElementById(tableBodyRef.current.id);
        if (tableBody === null) {
            console.log('tableBody is null')
            return;
        }
        if (tableBodyRootElement === null) {
            const root = createRoot(tableBody);
            if (root === null) {
                console.log('root is null')
                return;
            }
            console.log('root', root)
            console.log('Setting tableBodyRootElement')
            setTableBodyRootElement(root);
        }
    }, [tableBodyRef, tableBodyRootElement]);


    useEffect(() => {
        const initialColumns = ['RSE ID', 'RSE Name']
        const initialRows = [
            {
                'id': -1,
                'name': 'test'
            },
            {
                'id': -2,
                'name': 'test2'
            }
        ];
        setRows(initialRows);
        setColumns(initialColumns);
    }, []);

    return (
        <>
            Size: {rows.length}
            <div id='table-container'>
                <table>
                    <thead>
                        <tr>
                            {columns.map((column: string) => {
                                return <th key={column}>{column}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody ref={tableBodyRef} id='table-body'>
                        {/* rows should be dynamically added here */}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default function App(props: Props) {
    return (
        <div>
            <p> Data is streamed from server </p>
            <Suspense fallback={<div>Loading...</div>}>
            <StreamingTable />
            </Suspense>
        </div>
    )
}
