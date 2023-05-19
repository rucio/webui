import { twMerge } from "tailwind-merge";

export const SubPage: (
    React.FC<JSX.IntrinsicElements["div"] & { show: boolean; children?: any }>
) = (
    {
        show = false,
        ...allprops
    }
) => {
        const { className, children, ...props } = allprops
        return (
            <div
                className={twMerge(
                    show ? "block" : "hidden",
                    "grow rounded-b-md",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }