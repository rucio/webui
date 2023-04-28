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
                "mr-2 px-2.5 py-0.5 rounded h-6 w-full text-center",
                val ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                props.className
            )}
            {...props}
        >
            {val ? "True" : "False"}
        </span>
    )
}