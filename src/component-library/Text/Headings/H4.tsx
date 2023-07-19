import { twMerge } from "tailwind-merge";

type H4Props = JSX.IntrinsicElements["h4"];

export const H4 = (
  { ...props }
) => {
  const {className, ...otherprops} = props
  return (
    <h4
      className={twMerge(
        "text-lg leading-none",
        "dark:text-white",
        className ?? "",
      )}
      {...otherprops}
    >
      {props.children}
    </h4>
  );
};
