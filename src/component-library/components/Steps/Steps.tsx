import './steps.scss'

export const Steps = ({ steps = [], active = 1, size }: StepsProps) => {
    return (
        <div className='w-full'>
            <ol className="flex items-center w-full font-medium text-center text-gray-500 dark:text-gray-200">
                {steps.map((element: any, index: number) => {
                    let lispan = (element:any, index:number) => {
                        return (
                            <span className="flex items-center">
                                <span className="mr-2">{index + 1}</span>
                                {element?.[0]}
                            </span>
                        )
                    }
                    return index === 0 ? (
                        /* leftmost */
                        <li className="flex grow-0 items-center text-blue-600 dark:text-blue-500" key={index}>
                            {lispan(element, index)}
                        </li>
                    ) : index < active ? (
                        /* completed */
                        <li className="flex grow items-center text-blue-600 dark:text-blue-500 before:content-[''] before:w-full before:h-1 before:border-b before:border-blue-200 dark:before:border-blue-400 before:border-4 before:mx-6" key={index}>
                            {lispan(element, index)}
                        </li>
                    ) : index === active ? (
                        /* active */
                        <li className="flex grow items-center text-blue-600 dark:text-blue-500 before:content-[''] before:w-full before:h-1 before:border-b before:border-blue-200 dark:before:border-blue-400 before:border-4 before:mx-6" key={index}>
                            {lispan(element, index)}
                        </li>
                    ) : (
                        /* not completed */
                        <li className="flex grow items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-200 dark:before:border-gray-600 before:border-4 before:mx-6">
                            {lispan(element, index)}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
