import { twMerge } from 'tailwind-merge';
import { RSEType } from '@/lib/core/entity/rucio';
import React, { useState, useEffect } from 'react';

type RSETypeTagProps = React.ComponentPropsWithoutRef<'span'> & {
    rsetype: RSEType;
    forcesmall?: boolean;
    neversmall?: boolean; // obviously dont use these two together
};

export const RSETypeTag: React.FC<RSETypeTagProps> = ({ rsetype = RSEType.DISK, neversmall = false, forcesmall = false, ...props }) => {
    // split props into className and rest using spread operator
    const { className, ...restprops } = props;

    const [windowWidth, setWindowWidth] = useState(720);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);
    const belowMedium = windowWidth < 768 || forcesmall;
    const stringMatch = {
        [RSEType.DISK]: 'Disk',
        [RSEType.TAPE]: 'Tape',
        [RSEType.UNKNOWN]: 'Unknown',
    };
    return (
        <span
            className={twMerge(
                'h-6 rounded text-center flex justify-center items-center',
                'font-bold',
                !neversmall ? 'w-6 md:w-24 rounded-full md:rounded' : 'w-24',
                forcesmall ? 'w-6 md:w-6 rounded-full md:rounded-full' : '',
                rsetype === RSEType.DISK
                    ? 'bg-extra-emerald-100 text-extra-emerald-800 dark:bg-extra-emerald-900 dark:text-extra-emerald-300'
                    : rsetype === RSEType.TAPE
                    ? 'bg-extra-rose-100 text-extra-rose-800 dark:bg-extra-rose-900 dark:text-extra-rose-300'
                    : '',
                className ?? '',
            )}
        >
            {belowMedium && !neversmall ? stringMatch[rsetype].slice(0, 1) : stringMatch[rsetype]}
        </span>
    );
};
