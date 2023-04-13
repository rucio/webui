import { DIDType } from "@/lib/core/data/rucio-dto"
import { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"

export const DIDTypeTag = (
    props: {
        type: DIDType,
    }
) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
    }, [])
    const belowMedium = windowWidth < 768

    const baseClasses = ["rounded-full md:mr-2 md:px-2.5 md:py-0.5 md:rounded w-6 h-6 md:w-24 text-center"]
    var classes// done this way so tailwind compiles
    // switch determining the colour depending on the type
    switch (props.type.toUpperCase()) {
        case "CONTAINER":
            return (
                <span className={twMerge(baseClasses, "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300")}>
                    {belowMedium ? "C" : "Container"}
                </span>
            )
        case "DATASET":
            return (
                <span className={twMerge(baseClasses, "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300")}>
                    {belowMedium ? "D" : "Dataset"}
                </span>
            )
        case "FILE":
            return (
                <span className={twMerge(baseClasses, "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300")}>
                    {belowMedium ? "F" : "File"}
                </span>
            )
        default:
            return (<></>)
    }
}