import { flexRender, Row } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Contenttd, Generaltable, Titleth } from '../../../atoms/legacy/helpers/Metatable/Metatable';

type TableBreakout<T> = React.ComponentPropsWithoutRef<'div'> & {
    keys: Record<string, string>; // column id, displayname
    row?: Row<T>;
};

export const TableBreakout = <T,>(props: TableBreakout<T>): React.ReactElement => {
    const [row, setRow] = useState<Row<T> | undefined>(props.row);
    useEffect(() => {
        setRow(props.row);
    }, [props.row]);
    return (
        <div className={twMerge('border-t')}>
            <Generaltable>
                {Object.keys(props.keys).map((key, index) => {
                    return (
                        <tr key={index}>
                            <Titleth>{props.keys[key]}</Titleth>
                            <Contenttd>
                                {row
                                    ? flexRender(
                                          row._getAllCellsByColumnId()[key].column.columnDef.cell,
                                          row._getAllCellsByColumnId()[key].getContext(),
                                      )
                                    : ''}
                            </Contenttd>
                        </tr>
                    );
                })}
            </Generaltable>
        </div>
    );
};
