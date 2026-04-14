import React from 'react';
import { Table, flexRender, TableState } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';
import { TableStyling } from './types';

export function TableBody<T>(
    props: React.ComponentPropsWithoutRef<'tbody'> & {
        table: Table<T>;
        tablestyling?: TableStyling;
    },
) {
    const { className, ...otherprops } = props;
    const table = props.table;
    return (
        <tbody aria-label="Table Body" className={twMerge(className ?? '')} {...otherprops}>
            {table.getRowModel().rows.map(row => {
                const selected = row.getIsSelected();
                return (
                    <tr
                        key={row.id}
                        className={twMerge(
                            'h-16 md:h-8',
                            selected ? 'bg-brand-200 odd:bg-brand-200' : 'bg-neutral-0 odd:bg-neutral-100', // bg normal
                            selected ? 'dark:bg-brand-500 odd:dark:bg-brand-500' : 'dark:bg-neutral-700 dark:odd:bg-neutral-800', // bg dark
                            selected ? 'hover:bg-brand-300  dark:hover:bg-brand-600' : 'hover:bg-neutral-200 dark:hover:bg-neutral-900', // hover (dark and light)
                            selected ? 'border-brand-400 dark:border-brand-700 border' : '', // handle border when selected
                            row.getCanSelect() ? 'hover:cursor-pointer' : 'hover:cursor-normal', // handle cursor when selectable
                            props.tablestyling?.tableBodyRowStyle ?? '',
                        )}
                        onClick={e => {
                            if (row.getCanSelect()) {
                                row.toggleSelected();
                            }
                        }}
                        role="row"
                        aria-selected={row.getCanSelect() ? selected : undefined} // undefined => not selectable
                    >
                        {row.getVisibleCells().map(cell => {
                            return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}
