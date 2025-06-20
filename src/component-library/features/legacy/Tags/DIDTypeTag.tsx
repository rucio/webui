import { DIDType } from '@/lib/core/entity/rucio';
import { useState, useEffect, JSX } from 'react';
import { twMerge } from 'tailwind-merge';
import { FC } from 'react';

type DIDTypeTagProps = JSX.IntrinsicElements['span'] & {
    didtype: DIDType;
    forcesmall?: boolean;
    neversmall?: boolean;
};

export const DIDTypeTag: FC<DIDTypeTagProps> = ({ didtype = DIDType.DATASET, forcesmall = false, neversmall = false, ...props }) => {
    // split props into className and rest using spread operator
    const { className, ...restprops } = props;

    const [windowWidth, setWindowWidth] = useState(720);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);
    const belowMedium = windowWidth < 768 || forcesmall;

    const colPicker = (didtype: DIDType) => {
        switch (didtype) {
            case DIDType.CONTAINER:
                return 'bg-extra-emerald-100 text-extra-emerald-800 dark:bg-extra-emerald-900 dark:text-extra-emerald-300';
            case DIDType.DATASET:
                return 'bg-extra-yellow-100 text-extra-yellow-800 dark:bg-extra-yellow-900 dark:text-extra-yellow-300';
            case DIDType.FILE:
                return 'bg-extra-rose-100 text-extra-rose-800 dark:bg-extra-rose-900 dark:text-extra-rose-300';
            case DIDType.COLLECTION:
                return 'bg-neutral-200 text-text-800 dark:bg-neutral-900 dark:text-text-300';
            default:
                return '';
        }
    };

    // switch determining the colour depending on the type
    return (
        <span
            className={twMerge(
                'h-6 rounded text-center flex justify-center items-center',
                !neversmall ? 'w-6 md:w-24 rounded-full md:rounded' : 'w-24',
                forcesmall ? 'w-6 md:w-6 rounded-full md:rounded-full' : '',
                colPicker(didtype),
                className,
            )}
            {...restprops}
        >
            {belowMedium && !neversmall ? didtype.slice(0, 1) : didtype}
        </span>
    );
};
