import { twMerge } from "tailwind-merge"

export const H3: React.FC<JSX.IntrinsicElements["h3"]> = (
    {...props}
) => {
    const { className, ...otherprops } = props
    return (
        <h3
            className={twMerge(
                "text-xl leading-none dark:text-white",
                className ?? "",
            )}
            {...otherprops}
        >
            {props.children}
        </h3>
    )
}