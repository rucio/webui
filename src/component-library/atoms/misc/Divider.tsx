import React from 'react';
import cn from 'classnames';

export const Divider = ({
    orientation = 'horizontal',
    thickness = 'border',
    color = 'border-neutral-100 dark:border-neutral-700',
    margin = 'my-2',
}) => {
    const isHorizontal = orientation === 'horizontal';

    const classNames = cn(color, thickness, margin, {
        'w-full': isHorizontal,
        'h-full': !isHorizontal,
        'border-t': isHorizontal,
        'border-l': !isHorizontal,
    });

    return <div className={classNames}></div>;
};
