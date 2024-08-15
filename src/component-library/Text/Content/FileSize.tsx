import { twMerge } from "tailwind-merge";

type ByteProps = JSX.IntrinsicElements["span"] & { bytesNumber: number; decimalPlaces?: number }

export const FileSize: React.FC<ByteProps> = (
    {
        bytesNumber,
        decimalPlaces,
        ...props
    }
) => {
    const {className, ...otherprops} = props
    if (bytesNumber === 0) return (
        <span
            className={twMerge(
                className ?? "",
            )}
            {...otherprops}
        >
            0
        </span>
    )
    if(bytesNumber === Infinity) return (
        <span
            className={twMerge(
                className ?? "",
                "text-base-warning-500 text-bold", // placed here to override all other classes for Infinity
            )}
            {...otherprops}
        >
            Infinity
        </span>
    )
    if (isNaN(+bytesNumber)) return (
        <span
            className={twMerge(
                className ?? "",
                "text-base-error-500 text-bold", // placed here to override all other classes for NaN
            )}
            {...otherprops}
        >
            NaN
        </span>
    )

    const base = 1000
    const dm = decimalPlaces ?? 1
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const absnum = Math.abs(bytesNumber)
    const i = Math.floor(Math.log(absnum) / Math.log(base))

    return (
        <span
            className={twMerge(
                className ?? "",
            )}
            {...otherprops}
        >
            {bytesNumber < 0 ? "-" : ""}{`${parseFloat((absnum / Math.pow(base, i)).toFixed(dm))} ${sizes[i]}`}
        </span>
    )
}