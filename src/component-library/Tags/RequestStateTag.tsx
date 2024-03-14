import { RequestState } from "@/lib/core/entity/rucio"
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type RequestStateTagProps = JSX.IntrinsicElements["span"] & {
    state: RequestState;
    forcesmall?: boolean;
    neversmall?: boolean;
};

export const RequestStateTag: React.FC<RequestStateTagProps> = (
    {
        state = RequestState.SUBMITTED,
        forcesmall = false,
        neversmall = false,
        ...props
    }
) => {
    const { className, ...restprops } = props

    const [windowWidth, setWindowWidth] = useState(720)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        handleResize()
        window.addEventListener('resize', handleResize)
    }, [])
    const belowMedium = (windowWidth < 768) || forcesmall
    const stringMatch = {
        [RequestState.PREPARING]: "Preparing",
        [RequestState.DONE]: "Done",
        [RequestState.FAILED]: "Failed",
        [RequestState.LOST]: "Lost",
        [RequestState.MISMATCH_SCHEME]: "Mismatch Scheme",
        [RequestState.NO_SOURCES]: "No Source",
        [RequestState.ONLY_TAPE_SOURCES]: "Only Tape Sources",
        [RequestState.QUEUED]: "Queued",
        [RequestState.SUBMISSION_FAILED]: "Submission Failed",
        [RequestState.SUBMITTED]: "Submitted",
        [RequestState.SUBMITTING]: "Submitting",
        [RequestState.SUSPEND]: "Suspend",
        [RequestState.WAITING]: "Waiting"
    }

    const colPicker = (state: RequestState) => {
        switch (state) {
            case RequestState.SUBMITTED:
                return "emerald"
            case RequestState.DONE:
                return "blue"
            case RequestState.PREPARING:
            case RequestState.SUSPEND:
            case RequestState.QUEUED:
            case RequestState.SUBMITTING:
            case RequestState.WAITING:
                return "rose"
            case RequestState.FAILED:
            case RequestState.LOST:
            case RequestState.SUBMISSION_FAILED:
                return "amber"
            case RequestState.MISMATCH_SCHEME:
            case RequestState.NO_SOURCES:
            case RequestState.ONLY_TAPE_SOURCES:
                return "gray"
        }
    }

    const color = colPicker(state)

    return (
        <span
            className={twMerge(
                "h-6 rounded text-center flex justify-center items-center",
                "font-bold",
                !neversmall ? "w-6 md:w-24 rounded-full md:rounded" : "w-24",
                forcesmall ? "w-6 md:w-6 rounded-full md:rounded-full" : "",
                `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`,
                className ?? ""
            )}
        >
            {belowMedium && !neversmall ? state : stringMatch[state]}
        </span>
    );
}