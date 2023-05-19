import { RSEBlockState } from "@/lib/core/entity/rucio";
import { HiMinusCircle } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

export const RSEBlockTag: React.FC<JSX.IntrinsicElements["span"] & { block: "Read" | "Write" | "Delete"}> = (
  {
    block,
    ...props
  }
) => {
  const { className, ...otherprops } = props
  return (
    <span
      className={twMerge(
        "flex flex-row justify-start items-center space-x-1 w-fit px-1 rounded",
        "bg-black",
        "text-white font-semibold",
        "dark:border dark:border-white",
        className ?? "",
      )}
      {...otherprops}
    >
      <HiMinusCircle className="text-xl"/>
      <span>{block}</span>
    </span>
  );
};
