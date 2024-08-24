import {twMerge} from "tailwind-merge";
import React from "react";

export const BadgeCell = (props: { value: string, colorClass: string }) => {
    return <div className={twMerge(
        "text-neutral-100",
        "rounded",
        "inline grow",
        "px-3 m-2",
        "content-center text-center",
        "bg-opacity-50",
        props.colorClass
    )}>
        {props.value}
    </div>;
}

export const badgeCellWrapperStyle = {
    display: 'flex'
};