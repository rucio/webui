export const Box = ({
    title = 'Sample Box',
    body = 'box body',
    footer = 'box footer',
    type = 'spacious',
}: BoxProps) => {
    var divClasses: string[] = ["border-gray-400"]
    if(type === "condensed") {
        divClasses.push("p-1")
    }
    else {
        divClasses.push("p-4")
    }
    var divTopClasses = divClasses.concat("rounded-t", "border")
    var divBodyClasses = divClasses.concat("border-l", "border-r")
    var divFooterClasses = divClasses.concat("rounded-b", "border")
    switch(type) {
        case "blue":
            divTopClasses.push("bg-blue-100");
            divFooterClasses.push("bg-blue-100");
            break;
        case "danger":
            divTopClasses.push("bg-red-100");
            divFooterClasses.push("bg-red-100");
            break;
        default:
            divTopClasses.push("bg-gray-100");
            divFooterClasses.push("bg-gray-100");
            break;
    }
    return (
        <div>
            <div className={divTopClasses.join(" ")}>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className={divBodyClasses.join(" ")}>
                Hello
            </div>
            <div className={divFooterClasses.join(" ")}>
                Hello
            </div>
        </div>
    )
}
