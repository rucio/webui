import { twMerge } from "tailwind-merge"
var format = require("date-format")

export const DateTag: React.FC<JSX.IntrinsicElements["span"] & { date: Date, dateFormat?: string }> = (
    {
        date,
        dateFormat,
        ...props
    }
) => {
    const {className, ...otherprops} = props
    const df = dateFormat ?? "yyyy-MM-dd"
    return (
        <span
            className={twMerge(
                "dark:text-white",
                className ?? "",
            )}
            {...otherprops}
        >
            {format(df, date)}
        </span>
    )
}