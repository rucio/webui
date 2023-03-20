import { useState , useEffect } from 'react'
import { Button } from "../../Button/Button";
import { Tabs } from "../../Tabs/Tabs";
import { TextInput } from '../../Input/Input.stories';
import { H1 } from '../../Text/Headings/H1';
import { Collapsible } from '../../Helpers/Collapsible';
import { CredentialInput } from './CredentialInput';
import { LoginViewModel } from '../../../../lib/infrastructure/data/view-model/login.d';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { MdAccountCircle } from 'react-icons/md';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { Alert } from '../../Alert/Alert';
import DefaultVO from '@/lib/common/default-vo';

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
    oidcSubmitHandler: handleOIDCSubmit
}: LoginPageProps ) => {

    var mainDivClasses: string[] = ["border-gray-300", "dark:border-white", "border", "dark:border-2", "rounded", "p-4", "flex", "flex-col", "justify-center", "space-y-2"]
    const [showUserPassLoginForm, setShowUserPassLoginForm] = useState<boolean>(false)
    
    const [selectedVOTab, setSelectedVOTab] = useState<number>(1)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [account, setAccount] = useState<string | undefined>(undefined)

    const [error, setError] = useState<string | undefined>(undefined)

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
        <div className={mainDivClasses.join(" ")}>
            <Collapsible id='login-page-error' showIf={error !== undefined}>
                    <Alert variant="error" message={error} onClose={
                        () => {
                            setError(undefined)
                        }
                    }/> 
            </Collapsible>
            <div className="text-center dark:text-white">
                <H1 text="Rucio Login" />
            </div>

            <div className="flex flex-col space-y-2">
                <Collapsible id="vo-tabs" showIf={loginViewModel.multiVOEnabled}>
                    <Tabs tabs={loginViewModel.voList.map((vo) => vo.name)} active={1} handleClick={(event: any) => {setSelectedVOTab(event.target.id)}}/>
                </Collapsible>
                
                <div className="flex justify-center flex-col space-y-4">
                    <Collapsible id="oidc-buttons" showIf={loginViewModel.oidcEnabled}>
                        <div className="flex flex-row justify-center space-x-2">
                            {loginViewModel.oidcProviders.map((provider: OIDCProvider, index: number) => {
                                return (<Button theme='orange' label={provider.name} key={index.toString()} icon={<MdAccountCircle/>}/>)
                            })}
                        </div>
                    </Collapsible>
                    
                    <div className="flex flex-col space-y-4">
                        <Collapsible showIf={loginViewModel.x509Enabled}>
                            <Button label="x509" onClick={async () => {
                                const vo = loginViewModel.voList[selectedVOTab - 1] || DefaultVO
                                
                                const x509AuthViewModel = await handleX509Submit(vo, loginViewModel, account)
                                
                                if (x509AuthViewModel) {
                                    if(x509AuthViewModel.status === 'error') {
                                        setError(x509AuthViewModel.message)
                                        return
                                    }
                                    console.log("x509AuthViewModel", x509AuthViewModel)
                                    console.log("voName", vo.shortName)
                                    await handleX509Session(x509AuthViewModel, account || "", vo.shortName)
                                }
                            }}/>
                        </Collapsible>

                        <Button label="Userpass" onClick={() => {
                                setShowUserPassLoginForm(!showUserPassLoginForm)
                            }
                        }/>

                        <Collapsible showIf={showUserPassLoginForm} id="userpass-form">
                            <CredentialInput submitHandler={async () => {
                                await handleUserPassSubmit(
                                    username,
                                    password,
                                    loginViewModel.voList[selectedVOTab - 1],
                                    account
                                )
                            }}>
                                <TextInput label="Username" inline onChange={(event) => {setUsername(event.target.value)}}/>
                                <TextInput label="Password" inline password onChange={(event) => {setPassword(event.target.value)}}/>
                            </CredentialInput>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}
