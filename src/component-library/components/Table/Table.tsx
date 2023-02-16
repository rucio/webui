import './table.scss'

import { ReactElement } from 'react'

export const Table = ({ columns, rows, id, footer }: TableProps) => {
    return (
        <div className="table-container">
            <table
                className="rucio-table bordered striped narrow hoverable fullwidth"
                id={id}
            >
                <thead>
                    <tr>
                        {columns?.map((columnTitle: string, index: number) => (
                            <th key={index}>
                                <abbr title={columnTitle}>{columnTitle}</abbr>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows?.map((rowData: ReactElement[], index: number) => (
                        <tr
                            key={index}
                            id={(id as string) + '_' + index}
                            className="display-row-data"
                            onClick={() => {
                                const currentSelectedRow =
                                    document.getElementById(
                                        (id as string) + '_' + index,
                                    )
                                if (currentSelectedRow) {
                                    currentSelectedRow.className =
                                        currentSelectedRow.className ===
                                        'selected'
                                            ? ''
                                            : 'selected'
                                }
                            }}
                        >
                            <th>{index + 1}</th>
                            {rowData?.map(
                                (rowElement: ReactElement, index: number) => (
                                    <td key={index}>
                                        {typeof rowElement === 'boolean'
                                            ? (rowElement as boolean).toString()
                                            : rowElement}
                                    </td>
                                ),
                            )}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        {footer?.map((footerTitle: string, index: number) => (
                            <th key={index}>
                                <abbr title={footerTitle}>{footerTitle}</abbr>
                            </th>
                        ))}
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
