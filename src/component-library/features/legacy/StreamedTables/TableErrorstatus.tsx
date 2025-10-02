import { twMerge } from 'tailwind-merge';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import React, { useState, useEffect } from 'react';
import { HiCheck, HiLifebuoy } from 'react-icons/hi2';

export const TableErrorstatus: React.FC<
    React.ComponentPropsWithoutRef<'form'> & {
        comdom: UseComDOM<any>;
        showDetailedErrors: boolean;
        setShowDetailedErrors: (show: boolean) => void;
    }
> = ({ comdom, showDetailedErrors, setShowDetailedErrors, ...props }) => {
    const { className, ...otherprops } = props;
    const [numBadRows, setNumBadRows] = useState<number>(0);
    useEffect(() => {
        const data = comdom.query.data.error;
        if (data.length === 1 && data[0].status === 'error') {
            // currently this takes precedence over the individual errors
            // expectation is that if only one element and it fails, it's a backend error
            setNumBadRows(-1);
        } else if (data.some(vm => vm.status === 'error')) {
            // individual rows have failed
            setNumBadRows(data.filter(vm => vm.status === 'error').length);
        } else {
            // no failures
            setNumBadRows(0);
        }
    }, [comdom]);
    return (
        <form
            className={twMerge(
                'p-1 rounded-md h-8',
                'flex flex-row justify-center space-x-2 md:justify-between',
                numBadRows === -1 ? 'bg-base-error-200 text-base-error-800' : '',
                numBadRows === 0 ? 'bg-base-success-200 text-base-success-800' : '',
                numBadRows > 0 ? 'bg-base-warning-200 text-base-warning-800' : '',
                className ?? '',
            )}
        >
            <span className="font-semibold">
                {numBadRows === -1 ? 'Backend Error' : ''}
                {numBadRows === 0 ? 'No Errors' : ''}
                {numBadRows === 1 ? '1 Error' : ''}
                {numBadRows > 1 ? `${numBadRows} Errors` : ''}
            </span>
            <button
                onClick={e => {
                    e.preventDefault();
                    setShowDetailedErrors(!showDetailedErrors);
                }}
                className={twMerge(
                    'rounded-full',
                    numBadRows === -1 ? 'hover:bg-base-error-300 text-base-error-900' : '',
                    numBadRows > 0 ? 'hover:bg-base-warning-300 text-base-warning-900' : '',
                )}
                disabled={numBadRows === 0}
                aria-label="Show Errors"
            >
                <HiLifebuoy className={twMerge('text-2xl', numBadRows === 0 ? 'hidden' : '')} aria-label="Lifebuoy" />
                <HiCheck className={twMerge('text-2xl', numBadRows !== 0 ? 'hidden' : '')} />
            </button>
        </form>
    );
};
