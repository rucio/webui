import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Titleth: React.FC<React.ComponentPropsWithoutRef<'td'>> = ({ ...props }) => {
    const { className, scope, ...otherprops } = props;
    return (
        <th
            className={twMerge('font-bold w-28 md:w-48 pl-1 dark:text-neutral-0 text-neutral-1000 text-left', className ?? '')}
            scope={scope ?? 'row'}
            {...otherprops}
        >
            {props.children}
        </th>
    );
};
export const Contenttd: React.FC<React.ComponentPropsWithoutRef<'td'>> = ({ ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <td className={twMerge('break-all dark:text-neutral-100 text-neutral-1000 pr-1', className ?? '')} {...otherprops}>
            {props.children}
        </td>
    );
};

export const Generaltable: React.FC<React.ComponentPropsWithoutRef<'table'>> = ({ ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <table
            className={twMerge(
                'bg-neutral-0 dark:bg-neutral-700 text-neutral-1000 dark:text-neutral-0',
                'w-full rounded border-separate border-spacing-y-1',
                className ?? '',
            )}
            {...otherprops}
        >
            <tbody className="w-full">{props.children}</tbody>
        </table>
    );
};
