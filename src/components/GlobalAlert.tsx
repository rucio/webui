import React from 'react'
import { Alert, AlertProps } from '../stories/Alert/Alert'

const AlertServiceContext = React.createContext<
    (options: AlertProps) => Promise<void>
>(Promise.resolve)

export const useAlert = () => React.useContext(AlertServiceContext)

export const AlertServiceProvider = ({ children }: any) => {
    const [alertState, setAlertState] = React.useState<AlertProps | any>(null)

    const awaitingPromiseRef = React.useRef<{
        resolve: () => void
    }>()

    const openConfirmation = (options: AlertProps) => {
        setAlertState(options)
        setTimeout(() => {
            handleClose()
        }, 4.9 * 1000)
        return new Promise<void>(resolve => {
            awaitingPromiseRef.current = { resolve }
        })
    }

    const handleClose = () => {
        awaitingPromiseRef.current?.resolve()
        setAlertState(null)
    }

    return (
        <>
            <Alert open={alertState} onClose={handleClose} {...alertState} />
            <AlertServiceContext.Provider
                value={openConfirmation}
                children={children}
            />
        </>
    )
}
