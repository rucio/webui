import { ComDOMError } from "@/lib/infrastructure/hooks/useComDOM"
import { useEffect, useMemo, useState } from "react"

export type ErrorListProps = {
    errorSignal: boolean
    errors: ComDOMError[]
    resolve: (id: number) => void
    all: ComDOMError[]
    resolved: ComDOMError[]
    unresolved: ComDOMError[]
}

export type ErrorProps = {
    error: ComDOMError
    resolve: (id: number) => void
}
export const Error = ({ error, resolve }: ErrorProps) => {
    const isResolved = error.resolved
    const backgroundColor = isResolved ? 'bg-green-50' : 'bg-red-50'
    return (
        <li key={error.id} className={`flex p-4 mb-4 text-sm text-red-800 rounded-lg ${backgroundColor}`} role="alert">
            {error.message}
            <button className="ml-4 text-red-500 hover:text-red-700" onClick={() => {
                resolve(error.id)
            }}>

            </button>
        </li>
    )
}
export default function ErrorList({ errorSignal, errors, resolve }: ErrorListProps) {

    const [errorFilter, setErrorFilter] = useState<'all' | 'resolved' | 'unresolved'>('all')
    const selected = 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
    const unselected = 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
    const errorsToShow = useMemo(() => {
        if (errorSignal) {
            if(errorFilter === 'all') {
                return errors
            }
            if(errorFilter === 'resolved') {
                return errors.filter(e => e.resolved)
            }
            if(errorFilter === 'unresolved') {
                return errors.filter(e => !e.resolved)
            }
        }
        return []
    }, [errorSignal, errors, errorFilter])

    return (
        // wrap in a box
        <div className="border-b border-gray-700">
            <h3 className="text-xl text-zinc-500 text-color-red text-center">Errors</h3>
            <br></br>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    <li className="mr-2">
                        <a href="#" className={errorFilter === 'all'? selected: unselected} onClick={
                            () => {
                                setErrorFilter('all')
                            }
                        }>All</a>
                    </li>
                    <li className="mr-2">
                        <a href="#" className={errorFilter === 'resolved'? selected: unselected} onClick={
                            () => {
                                setErrorFilter('resolved')
                            }
                        }>Resolved</a>
                        
                    </li>
                    <li className="mr-2">
                        <a href="#" className={errorFilter === 'unresolved'? selected: unselected} onClick={
                            () => {
                                setErrorFilter('unresolved')
                            }
                        }>Unresolved</a>
                    </li>
                    
                </ul>
            </div>

            {errorSignal? 
            <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Danger</span>
                <div>
                    <span className="font-medium">The following errors occurred:</span>
                    <ul className="mt-1.5 ml-4 list-disc list-inside">
                        {errorsToShow.map((error, index) => {
                            return <Error key={index} error={error} resolve={resolve} />
                        })
                        }
                    </ul>
                </div>
            </div>
            : <div className="text-green-800 text-center">No errors to show!</div>}
        </div>
    )
}