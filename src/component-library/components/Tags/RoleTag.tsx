import { Role } from "@/lib/core/entity/account";
import { twMerge } from "tailwind-merge";

export const RoleTag: React.FC<JSX.IntrinsicElements["span"] & {role: Role}> = (
    {
        role,
        ...props
    }
) => {
    return (
        <span
            className={twMerge(
                role === Role.ADMIN ? "bg-fuchsia-200 dark:bg-fuchsia-700" : (
                    role === Role.USER ? "bg-lime-200 dark:bg-lime-700" : ""
                ),
                "text-black dark:text-white",
                "w-24 h-6 rounded text-center select-none",
                "flex flex-row justify-center items-center",
            )}
        >
            {role}
        </span>
    );
};
