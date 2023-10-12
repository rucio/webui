import { RequestType } from "@/lib/core/entity/rucio";
import { RowSelection } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type RequestTypeTagProps = JSX.IntrinsicElements["span"] & {
    requesttype: RequestType;
    forcesmall?: boolean;
    neversmall?: boolean;
};

export const RequestTypeTag: React.FC<RequestTypeTagProps> = (
    {
        requesttype = RequestType.TRANSFER,
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
        [RequestType.UPLOAD]: "Upload",
        [RequestType.DOWNLOAD]: "Download",
        [RequestType.STAGEIN]: "Stage In",
        [RequestType.STAGEOUT]: "Stage Out",
        [RequestType.TRANSFER]: "Transfer"
    }

    const colPicker = (requesttype: RequestType) => {
        switch (requesttype) {
            case RequestType.UPLOAD:
                return "emerald"
            case RequestType.DOWNLOAD:
                return "blue"
            case RequestType.STAGEIN:
                return "rose"
            case RequestType.STAGEOUT:
                return "amber"
            case RequestType.TRANSFER:
                return "gray"
        }
    }

    const color = colPicker(requesttype)

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
            {belowMedium && !neversmall ? stringMatch[requesttype].split(' ').slice(-1)[0].slice(0, 1) : stringMatch[requesttype]}
        </span>
    );
};