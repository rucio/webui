import { TimelineLiSpan } from './Helpers/TimelineLiSpan'
import { H3 } from '../Text/Headings/H3'

export const Timeline = (
    props: {
        steps: Array<string>
        active: number
        onJump: (goal: number) => void
    }
) => {
    var noClickClasses = ["flex", "items-center", "gap-2", "bg-white", "dark:bg-gray-900", "p-2", "hover:cursor-default"]
    var clickableClasses = ["flex", "items-center", "gap-2", "bg-white", "dark:bg-gray-900", "p-2", "hover:cursor-pointer"]
    
    return (
        <div className='w-full'>
            <div
                className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100 dark:after:bg-gray-600"
            >
                <ol
                    className="relative z-10 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                    {props.steps.map((element: any, index: number) => {
                        // the black bgs are not actually the same colour, dont understand why
                        return (
                            <li
                                className={index < props.active ? clickableClasses.join(" ") : noClickClasses.join(" ")}
                                key={index}
                                onClick={() => {
                                    if(index < props.active)  {
                                        props.onJump(index)
                                    }
                                }}
                            >
                                <TimelineLiSpan
                                    highlight={index === props.active}
                                    completed={index < props.active}
                                >
                                    {index + 1}
                                </TimelineLiSpan>
                                <span className="hidden sm:block align-middle">
                                    <H3>{element}</H3>
                                </span>
                            </li>
                        )

                    })}
                </ol>
            </div>
        </div >
    )
}
