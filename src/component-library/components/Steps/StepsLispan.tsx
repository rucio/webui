interface StepsLispanProps {
    blue?: boolean
    body?: any
}

export const StepsLispan = ({
    blue = false,
    body = null,
}: StepsLispanProps) => {
    var classes = ["flex", "items-center", "font-medium", "text-center", "p-2", "rounded-lg"]
    if (blue) {
        classes.push("text-blue-600", "dark:text-blue-500", "bg-blue-100")
    }
    else {
        classes.push("text-gray-500", "dark:text-gray-200", "bg-gray-100", "dark:bg-gray-700")
    }
    return (
        <span className={classes.join(" ")}>
            {body}
        </span>
    )
}