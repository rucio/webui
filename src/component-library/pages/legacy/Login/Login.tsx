'use client';

import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import { Button } from '../../../atoms/form/button';
import { Tabs } from '../../../atoms/legacy/Tabs/Tabs';
import { H1 } from '../../../atoms/legacy/text/headings/H1/H1';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { MdAccountCircle } from 'react-icons/md';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { Alert } from '../../../atoms/legacy/Alert/Alert';
import { DefaultVO } from '@/lib/core/entity/auth-models';
import Modal from 'react-modal';
import { Dropdown } from '../../../atoms/legacy/input/Dropdown/Dropdown';
import { H2 } from '../../../atoms/legacy/text/headings/H2/H2';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import { motion, MotionConfig, AnimatePresence } from 'motion/react';
import { RucioLogo } from '../../../atoms/branding/RucioLogo';
import { AnimatedTabs } from '../../../atoms/tabs/AnimatedTabs';
import { Input } from '../../../atoms/form/input';
import { cn } from '@/component-library/utils';
import { HiArrowLeft } from 'react-icons/hi';

const BackToDashboardButton = (props: { account: string }) => {
    return (
        <Link href="/dashboard">
            <Button variant="success" className="mb-1 w-full">
                <HiArrowRight className="mr-2 h-4 w-4" />
                Back to dashboard as {props.account}
            </Button>
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
                variant="success"
                className="w-full"
                disabled={chosenAccount === undefined}
                onClick={async () => {
                    await submit(chosenAccount);
                }}
            >
                Select
            </Button>
        </Modal>
    );
};

type LoginView = 'method-selection' | 'userpass-form';

