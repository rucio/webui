import { twMerge } from "tailwind-merge";
import { P } from "../Text/Content/P";

// Replaces components/Checkbox/Checkbox.tsx

export const Checkbox: React.FC<
    JSX.IntrinsicElements["label"] &
    { label: string }
> = (
    {
        label,
        ...props
    }
) => {
    const { className, ...otherprops } = props
    return (
        <label
            className={twMerge(
                "flex flex-row items-center space-x-2",
                "hover:cursor-pointer select-none",
                className ?? ""
            )}
        >
            <input
                type="checkbox"
                className={twMerge(
                    "w-4 h-4 hover:cursor-pointer",
                )}
            />
            <P>{label}</P>
        </label>
    );
};
