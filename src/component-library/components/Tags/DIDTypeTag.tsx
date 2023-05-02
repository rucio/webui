import { DIDType } from "@/lib/core/data/rucio-dto"
import { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { FC } from "react"

type DIDTypeTagProps = JSX.IntrinsicElements["span"] & {
    didtype: DIDType;
    forcesmall?: boolean;
    neversmall?: boolean;
};

export const DIDTypeTag: FC<DIDTypeTagProps> = (
    {
        didtype = "Dataset",
        forcesmall = false,
        neversmall = false,
        ...props
    }
) => {

    // split props into className and rest using spread operator
    const { className, ...restprops } = props

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
    }, [])
    const belowMedium = (windowWidth < 768) || forcesmall

    const colPicker = (didtype: DIDType) => {
        switch (didtype.toUpperCase()) {
            case "CONTAINER":
                return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
            case "DATASET":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
            case "FILE":
                return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
            case "COLLECTION":
                return "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300"
            default:
                return ""
        }
    }

    // switch determining the colour depending on the type
    return (
        <span
            className={twMerge(
                "rounded-full md:rounded w-6 h-6 md:w-24 text-center flex justify-center items-center",
                colPicker(didtype),
                className
            )}
            {...restprops}
        >
            {belowMedium && !neversmall ? didtype.slice(0, 1) : didtype }
        </span>
    )
}