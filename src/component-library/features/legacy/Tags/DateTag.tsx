import React from 'react';
import { twMerge } from 'tailwind-merge';
const format = require('date-format');

export const DateTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { date: Date; dateFormat?: string }> = ({ date, dateFormat, ...props }) => {
    const { className, ...otherprops } = props;
    const df = dateFormat ?? 'yyyy-MM-dd';
    return (
        <span className={twMerge('text-neutral-1000 dark:text-neutral-0', className ?? '')} {...otherprops}>
            {format(df, date)}
        </span>
    );
};
