import { twMerge } from 'tailwind-merge';
import { H3 } from '../../../atoms/legacy/text/headings/H3/H3';
import { Column } from '@tanstack/react-table';
import React, { useState } from 'react';
import { HiSortAscending, HiSortDescending, HiDotsHorizontal } from 'react-icons/hi';

export function TableSortUpDown(
    props: React.ComponentPropsWithoutRef<'div'> & {
        name: string;
        column: Column<any, any>;
        element?: React.ReactElement; // to replace name
        stack?: boolean; // whether to use column instead of row
        nocollapse?: boolean;
    },
): React.ReactElement {
    const { name, column, element, stack, nocollapse, ...otherprops } = props;
    const { className, ...otherdivprops } = otherprops;
    type updown = 'null' | 'desc' | 'asc';
    const [state, setState] = useState<updown>('null');
    const next = {
        null: 'desc',
        desc: 'asc',
        asc: 'null',
    };
    return (
        <div
            className={twMerge(
                'flex justify-between',
                !stack ? 'flex-row space-x-2 h-6' : 'flex-col space-y-1',
                'items-center',
                'select-none cursor-pointer',
                className ?? '',
            )}
            onClick={e => {
                column.toggleSorting();
                setState(next[state] as updown);
            }}
            {...otherdivprops}
        >
            {element ?? <H3 className={props.nocollapse ? 'inline hover:text-brand-500' : 'hidden md:inline hover:text-brand-500'}>{name}</H3>}
            <span className="text-text-500 dark:text-text-200 hover:text-brand-500 text-2xl h6">
                {
                    {
                        asc: <HiSortAscending />,
                        desc: <HiSortDescending />,
                        null: <HiDotsHorizontal />,
                    }[state]
                }
            </span>
        </div>
    );
}
