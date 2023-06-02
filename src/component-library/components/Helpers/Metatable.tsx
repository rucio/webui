import { twMerge } from "tailwind-merge"

export const Titletd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "font-bold w-28 md:w-48 pl-1 dark:text-white",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}
export const Contenttd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "break-all dark:text-gray-100 pr-1",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}

export const Generaltable: React.FC<JSX.IntrinsicElements["table"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <table
            className={twMerge(
                "bg-white dark:bg-gray-700",
                "w-full rounded border-separate border-spacing-y-1",
                className ?? ""
            )}
            {...otherprops}
        >
            <tbody className="w-full">
                {props.children}
            </tbody>
        </table>
    )
}