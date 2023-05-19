import { HiCheck, HiX } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

type CheckmarkTagProps = JSX.IntrinsicElements["span"] & {val: boolean}

export const CheckmarkTag = (
  {
    val = true,
    ...props
  }
) => {
  const { className, ...otherprops } = props;
  return (
    <span
      className={twMerge(
        "h-6 w-6 rounded-full flex justify-center text-center items-center",
        val ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        "font-bold",
        className
      )}
      {...otherprops}
    >
      {val ? <HiCheck/> : <HiX/>}
    </span>
  );
};
