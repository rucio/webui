import { TimelineLiSpan } from './Helpers/TimelineLiSpan'

interface TimelineProps {
    steps: Array<string>,
    active: number
}

export const Timeline = ({
    steps = [],
    active = 1
}: TimelineProps) => {
    return (
        <div className='w-full'>
            <div
                className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100 dark:after:bg-gray-600"
            >
                <ol
                    className="relative z-10 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                    {steps.map((element: any, index: number) => {
                        // the black bgs are not actually the same colour, dont understand why
                        return (
                            <li className="flex items-center gap-2 bg-white dark:bg-[#1B1C1D] p-2" key={index}>
                                <TimelineLiSpan highlight={index === active ? true : false}>
                                    {index + 1}
                                </TimelineLiSpan>
                                <span className="hidden sm:block">{element}</span>
                            </li>
                        )

                    })}
                </ol>
            </div>
        </div >
    )
}
