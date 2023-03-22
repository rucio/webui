export const TimelineLiSpan = (props: {
    children: any,
    highlight?: boolean,
}) => {
    var classes = ["h-6", "w-6", "rounded-full", "text-center", "text-[10px]", "font-bold", "leading-6"]
    var highlightClasses = classes.concat("bg-blue-600", "text-white")
    var normalClasses = classes.concat("bg-gray-100", "dark:bg-gray-600")
    return (
        <span className={props.highlight ? highlightClasses.join(" ") : normalClasses.join(" ")}>
            {props.children}
        </span>
    )
}