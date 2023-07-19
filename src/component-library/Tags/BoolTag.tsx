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
                "mr-2 px-2.5 py-0.5 rounded h-6 flex w-20 justify-center text-center items-center",
                val ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                props.className
            )}
            {...props}
        >
            {val ? "True" : "False"}
        </span>
    )
}