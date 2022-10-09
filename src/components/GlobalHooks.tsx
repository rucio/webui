import React, { MutableRefObject, useContext, useEffect, useRef } from 'react'
import { Alert, AlertProps } from '../stories/Alert/Alert'
import { Modal, ModalProps } from '../stories/Modal/Modal'
import { AuthContext, AuthProvider } from 'react-oauth2-code-pkce'

const AlertServiceContext = React.createContext<
    (options: AlertProps) => Promise<void>
>(Promise.resolve)

const ModalServiceContext = React.createContext<
    (options: ModalProps) => Promise<void>
>(Promise.resolve)

const AuthServiceContext = React.createContext<
    (oidcConfig: any) => Promise<void>
>(Promise.resolve)

export const useAlert = () => React.useContext(AlertServiceContext)
export const useModal = () => React.useContext(ModalServiceContext)
export const useAuthConfig = () => React.useContext(AuthServiceContext)

export const ServiceProvider = ({ children }: any) => {
    const { tokenData, token, login, logOut, error, loginInProgress } =
        useContext(AuthContext)
    const [alertState, setAlertState] = React.useState<AlertProps | any>(null)
    const [modalState, setModalState] = React.useState<ModalProps | any>(null)
    const [authState, setAuthState] = React.useState<any>(null)
    const firstRender: MutableRefObject<boolean> = useRef(true)

    const awaitingPromiseRef = React.useRef<{
        resolve: () => void
    }>()

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        } else {
            login()
        }
    }, [authState])

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

    const setNewAuthState = (oidcConfig: any) => {
        setAuthState(oidcConfig)
        return new Promise<void>(resolve => {
            awaitingPromiseRef.current = { resolve }
        })
    }

    const ModalAlertComponent: any = () => (
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
                <AlertServiceContext.Provider value={openAlertConfirmation}>
                    {children}
                </AlertServiceContext.Provider>
            </ModalServiceContext.Provider>
        </>
    )

    return authState ? (
        <AuthServiceContext.Provider value={setNewAuthState}>
            <AuthProvider authConfig={authState}>
                <ModalAlertComponent />
            </AuthProvider>
        </AuthServiceContext.Provider>
    ) : (
        <ModalAlertComponent />
    )
}
