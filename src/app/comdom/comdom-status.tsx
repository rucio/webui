import { ComDOMStatus } from "@/lib/infrastructure/web-worker/comdom-wrapper"
import { FetchStatus } from "@tanstack/react-query"
import { useMemo } from "react"
import QueryInfo from "./query-info"

export type ComDOMStatusCardProps = {
    comDOMStatus: ComDOMStatus
}
export function ComDOMStatusCard({ comDOMStatus }: ComDOMStatusCardProps) {
    const status = useMemo(() => {
        switch (comDOMStatus) {
            case ComDOMStatus.NOT_CREATED:
            case ComDOMStatus.STOPPED:
                return 'not_started'
            case ComDOMStatus.RUNNING:
                return 'loading'
            case ComDOMStatus.PREPARING_BATCH:
                return 'preparing_batch'
            case ComDOMStatus.ERROR:
                return 'error'
            case ComDOMStatus.DONE:
                return 'success'
            case ComDOMStatus.UNKNOWN:
                return 'unknown'
            default:
                return 'unknown'
        }
    }, [comDOMStatus])

    return (
        <QueryInfo title="ComDOM Status (Worker)" status={status} realStatus={comDOMStatus}/>
    )
}

export type ComDOMLifeCycleProps = {
    workerStatus: ComDOMStatus
    queryStatus: FetchStatus
}

export function ComDOMLifeCycle({workerStatus, queryStatus}:  ComDOMLifeCycleProps) {
    const workerLifeCycle = ['NOT_CREATED', 'STOPPED', 'RUNNING', 'PREPARING_BATCH', 'ERROR', 'DONE', 'UNKNOWN']
    const queryLifeCycle = ['idle', 'loading', 'error', 'success']

    return (
        <div>
            <br></br>
            <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Worker Lifecycle</h2>
                <br></br>
                <br></br>
            <ol className="flex items-center">
                {workerLifeCycle.map((status, index) => {
                    console.log(workerStatus, "*****")
                    const isActive = workerStatus.toLowerCase() === status.toLowerCase()
                    return (
                        <li key={index} className="relative w-full mb-6">
                            <div className="flex items-center">
                                <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                                    <svg aria-hidden="true" className="w-4 h-4 text-blue-100 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </div>
                                <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                            </div>
                            <div className="mt-3">
                                <h3 className="font-medium text-gray-900 dark:text-white">{status}</h3>
                            </div>
                        </li>
                    )}
                )}
                
                <li className="relative w-full mb-6">
                    <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <svg aria-hidden="true" className="w-3 h-3 text-gray-800 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Stopped</h3>
                    </div>
                </li>
            </ol>


            <div className="flex flex-col">
                <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Query ( Main Thread - Web Worker)</h2>
                <br></br>
                <br></br>
            <ol className="flex items-center">
                <li className="relative w-full mb-6">
                    <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                        </div>
                        <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Step 1</h3>
                    </div>
                </li>
                <li className="relative w-full mb-6">
                    <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                        </div>
                        <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Step 2</h3>
                    </div>
                </li>
                <li className="relative w-full mb-6">
                    <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                        </div>
                        <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Step 2</h3>
                    </div>
                </li>
                <li className="relative w-full mb-6">
                    <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <span className="flex w-3 h-3 bg-gray-900 rounded-full dark:bg-gray-300"></span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Step 3</h3>
                    </div>
                </li>
            </ol>
            </div>
        </div>
    )
}