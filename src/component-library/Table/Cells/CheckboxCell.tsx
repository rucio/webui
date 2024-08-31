import {twMerge} from "tailwind-merge";
import {HiCheck} from "react-icons/hi";
import React from "react";

export const CheckboxCell = (props: { value: string }) => {
    const enabledClasses = twMerge(
        "bg-base-success-600",
        "bg-opacity-80 dark:bg-opacity-60"
    );

    const disabledClasses = twMerge(
        "border-solid border",
        "border-neutral-800 dark:border-neutral-100",
        "border-opacity-20 dark:border-opacity-20",
        "bg-neutral-200 dark:bg-neutral-900"
    );

    return <div className={twMerge(
        "flex",
        "justify-center items-center",
        "h-5 w-5",
        "rounded",
        "text-center",
        props.value ? enabledClasses : disabledClasses
    )}>
        {props.value && <HiCheck className="text-neutral-100"/>}
    </div>
}

export const checkboxCellWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};