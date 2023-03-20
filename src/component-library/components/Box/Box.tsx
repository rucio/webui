interface BoxProps {
    title?: string
    body?: any
    footer?: string
    type?: 'condensed' | 'spacious' | 'blue' | 'danger'
}

export const Box = ({
    title = 'Sample Box',
    body = 'box body',
    footer = 'box footer',
    type = 'spacious',
}: BoxProps) => {
    var divClasses: string[] = ["border-gray-400", "dark:border-gray-600"]
    if(type === "condensed") {
        divClasses.push("p-1")
    }
    else {
        divClasses.push("p-4")
    }
    var divTopClasses = divClasses.concat("rounded-t", "border", "dark:border-2")
    var divBodyClasses = divClasses.concat("border-x", "dark:border-x-2", "dark:text-gray-100")
    var divFooterClasses = divClasses.concat("rounded-b", "border", "dark:border-2", "dark:text-white")
    switch(type) {
        case "blue":
            divTopClasses.push("bg-blue-100", "dark:bg-blue-700");
            divFooterClasses.push("bg-blue-100", "dark:bg-blue-700");
            break;
        case "danger":
            divTopClasses.push("bg-red-100", "dark:bg-red-700");
            divFooterClasses.push("bg-red-100", "dark:bg-red-700");
            break;
        default:
            divTopClasses.push("bg-gray-100", "dark:bg-gray-700");
            divFooterClasses.push("bg-gray-100", "dark:bg-gray-700");
            break;
    }
    return (
        <div>
            <div className={divTopClasses.join(" ")}>
                <h3 className="text-xl font-bold dark:text-white">{title}</h3>
            </div>
            <div className={divBodyClasses.join(" ")}>
                {body}
            </div>
            <div className={divFooterClasses.join(" ")}>
                {footer}
            </div>
        </div>
    )
}
