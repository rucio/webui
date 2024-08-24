import {twMerge} from "tailwind-merge";
import {HiCheck} from "react-icons/hi";
import React from "react";

export const CheckboxCell = (props: { value: string }) => {
    return <div className={twMerge(
        "flex justify-center items-center",
        "h-5 w-5",
        "rounded",
        "text-center",
        props.value ? "bg-base-success-600 bg-opacity-60" : "bg-neutral-900 border-solid border border-neutral-100 border-opacity-20"
    )}>
        {props.value && <HiCheck className="text-neutral-100 text"/>}
    </div>
}

export const checkboxCellWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};