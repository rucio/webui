import { twMerge } from 'tailwind-merge';
import { H3 } from '../Text/Headings/H3';
import { useState, useEffect } from 'react';
import { Column } from '@tanstack/react-table';
import { HiDotsHorizontal } from 'react-icons/hi';
import { BoolTag } from '../Tags/BoolTag';

type TableFilterBoolean = JSX.IntrinsicElements['div'] & {
    name: string;
    column: Column<any, boolean>; // to be a tanstack column
    stack?: boolean; // whether to use column instead of row
};

export function TableFilterBoolean<T>(props: TableFilterBoolean): JSX.Element {
    // split up props
    const { name, column, stack, ...otherprops } = props;
    const { className, ...otherdivprops } = otherprops;

    // function to set next value
    const next = (val: boolean | undefined) => {
        if (val === undefined) {
            return true;
        } else if (val === true) {
            return false;
        } else {
            return undefined;
        }
    };

    // handle state internally
    const [filter, setFilter] = useState<boolean | undefined>(undefined);
    // connect to table
    useEffect(() => {
        column.setFilterValue(filter);
    }, [filter, column]);
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
                setFilter(next(filter ?? undefined));
            }}
            {...otherdivprops}
        >
            <H3 className="hidden md:inline">{name}</H3>
            {filter === undefined ? <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" /> : <BoolTag val={filter} />}
        </div>
    );
}
