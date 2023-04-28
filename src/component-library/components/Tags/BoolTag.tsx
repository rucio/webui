import { FC, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export type BoolTagProps = JSX.IntrinsicElements["span"] & {val: boolean}

export const BoolTag: FC<BoolTagProps>= (
    {
        val = true,
        ...props
    }
) => {

    return (
        <span
            className={twMerge(
                "rounded-full md:mr-2 md:px-2.5 md:py-0.5 md:rounded w-6 h-6 md:w-full text-center",
                val ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                props.className
            )}
            {...props}
        >
            {val ? "True" : "False"}
        </span>
    )
}