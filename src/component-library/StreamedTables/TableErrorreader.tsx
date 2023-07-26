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
                "bg-white",
                className ?? ""
            )}
        >
            {message}
        </div>
    )
}

export const TableErrorreader: React.FC<JSX.IntrinsicElements["div"] & {
    comdom: UseComDOM<BaseViewModel>,
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
                "bg-white dark:bg-gray-800",
                className ?? ""
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
                    "bg-stone-100",
                    "flex flex-col space-y-1 p-1 rounded-md",
                    "h-48 overflow-y-scroll"
                )}
            >
                {comdom.query.data.filter(vm => vm.status === "error").map((vm, i) => {return (
                    <TableErrorelement
                        key={i}
                        message={vm.message ?? "Unknown Error"}
                    />

                )})}
            </div>
        </div>
    );
};
