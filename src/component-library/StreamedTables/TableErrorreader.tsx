import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { H3 } from "@/component-library/Text/Headings/H3";
import { twMerge } from "tailwind-merge";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { Button } from "@/component-library/Button/Button";

const TableErrorelement: React.FC<JSX.IntrinsicElements["div"] & {message: string}> = (
    {message, ...props}
) => {
    const {className, ...otherprops} = props
    return (
        <div
            className={twMerge(
                "border rounded-md p-1",
                "bg-neutral-0",
                className ?? ""
            )}
        >
            {message}
        </div>
    )
}

export const TableErrorreader: React.FC<JSX.IntrinsicElements["div"] & {
    comdom: UseComDOM<any>,
    showDetailedErrors: boolean,
    setShowDetailedErrors: (show: boolean) => void,
}> = (
    {comdom, showDetailedErrors, setShowDetailedErrors, ...props}
) => {
    const {className, ...otherprops} = props
    return (
        <div
            className={twMerge(
                "border rounded-md p-1",
                "bg-neutral-0 dark:bg-neutral-800",
                className ?? "text-text-1000 dark:text-text-0"
            )}
        >
            <div
                className={twMerge("flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 sm:justify-between")}
            >
                <H3 className="mt-2 mb-1">Errors</H3>
                <Button
                    label="Close"
                    type="reset"
                    onClick={(e) => {setShowDetailedErrors(!showDetailedErrors)}}
                    className="w-24"
                />
            </div>
            <div
                className={twMerge(
                    "bg-neutral-100 dark:bg-neutral-900",
                    "flex flex-col space-y-1 p-1 rounded-md",
                    "h-48 overflow-y-scroll"
                )}
            >
                {comdom.query.data.error.filter(vm => vm.status === "error").map((vm, i) => {return (
                    <TableErrorelement
                        key={i}
                        message={vm.message ?? "Unknown Error"}
                        className="dark:bg-neutral-800 bg-neutral-0"
                    />

                )})}
            </div>
        </div>
    );
};
