'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Head from 'next/head';
import { Partytown } from '@builder.io/partytown/react';

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
    const workerRef = useRef<Worker>();
    const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);
    const [rows, setRows] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
    const dataRoot = useMemo(() => {
        return rootElement ? createRoot(rootElement) : null;
    }, [rootElement]);

    useEffect(() => {
        const tableBody = document.getElementById('table-body');
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
        if(rootElement === null) {
            setRootElement(tableBody);
        }
        console.log('Setting initial rows and root element')
    }, [rootElement]);

    useEffect(() => {
        // const tableBody = document.getElementById('table-body');
        const tableBody = tableBodyRef.current;
        if (tableBody === null) {
            console.log('tableBody is null')
            return;
        }
        if (dataRoot === null) {
                console.log('dataRoot is null')
                return;
        }
        // const dataRoot = createRoot(tableBody);
        console.log('dataRoot', dataRoot)
        console.log('rows', rows)
        if (tableBody) {
            tableBody.innerHTML = '';
            rows.forEach((row: RowData) => {
                const rowReactElement = <Row data={row} />
                console.log('rowData', row)
                dataRoot.render(rowReactElement);
                // const rowElement = document.createElement('tr');
                // Object.keys(row).forEach((key: string) => {
                // const cell = document.createElement('td');
                // cell.innerText = row[key];
                // rowElement.appendChild(cell);
                // });
                // tableBody.appendChild(rowElement);
            })
        }
    }, [rows, dataRoot]);

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
