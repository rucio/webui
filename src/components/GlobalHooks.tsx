import React from 'react'
import { Alert, AlertProps } from '../stories/Alert/Alert'
import { Modal, ModalProps } from '../stories/Modal/Modal'

const AlertServiceContext = React.createContext<
    (options: AlertProps) => Promise<void>
>(Promise.resolve)

const ModalServiceContext = React.createContext<
    (options: ModalProps) => Promise<void>
>(Promise.resolve)

export const useAlert = () => React.useContext(AlertServiceContext)
export const useModal = () => React.useContext(ModalServiceContext)

export const ServiceProvider = ({ children }: any) => {
    const [alertState, setAlertState] = React.useState<AlertProps | any>(null)
    const [modalState, setModalState] = React.useState<ModalProps | any>(null)

    const awaitingPromiseRef = React.useRef<{
        resolve: () => void
    }>()

    const openAlertConfirmation = (options: AlertProps) => {
        setAlertState(options)
        setTimeout(() => {
            handleAlertClose()
        }, 4.9 * 1000)
        return new Promise<void>(resolve => {
            awaitingPromiseRef.current = { resolve }
        })
    }

    const openModalConfirmation = (options: ModalProps) => {
        setModalState(options)
        return new Promise<void>(resolve => {
            awaitingPromiseRef.current = { resolve }
        })
    }

    const handleAlertClose = () => {
        awaitingPromiseRef.current?.resolve()
        setAlertState(null)
    }

    const handleModalClose = () => {
        awaitingPromiseRef.current?.resolve()
        setModalState(null)
    }

    return (
        <>
            <Alert
                open={alertState}
                onClose={handleAlertClose}
                {...alertState}
            />
            <Modal
                active={modalState}
                onClose={handleModalClose}
                {...modalState}
            ></Modal>
            <ModalServiceContext.Provider value={openModalConfirmation}>
                <AlertServiceContext.Provider
                    value={openAlertConfirmation}
                    children={children}
                />
            </ModalServiceContext.Provider>
        </>
    )
}
