import { twMerge } from "tailwind-merge";

export const H2: React.FC<JSX.IntrinsicElements["h2"]> = (
    {...props}
) => {
    const { children, className, ...otherprops } = props;
    return (
        <h2
            className={twMerge(
                "text-2xl font-extrabold leading-none dark:text-white",
                className ?? ""
            )}
            {...otherprops}
        >
            {children}
        </h2>
    )
}