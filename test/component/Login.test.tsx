/**
 * @jest-environment jsdom
 */

import Login from '@/app/auth/login/page';
import { Login as LoginStory } from '@/component-library/pages/legacy/Login/Login';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { useSearchParams } from 'next/navigation';
import { getSampleOIDCProviders } from 'test/fixtures/oidc-provider-config';
import { getSampleVOs } from 'test/fixtures/multi-vo-fixtures';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { act } from 'react';

jest.mock('next/navigation');

describe('Login Page Test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn(() => null),
        });
        fetchMock.doMock();
    });

    afterEach(() => {
        cleanup();
        fetchMock.mockClear();
        fetchMock.dontMock();
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it(
        'Checks initial render of Login Page',
        async () => {
            const oidcProviders = getSampleOIDCProviders();
            const voList = getSampleVOs();
            fetchMock.mockIf(/login/, req =>
                Promise.resolve(
                    JSON.stringify({
                        x509Enabled: true,
                        userpassEnabled: true,
                        oidcEnabled: true,
                        oidcProviders: oidcProviders,
                        multiVOEnabled: true,
                        voList: voList,
                        isLoggedIn: false,
                        status: 'success',
                        rucioAuthHost: 'https://rucio-auth-server',
                    } as LoginViewModel),
                ),
            );

            await act(async () => {
                render(<Login />);
            });

            // Check OIDC buttons are present but NOT rendered
            voList[1].oidcProviders.map(provider => {
                const OIDCButton = screen.getByText(provider.name);
                expect(OIDCButton).toBeInTheDocument();
            });
            const oidcParent = screen.getByRole('generic', { name: /OIDC Login Buttons/ });
            expect(oidcParent.className).not.toContain('hidden');

            // Check VO tabs are rendered
            voList.map(vo => {
                const VOTab = screen.getByText(vo.name);
                expect(VOTab).toBeInTheDocument();
            });

            // Check x509 button is rendered
            const x509Button = screen.getByRole('button', { name: /x509/ });
            expect(x509Button).toBeInTheDocument();

            // Check userpass button is rendered
            const userpassButton = screen.getByRole('button', { name: /Userpass/ });
            expect(userpassButton).toBeInTheDocument();

            // check userpass form is collapsed/uncollapsed on click
            const loginFormParent = screen.getByRole('group', { name: 'Userpass Login Fields' });
            expect(loginFormParent.className).toContain('hidden');
            fireEvent.click(userpassButton);
            expect(loginFormParent.className).not.toContain('hidden');
            fireEvent.click(userpassButton);
            expect(loginFormParent.className).toContain('hidden');

            // check only 1 account field is rendered
            const accountFieldParent = screen.getByRole('group', { name: /Choose Account Name/ });
            expect(accountFieldParent.className).not.toContain('hidden');
            fireEvent.click(userpassButton);
            expect(accountFieldParent.className).toContain('hidden');
            fireEvent.click(userpassButton);
            expect(accountFieldParent.className).not.toContain('hidden');

            // Check no error message is rendered
            const errorElement = screen.queryByTestId('login-page-error');
            expect(errorElement?.className).toBe('hidden');
        },
        1000 * 60 * 5,
    );

    it('should not render OIDC buttons if OIDC is disabled', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, req =>
            Promise.resolve(
                JSON.stringify({
                    x509Enabled: true,
                    userpassEnabled: true,
                    oidcEnabled: false,
                    oidcProviders: getSampleOIDCProviders(),
                    multiVOEnabled: true,
                    voList: getSampleVOs(),
                    isLoggedIn: false,
                    status: 'error',
                } as LoginViewModel),
            ),
        );
        await act(async () => render(<Login />));

        // Check OIDC buttons: 2 pieces and collapsed
        const oidcParent = screen.queryByRole('generic', { name: /OIDC Login Buttons/ });
        expect(oidcParent).toBeNull();
    });

    it('should show error message if exists during initial page load', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, req =>
            Promise.resolve(
                JSON.stringify({
                    x509Enabled: true,
                    userpassEnabled: true,
                    oidcEnabled: false,
                    oidcProviders: getSampleOIDCProviders(),
                    multiVOEnabled: true,
                    voList: getSampleVOs(),
                    isLoggedIn: false,
                    status: 'error',
                    message: 'Some Random Error Message',
                } as LoginViewModel),
            ),
        );
        await act(async () => render(<Login />));
        const alert = screen.getByTestId('login-page-error');
        expect(alert).toBeInTheDocument();
        expect(alert.textContent).toContain('Some Random Error Message');
    });

    it('should show error message if login fails', async () => {
        const loginViewModel: LoginViewModel = {
            x509Enabled: true,
            userpassEnabled: true,
            oidcEnabled: false,
            oidcProviders: getSampleOIDCProviders(),
            multiVOEnabled: true,
            voList: getSampleVOs(),
            isLoggedIn: false,
            accountActive: undefined,
            accountsAvailable: undefined,
            status: 'success',
            rucioAuthHost: 'https://rucio-auth.cern.ch',
        };

        const authViewModel: AuthViewModel = {
            status: 'error',
            message: 'Invalid Credentials',
            rucioAccount: '',
            rucioMultiAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioIdentity: '',
            rucioAuthTokenExpires: '',
            role: undefined,
        };

        await act(async () =>
            render(
                <LoginStory
                    loginViewModel={loginViewModel}
                    authViewModel={authViewModel}
                    userPassSubmitHandler={() => {}}
                    oidcSubmitHandler={() => {}}
                    x509SubmitHandler={() => {
                        return Promise.resolve(authViewModel);
                    }}
                    x509SessionHandler={authViewModel => {}}
                />,
            ),
        );
        expect(screen.queryByRole('dialog', { name: /Multiaccount Modal/ })).not.toBeInTheDocument();
        const userPassButton = screen.getByRole('button', { name: /Userpass/ });
        fireEvent.click(userPassButton);
        const loginButton = screen.getByRole('button', { name: /Login/ });
        fireEvent.click(loginButton);
        const alert = screen.getByTestId('login-page-error');
        expect(alert).toBeInTheDocument();
        expect(alert.textContent).toContain('Invalid Credentials');
    });

    it('test if modal will show if user has multiple accounts', async () => {
        const loginViewModel: LoginViewModel = {
            x509Enabled: true,
            userpassEnabled: true,
            oidcEnabled: false,
            oidcProviders: getSampleOIDCProviders(),
            multiVOEnabled: true,
            voList: getSampleVOs(),
            isLoggedIn: false,
            accountActive: undefined,
            accountsAvailable: undefined,
            status: 'success',
            rucioAuthHost: 'https://rucio-auth.cern.ch',
        };
        const authViewModel: AuthViewModel = {
            status: 'multiple_accounts',
            message: '',
            rucioAccount: '',
            rucioMultiAccount: 'account1,account2',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioIdentity: '',
            rucioAuthTokenExpires: '',
            role: undefined,
        };
        await act(async () =>
            render(
                <LoginStory
                    loginViewModel={loginViewModel}
                    authViewModel={authViewModel}
                    userPassSubmitHandler={() => {}}
                    oidcSubmitHandler={() => {}}
                    x509SubmitHandler={() => {
                        return Promise.resolve(authViewModel);
                    }}
                    x509SessionHandler={authViewModel => {}}
                />,
            ),
        );

        const modal = screen.getByRole('dialog', { name: /Multiaccount Modal/ });
        expect(modal).toBeInTheDocument();
    });

    it('should show error alert if login fails, user closes alert, and login fails again', async () => {
        const loginViewModel: LoginViewModel = {
            x509Enabled: true,
            userpassEnabled: true,
            oidcEnabled: false,
            oidcProviders: getSampleOIDCProviders(),
            multiVOEnabled: true,
            voList: getSampleVOs(),
            isLoggedIn: false,
            accountActive: undefined,
            accountsAvailable: undefined,
            status: 'success',
            rucioAuthHost: 'https://rucio-auth.cern.ch',
        };

        const authViewModel: AuthViewModel = {
            status: 'error',
            message: 'Invalid Credentials',
            rucioAccount: '',
            rucioMultiAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioIdentity: '',
            rucioAuthTokenExpires: '',
            role: undefined,
        };

        await act(async () =>
            render(
                <LoginStory
                    loginViewModel={loginViewModel}
                    authViewModel={authViewModel}
                    userPassSubmitHandler={() => {}}
                    oidcSubmitHandler={() => {}}
                    x509SubmitHandler={() => {
                        const x509ErrorModel = {
                            ...authViewModel,
                        };
                        x509ErrorModel.message = 'Oops, something went wrong';
                        return Promise.resolve(x509ErrorModel);
                    }}
                    x509SessionHandler={() => {}}
                />,
            ),
        );

        // check if Alert is displayed with message Invalid Credentials
        const alertCollapsible = screen.getByTestId('login-page-error');
        expect(alertCollapsible.className).not.toContain('hidden');

        const alertCloseButton = screen.getByRole('button', { name: /Close/ });

        // close the alert
        await act(async () => fireEvent.click(alertCloseButton));

        // check if Alert is not displayed
        expect(alertCollapsible.className).toContain('hidden');

        // Login again
        const x509LoginButton = screen.getByRole('button', { name: /x509/ });
        await act(async () => fireEvent.click(x509LoginButton));

        // check if Alert is displayed with message Oops, something went wrong
        expect(alertCollapsible.className).not.toContain('hidden');
        expect(alertCollapsible.textContent).toContain('Oops, something went wrong');

        // close the alert again
        await act(async () => fireEvent.click(alertCloseButton));

        // check if Alert is not displayed
        expect(alertCollapsible.className).toContain('hidden');
    });
    it('should not show userpass button if userpass is disabled', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, req =>
            Promise.resolve(
                JSON.stringify({
                    x509Enabled: true,
                    userpassEnabled: false,
                    oidcEnabled: false,
                    oidcProviders: getSampleOIDCProviders(),
                    multiVOEnabled: true,
                    voList: getSampleVOs(),
                    isLoggedIn: false,
                    status: 'error',
                } as LoginViewModel),
            ),
        );
        await act(async () => render(<Login />));

        // Check userpass button: 1 piece and collapsed
        const userpassButton = screen.queryByRole('button', { name: /Userpass/ });
        expect(userpassButton).toBeNull();
    });
});
