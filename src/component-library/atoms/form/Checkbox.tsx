import React from 'react';
import {twMerge} from "tailwind-merge";
import {HiCheck} from "react-icons/hi";

interface CheckboxProps {
    checked?: boolean;
    onClick?: () => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({checked = false, onClick, className}) => {
    const enabledClasses = twMerge('bg-base-success-600', 'bg-opacity-80 dark:bg-opacity-60');

    const disabledClasses = twMerge(
        'border-solid border',
        'border-neutral-800 dark:border-neutral-100',
        'border-opacity-20 dark:border-opacity-20',
        'bg-neutral-200 dark:bg-neutral-900',
    );

    return (
        <div
            className={twMerge(
                'inline-flex',
                'justify-center items-center',
                'h-5 w-5',
                'rounded',
                'text-center',
                checked ? enabledClasses : disabledClasses,
            )}
            onClick={onClick}
        >
            {checked && <HiCheck className="text-neutral-100"/>}
        </div>
    );
};

export default Checkbox;