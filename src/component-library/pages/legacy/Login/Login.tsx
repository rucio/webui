import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import { Button } from '../../../atoms/legacy/Button/Button';
import { Tabs } from '../../../atoms/legacy/Tabs/Tabs';
import { H1 } from '../../../atoms/legacy/text/headings/H1/H1';
import { Collapsible } from '../../../atoms/legacy/helpers/Collapsible/Collapsible';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { MdAccountCircle } from 'react-icons/md';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { Alert } from '../../../atoms/legacy/Alert/Alert';
import { LabelledInput } from './LabelledInput';
import { DefaultVO } from '@/lib/core/entity/auth-models';
import Modal from 'react-modal';
import { Dropdown } from '../../../atoms/legacy/input/Dropdown/Dropdown';
import { H2 } from '../../../atoms/legacy/text/headings/H2/H2';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

const BackToDashboardButton = (props: { account: string }) => {
    return (
        <Link href="/dashboard">
            <Button
                className={twMerge('bg-base-success-600 hover:bg-base-success-700', 'mb-1')}
                icon={<HiArrowRight />}
                label={`Back to dashboard as ${props.account}`}
            ></Button>
        </Link>
    );
};

export type SupportedAuthWorkflows = 'oidc' | 'x509' | 'userpass' | 'none';

export interface LoginPageProps {
    loginViewModel: LoginViewModel;
    authViewModel: AuthViewModel | undefined;
    userPassSubmitHandler: (username: string, password: string, vo: VO, account?: string) => void;
    x509SubmitHandler: (vo: VO, loginViewModel: LoginViewModel, account?: string) => Promise<AuthViewModel | undefined>;
    x509SessionHandler: (authViewModel: AuthViewModel, rucioAccount: string, shortVoName: string) => void;
    oidcSubmitHandler: (oidcProvider: OIDCProvider, vo: VO, account?: string) => void;
}

interface MultipleAccountsModal {
    submit: (account: string | undefined) => Promise<void>;
    availableAccounts: string[];
    onClose: () => void;
}

const MultipleAccountsModal = ({ submit, availableAccounts, onClose }: MultipleAccountsModal) => {
    const [chosenAccount, setChosenAccount] = useState<string | undefined>(undefined);

    return (
        <Modal
            isOpen={availableAccounts.length !== 0}
            onRequestClose={() => {
                setChosenAccount(undefined);
                onClose();
            }}
            ariaHideApp={false}
            overlayClassName="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50" // will not work if set with twmerge (uses custom regex)
            className={twMerge(
                'mx-2 max-w-3xl rounded shadow-lg z-50',
                'border-2',
                'bg-neutral-0 dark:bg-neutral-800',
                'flex flex-col space-y-2 p-6',
                'justify-center items-center overflow-y-visible outline-none focus:outline-none',
            )}
            contentLabel="Multiaccount Modal"
        >
            <H2>Select Account</H2>
            <P className="text-center py-2">Multiple accounts are mapped to the passed credentials. Choose one to continue.</P>
            <Dropdown<string>
                keys={availableAccounts}
                renderFunc={(key: string | undefined) => {
                    return <p>{key ?? 'Select an account'}</p>;
                }}
                handleChange={(key: string | undefined) => {
                    setChosenAccount(key);
                }}
                disableUndefined
            />
            <Button
                type="submit"
                label="Select"
                disabled={chosenAccount === undefined}
                onClick={async () => {
                    await submit(chosenAccount);
                }}
            />
        </Modal>
    );
};

