import { twMerge } from 'tailwind-merge';
import { H3 } from '../../../atoms/legacy/text/headings/H3/H3';
import { useState, useEffect } from 'react';
import { Column } from '@tanstack/react-table';

type TableFilterDiscrete<T> = JSX.IntrinsicElements['div'] & {
    name: string;
    keys: T[];
    renderFunc: (key: T | undefined) => JSX.Element;
    column: Column<any, T>; // to be a tanstack column
    stack?: boolean; // whether to use column instead of row
};

export function TableFilterDiscrete<T>(props: TableFilterDiscrete<T>): JSX.Element {
    // split up props
    const { name, keys, renderFunc, column, stack, ...otherprops } = props;
    const { className, ...otherdivprops } = otherprops;

    /* create a map of next values
    supposed to be cyclic "undefined" (string) -> keys (T) -> undefined
    using undefined as a key is not allowed, so we use "undefined" (string) instead
    also works well with tanstack: undefined is the default value
    */
    type ExtendedT = string | T | undefined;
    const extendedkeys = (['undefined'] as ExtendedT[]).concat(keys).concat([undefined]);
    const nextMap = new Map<ExtendedT, ExtendedT>();
    extendedkeys.slice(0, -1).map((key, i) => {
        nextMap.set(key, extendedkeys[(i + 1) % extendedkeys.length]);
    });

    // handle state internally
    const [filter, setFilter] = useState<T | undefined>(undefined);
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
                setFilter(nextMap.get(filter ?? 'undefined') as T | undefined);
            }}
            {...otherdivprops}
        >
            <H3 className="hidden md:inline">{name}</H3>
            {renderFunc(filter)}
        </div>
    );
}
