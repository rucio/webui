import { twMerge } from "tailwind-merge";

type ByteProps = JSX.IntrinsicElements["span"] & { number: number; decimalPlaces?: number }

export const Number: React.FC<ByteProps> = (
    {
        number,
        decimalPlaces,
        ...props
    }
) => {
    const {className, ...otherprops} = props
    if (number === 0) return (
        <span
            className={twMerge(
                className ?? "",
            )}
            {...otherprops}
        >
            0
        </span>
    )
    if (isNaN(+number)) return (
        <span
            className={twMerge(
                className ?? "",
                "text-red-500 text-bold", // placed here to override all other classes for NaN
            )}
            {...otherprops}
        >
            NaN
        </span>
    )

    const base = 1000
    const dm = decimalPlaces ?? 1
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const absnum = Math.abs(number)
    const i = Math.floor(Math.log(absnum) / Math.log(base))

    return (
        <span
            className={twMerge(
                className ?? "",
            )}
            {...otherprops}
        >
            {number < 0 ? "-" : ""}{`${parseFloat((absnum / Math.pow(base, i)).toFixed(dm))} ${sizes[i]}`}
        </span>
    )
}