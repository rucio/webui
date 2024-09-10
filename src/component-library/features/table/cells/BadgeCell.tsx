import React from 'react';
import { twMerge } from 'tailwind-merge';

export const BadgeCell = (props: { value: string; colorClass: string }) => {
    const badgeClasses = twMerge(
        'inline grow',
        'flex justify-center items-center',
        'rounded',
        'px-3 m-2',
        'text-neutral-900 dark:text-neutral-100',
        props.colorClass,
        'bg-opacity-50',
    );

    return <div className={badgeClasses}>{props.value}</div>;
};

export const badgeCellWrapperStyle = {
    display: 'flex',
};
