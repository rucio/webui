'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    [key: string]: string
}

export function PartyTownStreamWorker() {
    return (
        <Script id="" strategy='worker'>
            
        </Script>
    )
}
function callback(data: any) {
    console.log('data', data)
}

export async function comLinkTest() {
    const streamObjects = wrap(new Worker('/stream_worker.js'))  
    await streamObjects('http://localhost:3000/api/stream', proxy(callback))
}
const Row = ({ data }: RowProps) => {
    return (
        <tr>
            {Object.keys(data).map((key: string) => {
                return <td key={key}>{data[key]}</td>
            })}
        </tr>
    )
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
            return <Row key={row.email} data={row} />
        });
    }, [rows]);

    useEffect(() => {
        comLinkTest();
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
        const initialColumns = ['id', 'name', 'email']
        const initialRows = [
            {
                'id': '1',
                'name': 'John Dosse',
                'email': 'fakeEmail@gmail.com',
            },
            {
                'id': '2',
                'name': 'Jane Doe',
                'email': 'jane.doe@cern.ch',
            }
        ];
        setRows(initialRows);
        setColumns(initialColumns);
    }, []);

    return (
        <>
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
            <StreamingTable />
        </div>
    )
}
