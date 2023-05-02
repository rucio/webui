import { DIDType } from "@/lib/core/data/rucio-dto"
import { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { FC } from "react"

type DIDTypeTagProps = JSX.IntrinsicElements["span"] & {
    didtype: DIDType;
    forcesmall?: boolean;
};

export const DIDTypeTag : FC<DIDTypeTagProps>= (
    {
        didtype="CONTAINER",
        forcesmall=false,
        ...props
    }
) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
    }, [])
    const belowMedium = (windowWidth < 768) || forcesmall

    const baseClasses = "rounded-full md:rounded w-6 h-6 md:w-24 text-center flex justify-center items-center"
    var classes// done this way so tailwind compiles
    // switch determining the colour depending on the type
    switch (didtype.toUpperCase()) {
        case "CONTAINER":
            return (
                <span
                    className={twMerge(
                        baseClasses,
                        "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
                        props.className
                    )}
                    {...props}
                >
                    {belowMedium ? "C" : "Container"}
                </span>
            )
        case "DATASET":
            return (
                <span
                    className={twMerge(
                        baseClasses,
                        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    )}
                    {...props}
                >
                    {belowMedium ? "D" : "Dataset"}
                </span>
            )
        case "FILE":
            return (
                <span
                    className={twMerge(
                        baseClasses,
                        "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
                        props.className
                    )}
                    {...props}
                >
                    {belowMedium ? "F" : "File"}
                </span>
            )
        case "COLLECTION":
            return (
                <span
                    className={twMerge(
                        baseClasses,
                        "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300",
                        props.className
                    )}
                    {...props}
                >
                    {belowMedium ? "CL" : "Collection"}
                </span>
            )
        default:
            return (<span></span>)
    }
}