export const Login = ({
    loginViewModel,
    authViewModel,
    userPassSubmitHandler: handleUserPassSubmit,
    x509SubmitHandler: handleX509Submit,
    x509SessionHandler: handleX509Session,
    oidcSubmitHandler: handleOIDCSubmit,
}: LoginPageProps) => {
    const isLoggedIn = loginViewModel.isLoggedIn && loginViewModel.accountActive !== undefined;
    const [currentView, setCurrentView] = useState<LoginView>('method-selection');

    const [selectedVOTab, setSelectedVOTab] = useState<number>(0);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [inputAccount, setInputAccount] = useState<string | undefined>(undefined);

    const [error, setError] = useState<string | undefined>(undefined);
    const [fieldErrors, setFieldErrors] = useState<{
        username?: string;
        password?: string;
        account?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    const validateUserPassForm = (): boolean => {
        const errors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            errors.username = 'Username is required';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitUserPass = async (account: string | undefined) => {
        // Clear previous errors
        setError(undefined);
        setFieldErrors({});

        // Validate form
        if (!validateUserPassForm()) {
            return;
        }

        if (account && loginViewModel.accountsAvailable?.includes(account)) {
            setError(`Already authenticated as ${account}`);
            return;
        }

        setIsSubmitting(true);
        try {
            handleUserPassSubmit(username, password, loginViewModel.voList[selectedVOTab], account);
            setLastAuthMethod('userpass');
        } finally {
            setIsSubmitting(false);
        }
        return Promise.resolve();
    };

    useEffect(() => {
        if (authViewModel) {
            handleAuthViewModel(authViewModel);
        } else if (loginViewModel && loginViewModel.status === 'error') {
            setError(loginViewModel.message);
        }
    }, [loginViewModel, authViewModel]);

    // Respect user's motion preferences
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const logoVariants = {
        hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeInOut' },
        },
    };

    const formVariants = {
        hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeInOut' },
        },
    };

    // View transition variants - slide and fade
    const viewTransitionVariants = {
        enter: (direction: number) => ({
            x: prefersReducedMotion ? 0 : direction > 0 ? 300 : -300,
            opacity: prefersReducedMotion ? 1 : 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' },
        },
        exit: (direction: number) => ({
            x: prefersReducedMotion ? 0 : direction < 0 ? 300 : -300,
            opacity: prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' },
        }),
    };

    // Render method selection view
    const renderMethodSelection = () => {
        return (
            <motion.div
                key="method-selection"
                custom={-1}
                variants={viewTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
            >
                {/* VO Tabs with animated indicator */}
                {loginViewModel.multiVOEnabled && (
                    <div className="mb-4">
                        <AnimatedTabs
                            tabs={loginViewModel.voList.map(vo => vo.name)}
                            activeIndex={selectedVOTab}
                            onTabChange={(index: number) => setSelectedVOTab(index)}
                            ariaLabel="Select Virtual Organisation"
                        />
                    </div>
                )}

                {/* Login Method Buttons */}
                <div className="flex justify-center flex-col space-y-4 mt-4" aria-label="Choose Login Method">
                    {/* OIDC Buttons */}
                    {loginViewModel.oidcEnabled == true ? (
                        <div
                            className={twMerge(
                                'flex flex-row justify-center space-x-2',
                                loginViewModel.voList[selectedVOTab].oidcEnabled ? '' : 'hidden',
                            )}
                            aria-label="OIDC Login Buttons"
                        >
                            {loginViewModel.voList[selectedVOTab].oidcProviders.map((provider: OIDCProvider, index: number) => {
                                return (
                                    <Button
                                        variant="neutral"
                                        key={index.toString()}
                                        onClick={() => handleOIDCSubmit(provider, loginViewModel.voList[selectedVOTab], inputAccount)}
                                        className="w-full"
                                    >
                                        <MdAccountCircle className="mr-2 h-4 w-4" />
                                        {provider.name}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}

                    {/* x509 Button */}
                    <Button onClick={() => submitX509(inputAccount)} className="w-full">
                        x509
                    </Button>

                    {/* Userpass Button - now switches view */}
                    {loginViewModel.userpassEnabled && (
                        <Button
                            onClick={() => {
                                setError(undefined);
                                setFieldErrors({});
                                setCurrentView('userpass-form');
                            }}
                            className="w-full"
                        >
                            Userpass
                        </Button>
                    )}

                    {/* Account input for non-userpass methods */}
                    {!loginViewModel.userpassEnabled && (
                        <div className="space-y-2 px-2">
                            <label htmlFor="account-input-nouserpass" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                Account <span className="text-neutral-500">(optional)</span>
                            </label>
                            <Input
                                id="account-input-nouserpass"
                                type="text"
                                value={inputAccount || ''}
                                onChange={e => setInputAccount(e.target.value || undefined)}
                                placeholder="Enter account name"
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    // Render userpass form view
    const renderUserPassForm = () => {
        return (
            <motion.div
                key="userpass-form"
                custom={1}
                variants={viewTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
            >
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={() => {
                            setError(undefined);
                            setFieldErrors({});
                            setCurrentView('method-selection');
                        }}
                        className={cn(
                            'flex items-center gap-2',
                            'text-sm text-neutral-700 dark:text-neutral-300',
                            'hover:text-neutral-900 dark:hover:text-neutral-100',
                            'transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                            'rounded px-2 py-1',
                        )}
                        aria-label="Back to login methods"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Userpass Form with shake animation on error */}
                <motion.form
                    onSubmit={e => {
                        e.preventDefault();
                        submitUserPass(inputAccount);
                    }}
                    animate={fieldErrors.username || fieldErrors.password ? (prefersReducedMotion ? {} : { x: [0, -10, 10, -10, 10, 0] }) : {}}
                    transition={{ duration: 0.4 }}
                >
                    <fieldset className="flex flex-col space-y-4" aria-label="Userpass Login Fields" id="userpass-form">
                        <div className="flex flex-col space-y-4">
                            {/* Username field with inline error */}
                            <div className="space-y-2">
                                <label htmlFor="username-input" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    Username
                                </label>
                                <Input
                                    id="username-input"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    error={Boolean(fieldErrors.username)}
                                    aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                                    aria-invalid={Boolean(fieldErrors.username)}
                                    disabled={isSubmitting}
                                    placeholder="Enter your username"
                                    onEnterKey={() => submitUserPass(inputAccount)}
                                    className="w-full"
                                />
                                {/* Reserved space for error message - prevents layout shift */}
                                <div className="min-h-[20px]">
                                    {fieldErrors.username && (
                                        <p id="username-error" className="text-sm text-base-error-600 dark:text-base-error-500">
                                            {fieldErrors.username}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password field with inline error */}
                            <div className="space-y-2">
                                <label htmlFor="password-input" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    Password
                                </label>
                                <Input
                                    id="password-input"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    error={Boolean(fieldErrors.password)}
                                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    disabled={isSubmitting}
                                    placeholder="Enter your password"
                                    onEnterKey={() => submitUserPass(inputAccount)}
                                    className="w-full"
                                />
                                {/* Reserved space for error message */}
                                <div className="min-h-[20px]">
                                    {fieldErrors.password && (
                                        <p id="password-error" className="text-sm text-base-error-600 dark:text-base-error-500">
                                            {fieldErrors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Account field (optional) */}
                            <div className="space-y-2">
                                <label htmlFor="account-input" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    Account <span className="text-neutral-500">(optional)</span>
                                </label>
                                <Input
                                    id="account-input"
                                    type="text"
                                    value={inputAccount || ''}
                                    onChange={e => setInputAccount(e.target.value || undefined)}
                                    disabled={isSubmitting}
                                    placeholder="Enter account name"
                                    onEnterKey={() => submitUserPass(inputAccount)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="success"
                            role="button"
                            onClick={() => submitUserPass(inputAccount)}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Signing in...' : 'Login'}
                        </Button>
                    </fieldset>
                </motion.form>
            </motion.div>
        );
    };

    const getLoginForm = () => {
        return (
            <motion.div initial="hidden" animate="visible" variants={formVariants} className="flex items-center justify-center min-h-screen py-8">
                <div>
                    {/* Back to Dashboard Button - now part of animated content */}
                    {isLoggedIn && (
                        <div className="mb-4">
                            <BackToDashboardButton account={loginViewModel.accountActive!} />
                        </div>
                    )}

                    <div
                        className={twMerge(
                            'flex flex-col items-center justify-between',
                            'border dark:border-2 rounded-xl p-4 md:p-6 flex flex-col justify-center space-y-4',
                            'border-neutral-300 dark:border-neutral-700',
                            'bg-neutral-50/90 dark:bg-neutral-900/90',
                            'backdrop-blur-xl',
                            'w-[90vw] md:w-[480px] mx-auto',
                            'shadow-xl',
                        )}
                        id="root"
                    >
                        <MultipleAccountsModal
                            submit={lastAuthMethod === 'x509' ? submitX509 : submitUserPass}
                            availableAccounts={availableAccounts}
                            onClose={() => setAvailableAccounts([])}
                        />
                        {/* Form-level error message with reserved space - no card flexing */}
                        <div className="min-h-[52px] w-full" role="alert" aria-live="polite" aria-atomic="true">
                            {error && (
                                <motion.div
                                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
                                >
                                    <Alert
                                        variant="error"
                                        message={error}
                                        onClose={() => {
                                            setError(undefined);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Theme-aware logo - responsive sizing */}
                        <div className="flex flex-col items-center justify-between w-full text-center">
                            <motion.div initial="hidden" animate="visible" variants={logoVariants}>
                                <RucioLogo className="text-neutral-900 dark:text-neutral-100" width={120} height={120} aria-label="Rucio Logo" />
                            </motion.div>
                        </div>

                        {/* Animated view transitions */}
                        <div className="w-full overflow-hidden">
                            <AnimatePresence mode="wait" custom={currentView === 'userpass-form' ? 1 : -1}>
                                {currentView === 'method-selection' ? renderMethodSelection() : renderUserPassForm()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return getLoginForm();
};
