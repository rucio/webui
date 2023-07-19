import { twMerge } from "tailwind-merge";
import { HiExternalLink } from "react-icons/hi";

export const TableExternalLink: React.FC<JSX.IntrinsicElements["a"] & { label: string }> = (
    {
        label,
        ...props
    }
) => {
    const { className, children, ...otherprops } = props;
    return (

        <a
            className={twMerge(
                "px-1 rounded",
                "flex flex-row items-center",
                "bg-blue-500 hover:bg-blue-600 text-white",
                className ?? "",
            )}
            {...otherprops}
        >
            <HiExternalLink />
            <span>{label}</span>
            {children}
        </a>
    );
};
