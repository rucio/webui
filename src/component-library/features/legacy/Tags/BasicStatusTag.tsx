import React, { useEffect, useState } from 'react';

export type BasicStatusTagProps = {
    text: string;
    status: 'success' | 'error' | 'warning' | 'info';
};
export const BasicStatusTag: React.FC<
    React.ComponentPropsWithoutRef<'span'> & {
        text: string;
        status: 'success' | 'error' | 'warning' | 'info';
    }
> = ({ text = 'Check this out!', status, ...props }: BasicStatusTagProps) => {
    const colorFn = (status: 'success' | 'error' | 'warning' | 'info') => {
        switch (status) {
            case 'success':
                return 'bg-base-success-300 dark:bg-base-success-600';
            case 'error':
                return 'bg-base-error-300 dark:bg-base-error-600';
            case 'warning':
                return 'bg-base-warning-300 dark:bg-base-warning-600';
            case 'info':
                return 'bg-base-info-300 dark:bg-base-info-600';
            default:
                return 'bg-base-success-300 dark:bg-base-sucess-600';
        }
    };
    const [color, setColor] = useState<string>();
    useEffect(() => {
        setColor(colorFn(status));
    }, [status]);
    return (
        <span
            key={status}
            className={`${color} text-neutral-1000 dark:text-neutral-0 font-bold w-6 md:w-24 rounded text-center select-none flex justify-center items-center`}
        >
            {text}
        </span>
    );
};
