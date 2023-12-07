import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { useState, useEffect } from "react";
import { HiCheck, HiLifebuoy } from "react-icons/hi2";

export const TableErrorstatus: React.FC<JSX.IntrinsicElements["form"] & { 
    comdom: UseComDOM<any>,
    showDetailedErrors: boolean,
    setShowDetailedErrors: (show: boolean) => void,
}> = ({
    comdom,
    showDetailedErrors,
    setShowDetailedErrors,
    ...props
}) => {
    const { className, ...otherprops } = props
    const [numBadRows, setNumBadRows] = useState<number>(0)
    useEffect(() => {
        const data = comdom.query.data.error
        if (data.length === 1 && data[0].status === "error") {
            // currently this takes precedence over the individual errors
            // expectation is that if only one element and it fails, it's a backend error
            setNumBadRows(-1)
        } else if (data.some((vm) => vm.status === "error")) {
            // individual rows have failed
            setNumBadRows(data.filter((vm) => vm.status === "error").length)
        } else {
            // no failures
            setNumBadRows(0)
        }
    }, [comdom])
    return (
        <form
            className={twMerge(
                "p-1 rounded-md h-8",
                "flex flex-row justify-center space-x-2 md:justify-between",
                numBadRows === -1 ? "bg-red-200 text-red-800" : "",
                numBadRows === 0 ? "bg-green-200 text-green-800" : "",
                numBadRows > 0 ? "bg-amber-200 text-amber-800" : "",
                className ?? ""
            )}
        >
            <span className="font-semibold">
                {numBadRows === -1 ? "Backend Error" : ""}
                {numBadRows === 0 ? "No Errors" : ""}
                {numBadRows === 1 ? "1 Error" : ""}
                {numBadRows > 1 ? `${numBadRows} Errors` : ""}
            </span>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setShowDetailedErrors(!showDetailedErrors);
                }}
                className={twMerge(
                    "rounded-full",
                    numBadRows === -1 ? "hover:bg-red-300 text-red-900" : "",
                    numBadRows > 0 ? "hover:bg-amber-300 text-amber-900" : "",
                )}
                disabled={numBadRows === 0}
                aria-label="Show Errors"
            >
                <HiLifebuoy
                    className={twMerge(
                        "text-2xl",
                        numBadRows === 0 ? "hidden" : "",
                    )}
                    aria-label="Lifebuoy"
                />
                <HiCheck
                    className={twMerge(
                        "text-2xl",
                        numBadRows !== 0 ? "hidden" : "",
                    )}
                />
            </button>
        </form>
    );
};
