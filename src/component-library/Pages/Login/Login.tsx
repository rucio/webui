import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react'
import { Button } from "../../Button/Button";
import { Tabs } from "../../Misc/Tabs";
import { H1 } from '../../Text/Headings/H1';
import { Collapsible } from '../../Helpers/Collapsible';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login.d';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { MdAccountCircle } from 'react-icons/md';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { Alert } from '../../Misc/Alert';
import { LabelledInput } from './LabelledInput';
import { DefaultVO } from '@/lib/core/entity/auth-models';
import Modal from "react-modal";
import { Dropdown } from '../../Input/Dropdown';
import { H2 } from '../../Text/Headings/H2';
import { P } from '../../Text/Content/P';

export type SupportedAuthWorkflows = "oidc" | "x509" | "userpass" | "none"

export interface LoginPageProps {
    loginViewModel: LoginViewModel
    authViewModel: AuthViewModel | undefined
    userPassSubmitHandler: (username: string, password: string, vo: VO, account?: string) => void
    x509SubmitHandler: (vo: VO, loginViewModel: LoginViewModel, account?: string) => Promise<AuthViewModel | undefined>
    x509SessionHandler: (authViewModel: AuthViewModel, rucioAccount: string, shortVoName: string) => void
    oidcSubmitHandler: (oidcProvider: OIDCProvider, vo: VO, account?: string) => void
}


