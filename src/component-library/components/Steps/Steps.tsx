import { StepsLispan } from "./StepsLispan"
export const Steps = ({ steps = [], active = 1, size }: StepsProps) => {
    var classes = ["flex", "grow","items-center", "before:content-['']", "before:w-full", "before:h-1", "before:border-b", "before:border-4"]
    var blue_classes = classes.concat("before:border-blue-200", "dark:before:border-blue-400")
    var gray_classes = classes.concat("before:border-gray-200", "dark:before:border-gray-600")
    return (
        <div className='w-full'>
            <ol className="flex items-center w-full font-medium text-center text-gray-500 dark:text-gray-200">
                {steps.map((element: any, index: number) => {
                    return index === 0 ? (
                        /* leftmost */
                        <li className="flex grow-0 items-center" key={index}>
                            {index === active ? (<StepsLispan blue body={element?.[1]}/>) : (<StepsLispan body={element?.[1]}/>)}
                        </li>
                    ) : index < active ? (
                        /* completed */
                        <li className={blue_classes.join(" ")} key={index}>
                            <StepsLispan body={element?.[1]}/>
                        </li>
                    ) : index === active ? (
                        /* active */
                        <li className={blue_classes.join(" ")} key={index}>
                            <StepsLispan blue body={element?.[1]}/>
                        </li>
                    ) : (
                        /* not completed */
                        <li className={gray_classes.join(" ")}>
                            <StepsLispan body={element?.[1]}/>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