export const Login = ({
    loginViewModel,
    authViewModel,
    userPassSubmitHandler: handleUserPassSubmit,
    x509SubmitHandler: handleX509Submit,
    x509SessionHandler: handleX509Session,
    oidcSubmitHandler: handleOIDCSubmit,
}: LoginPageProps) => {
    const isLoggedIn = loginViewModel.isLoggedIn && loginViewModel.accountActive !== undefined;
    const [showUserPassLoginForm, setShowUserPassLoginForm] = useState<boolean>(false);

    const [selectedVOTab, setSelectedVOTab] = useState<number>(0);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [inputAccount, setInputAccount] = useState<string | undefined>(undefined);

    const [error, setError] = useState<string | undefined>(undefined);

    const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
    const [lastAuthMethod, setLastAuthMethod] = useState<'userpass' | 'x509' | undefined>(undefined);

    const handleAuthViewModel = (authViewModel: AuthViewModel) => {
        if (authViewModel.status === 'error') {
            setError(authViewModel.message);
        } else if (authViewModel.status === 'multiple_accounts') {
            const accounts = authViewModel.message?.split(',');
            const accountsFiltered = accounts?.filter(account => !loginViewModel.accountsAvailable?.includes(account));
            if (!accountsFiltered || accountsFiltered.length === 0) {
                setError('All accounts associated with this identity are signed in to');
            } else {
                setAvailableAccounts(accountsFiltered);
            }
        }
    };

    const submitX509 = async (account: string | undefined) => {
        if (account && loginViewModel.accountsAvailable?.includes(account)) {
            setError(`Already authenticated as ${account}`);
            return;
        }

        const vo = loginViewModel.voList[selectedVOTab] || DefaultVO;
        const x509AuthViewModel = await handleX509Submit(vo, loginViewModel, account);

        if (!x509AuthViewModel) return;

        setLastAuthMethod('x509');
        handleAuthViewModel(x509AuthViewModel);
        handleX509Session(x509AuthViewModel, x509AuthViewModel.rucioAccount, vo.shortName);
    };

    const submitUserPass = async (account: string | undefined) => {
        if (account && loginViewModel.accountsAvailable?.includes(account)) {
            setError(`Already authenticated as ${account}`);
            return;
        }

        handleUserPassSubmit(username, password, loginViewModel.voList[selectedVOTab], account);
        setLastAuthMethod('userpass');
        return Promise.resolve();
    };

    useEffect(() => {
        if (authViewModel) {
            handleAuthViewModel(authViewModel);
        } else if (loginViewModel && loginViewModel.status === 'error') {
            setError(loginViewModel.message);
        }
    }, [loginViewModel, authViewModel]);

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const formVariants = {
        hidden: { opacity: 0, scale: 1.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const getLoginForm = () => {
        return (
            <motion.div initial="hidden" animate="visible" variants={formVariants}>
                <div
                    className={twMerge(
                        'flex flex-col items-center justify-between',
                        'border dark:border-2 rounded-xl p-6 flex flex-col justify-center space-y-4',
                        'border-neutral-300 dark:border-neutral-700',
                        'bg-neutral-50 dark:bg-neutral-900',
                    )}
                    id="root"
                >
                    <MultipleAccountsModal
                        submit={lastAuthMethod === 'x509' ? submitX509 : submitUserPass}
                        availableAccounts={availableAccounts}
                        onClose={() => setAvailableAccounts([])}
                    />
                    <Collapsible id="login-page-error" showIf={error !== undefined}>
                        <Alert
                            variant="error"
                            message={error}
                            onClose={() => {
                                setError(undefined);
                            }}
                        />
                    </Collapsible>
                    <div className="flex flex-col items-center justify-between w-64 text-center text-text-1000 dark:text-text-0">
                        <motion.div initial="hidden" animate="visible" variants={logoVariants}>
                            <Image src="/rucio-logo.png" alt="Rucio Logo" width={146} height={176} />
                        </motion.div>
                    </div>

                    <div
                        className="flex flex-col space-y-4"
                        onSubmit={e => {
                            e.preventDefault();
                        }} // TODO handle proper submit!
                    >
                        <Tabs
                            tabs={loginViewModel.voList.map(vo => vo.name)}
                            active={1}
                            updateActive={(active: number) => {
                                setSelectedVOTab(active);
                            }}
                            className={twMerge(loginViewModel.multiVOEnabled ? '' : 'hidden')}
                        />

                        <div className="flex justify-center flex-col space-y-4" aria-label="Choose Login Method">
                            {loginViewModel.oidcEnabled == true ? (
                                <div
                                    className={twMerge(
                                        'flex flex-row justify-center space-x-2',
                                        loginViewModel.voList[selectedVOTab].oidcEnabled ? '' : 'hidden',
                                    )}
                                    aria-label="OIDC Login Buttons"
                                >
                                    {loginViewModel.voList[selectedVOTab].oidcProviders.map((provider: OIDCProvider, index: number) => {
                                        return <Button theme="orange" label={provider.name} key={index.toString()} icon={<MdAccountCircle />} />;
                                    })}
                                </div>
                            ) : (
                                <></>
                            )}

                            <Button label="x509" onClick={() => submitX509(inputAccount)} />
                            {loginViewModel.userpassEnabled && (
                                <div id="userpass-login">
                                    <Button
                                        label="Userpass"
                                        onClick={() => {
                                            setShowUserPassLoginForm(!showUserPassLoginForm);
                                        }}
                                    />
                                    <form>
                                        <fieldset
                                            className={twMerge('flex flex-col space-y-4', 'mx-2 md:mx-10', showUserPassLoginForm ? '' : 'hidden')}
                                            aria-label="Userpass Login Fields"
                                            id="userpass-form"
                                        >
                                            <div className={twMerge('flex flex-col space-y-2 p-2')}>
                                                <LabelledInput
                                                    label="Username"
                                                    idinput="username-input"
                                                    updateFunc={(data: string) => {
                                                        setUsername(data);
                                                    }}
                                                />
                                                <LabelledInput
                                                    label="Password"
                                                    idinput="password-input"
                                                    updateFunc={(data: string) => {
                                                        setPassword(data);
                                                    }}
                                                    password={true}
                                                />
                                                <LabelledInput
                                                    label="Account"
                                                    idinput="account-input"
                                                    updateFunc={(data: string) => {
                                                        setInputAccount(data);
                                                    }}
                                                />
                                            </div>
                                            <Button label="Login" type="submit" role="button" onClick={() => submitUserPass(inputAccount)} />
                                        </fieldset>
                                    </form>
                                    <fieldset
                                        className={twMerge('mx-2 md:mx-10 p-4', !showUserPassLoginForm ? 'block' : 'hidden')}
                                        aria-label="Choose Account Name"
                                        id="all-accounts"
                                    >
                                        <LabelledInput
                                            label="Account"
                                            idinput="account-input-nouserpass"
                                            updateFunc={(data: string) => {
                                                setInputAccount(data);
                                            }}
                                        />
                                    </fieldset>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return isLoggedIn ? (
        <div>
            <BackToDashboardButton account={loginViewModel.accountActive!} />
            {getLoginForm()}
        </div>
    ) : (
        getLoginForm()
    );
};