export const Login = ({
    loginViewModel,
    authViewModel,
    userPassSubmitHandler: handleUserPassSubmit,
    x509SubmitHandler: handleX509Submit,
    x509SessionHandler: handleX509Session,
    oidcSubmitHandler: handleOIDCSubmit,
}: LoginPageProps) => {

    const [showUserPassLoginForm, setShowUserPassLoginForm] = useState<boolean>(false)

    const [selectedVOTab, setSelectedVOTab] = useState<number>(1)

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [account, setAccount] = useState<string | undefined>(undefined)

    const [error, setError] = useState<string | undefined>(undefined)

    const [multiaccounts, setMultiaccounts] = useState<string[]>([])
    const [multiaccountModal, setMultiaccountModal] = useState<boolean>(false)

    useEffect(() => {
        setMultiaccounts(authViewModel?.rucioMultiAccount?.split(',') ?? [])
    }, [authViewModel])
    useEffect(() => {
        if (multiaccounts.length > 1) {
            setMultiaccountModal(true)
        } else {
            setMultiaccountModal(false)
        }
    }, [multiaccounts])

    useEffect(() => {
        if (authViewModel && authViewModel.status === 'error') {
            setError(authViewModel.message)
            return
        }
        if (loginViewModel && loginViewModel.status === 'error') {
            setError(loginViewModel.message)
        }
    }, [loginViewModel, authViewModel])

    return (
        <div
            className={twMerge(
                "rounded p-4 flex flex-col justify-center space-y-2",
                "border dark:border-2",
                "border-neutral-300 dark:border-neutral-0",
                "bg-neutral-0 dark:bg-neutral-800",
            )}
            id="root"
        >
            <Modal
                isOpen={multiaccountModal}
                onRequestClose={() => { setMultiaccountModal(false) }}
                overlayClassName="fixed bg-transparent inset-0 z-0" // will not work if set with twmerge (uses custom regex)
                className={twMerge(
                    "absolute top-32 inset-x-32 rounded shadow",
                    "border-2",
                    "bg-neutral-0 dark:bg-neutral-800",
                    "flex flex-col space-y-2 p-2"
                )}
                contentLabel="Multiaccount Modal"
            >
                <H2>Select Account</H2>
                <P>Multiple accounts are mapped to the passed credentials. Choose one to continue.</P>
                <Dropdown<string>
                    keys={multiaccounts}
                    renderFunc={(key: string | undefined) => { return (<p>{key ?? "select an account"}</p>) }}
                    handleChange={(key: string | undefined) => { setAccount(key) }}
                    disableUndefined
                />
                <Button
                    type="submit"
                    label="Select"
                    disabled={account === undefined}
                    onClick={() => {setMultiaccountModal(false)}}
                />
            </Modal>
            <Collapsible id='login-page-error' showIf={error !== undefined}>
                <Alert variant="error" message={error} onClose={
                    () => {
                        setError(undefined)
                    }
                } />
            </Collapsible>
            <div className="text-center text-text-1000 dark:text-text-0">
                <H1 className="mt-4 mb-2">Rucio Login</H1> 
            </div>

            <div
                className="flex flex-col space-y-2"
                onSubmit={ (e) => { 
                        e.preventDefault()
                    }
                } // TODO handle proper submit!
            >
                <Tabs
                    tabs={loginViewModel.voList.map((vo) => vo.name)}
                    active={1}
                    updateActive={(active: number) => { setSelectedVOTab(active) }}
                    className={twMerge(loginViewModel.multiVOEnabled ? "" : "hidden")}
                />

                <div
                    className="flex justify-center flex-col space-y-4"
                    aria-label="Choose Login Method"
                >
                    { loginViewModel.oidcEnabled == true ?
                    <div
                        className={twMerge(
                            "flex flex-row justify-center space-x-2",
                            loginViewModel.voList[selectedVOTab].oidcEnabled ? "" : "hidden"
                        )}
                        aria-label="OIDC Login Buttons"
                    >
                        {loginViewModel.voList[selectedVOTab].oidcProviders.map((provider: OIDCProvider, index: number) => {
                            return (<Button theme='orange' label={provider.name} key={index.toString()} icon={<MdAccountCircle />} />)
                        })}
                    </div>
                    : <></>}

                    <Button
                        label="x509"
                        onClick={async () => {
                            const vo = loginViewModel.voList[selectedVOTab] || DefaultVO

                            const x509AuthViewModel = await handleX509Submit(vo, loginViewModel, account)

                            if (x509AuthViewModel) {
                                if (x509AuthViewModel.status === 'error') {
                                    setError(x509AuthViewModel.message)
                                    return
                                }
                                console.log("x509AuthViewModel", x509AuthViewModel)
                                console.log("voName", vo.shortName)
                                await handleX509Session(x509AuthViewModel, account || "", vo.shortName)
                            }
                        }}
                    />

                    <Button label="Userpass" onClick={() => {
                        setShowUserPassLoginForm(!showUserPassLoginForm)
                    }
                    } />
                    <form>
                    <fieldset
                        className={twMerge(
                            "flex flex-col space-y-2",
                            "mx-2 md:mx-10",
                            showUserPassLoginForm ? "" : "hidden",
                        )}
                        aria-label="Userpass Login Fields"
                        id="userpass-form"
                    >
                        <div
                            className={twMerge("flex flex-col space-y-1")}

                        >
                            <LabelledInput
                                label="Username"
                                idinput="username-input"
                                updateFunc={(data: string) => { setUsername(data) }}
                            />
                            <LabelledInput
                                label="Password"
                                idinput="password-input"
                                updateFunc={(data: string) => { setPassword(data) }}
                                password={true}
                            />
                            <LabelledInput
                                label="Account"
                                idinput="account-input"
                                updateFunc={(data: string) => { setAccount(data) }}                               
                            />
                        </div>
                        <Button
                            label="Login"
                            type="submit"
                            role="button"
                            onClick={async () => {
                                await handleUserPassSubmit(
                                    username,
                                    password,
                                    loginViewModel.voList[selectedVOTab],
                                    account
                                )
                            }}
                        />             
                    </fieldset>
                    </form>
                    <fieldset
                        className={twMerge(
                            "mx-2 md:mx-10",
                            !showUserPassLoginForm ? "block" : "hidden",
                        )}
                        aria-label="Choose Account Name"
                        id="all-accounts"
                    >
                        <LabelledInput
                            label="Account"
                            idinput="account-input-nouserpass"
                            updateFunc={(data: string) => { setAccount(data) }}
                        />
                    </fieldset>
                </div>
            </div >
        </div >
    )
}
