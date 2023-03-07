import { useRouter, useSearchParams } from "next/navigation";
import Login from "@/app/auth/login/page";
import { act, render, screen, cleanup, fireEvent } from "@testing-library/react";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { getSampleVOs } from "test/fixtures/multi-vo-fixtures";
import { getSampleOIDCProviders } from "test/fixtures/oidc-provider-config";
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
jest.mock('next/navigation')

describe('Login Component Tests for x509 Login workflow', () => {
    beforeEach(() => {
        useSearchParams.mockReturnValue(
            {
                get: jest.fn(() => null)
            }
        )
        useRouter.mockReturnValue(
            {
                push: jest.fn()
            }
        )
        fetchMock.doMock();
    });
    afterEach(() => {
        fetchMock.mockClear()
        fetchMock.dontMock()
        jest.clearAllMocks()
        jest.resetAllMocks()
        cleanup()
    })
    it('should send well formed request to RUCIO_AUTH_HOST/auth/x509 endpoint and handle successful response', async () => {
        fetchMock.mockIf(/.*/, (req) => {
            if (req.url === '/api/auth/login' && req.method === 'POST') {
                return Promise.resolve({
                    body: JSON.stringify({
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: getSampleOIDCProviders(),
                        multiVOEnabled: true,
                        voList: getSampleVOs(),
                        isLoggedIn: false,
                        status: "success",
                        rucioAuthHost: "https://rucio-auth-server",
                    } as LoginViewModel)
                });
            } else if (req.url === 'https://rucio-auth-server/auth/x509' && req.method === 'GET') {
                expect(req.headers.get('X-Rucio-VO')).toBe('atl')
                expect(req.headers.get('X-Rucio-AppID')).toBe('rucio-webui')
                expect(req.headers.get('X-Rucio-Allow-Return-Multiple-Accounts')).toBe('true')
                return Promise.resolve(
                    {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Rucio-Auth-Token': 'rucio-asdnjkdf',
                            'X-Rucio-Auth-Token-Expires': '2021-09-01T00:00:00Z',
                            'X-Rucio-Auth-Account': 'root',
                        },
                        body: JSON.stringify({
                            rucioAuthToken: 'rucio-asdnjkdf'
                        })
                    })
            } else {
                return Promise.resolve(
                    JSON.stringify({})
                )
            }
        })

        await act(() => {
            render(<Login />)
        })

        const x509Button = screen.getByRole('button', { name: /x509/ })
        expect(x509Button).toBeInTheDocument()

        await act(() => fireEvent.click(x509Button))
        expect(fetchMock).toBeCalledTimes(3)

    })

    it('should handle HTTP 401 Unauthorized response', async () => {
        fetchMock.mockIf(/.*/, async (req) => {
            if (req.url === '/api/auth/login' && req.method === 'POST') {
                return Promise.resolve({
                    body: JSON.stringify({
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: getSampleOIDCProviders(),
                        multiVOEnabled: true,
                        voList: getSampleVOs(),
                        isLoggedIn: false,
                        status: "success",
                        rucioAuthHost: "https://rucio-auth-server",
                    } as LoginViewModel)
                });
            } else if (req.url === 'https://rucio-auth-server/auth/x509' && req.method === 'GET') {
                expect(req.headers.get('X-Rucio-VO')).toBe('atl')
                expect(req.headers.get('X-Rucio-AppID')).toBe('rucio-webui')
                expect(req.headers.get('X-Rucio-Allow-Return-Multiple-Accounts')).toBe('true')
                return Promise.resolve(
                    {
                        status: 401,
                        headers: {
                            
                        },
                        body: JSON.stringify({
                            ExceptionClass: 'CannotAuthenticate',
                            ExceptionMessage: 'Cannot authenticate user'
                        })
                    })
            } else if (req.url === '/api/auth/x509' && req.method === 'POST') {
                const body: AuthViewModel = await req.json()
                expect(body).toHaveProperty('rucioAuthToken')
                expect(body.rucioAuthToken).toBe('rucio-asdnjkdf')
                return Promise.resolve({
                    status: 200,
                })
            }
        })

        await act(() => {
            render(<Login />)
        })
        
        const x509Button = screen.getByRole('button', { name: /x509/ })
        expect(x509Button).toBeInTheDocument()

        await act(() => { fireEvent.click(x509Button) })
        expect(fetchMock).toBeCalledTimes(2)

        const errorAlert = await screen.getByTestId('login-page-error')
        expect(errorAlert.innerHTML).toContain('Unauthorized: Cannot authenticate user')

    })

    it('should handle HTTP 206 multiple accounts response', async () => {
        fetchMock.mockIf(/.*/, async (req) => {
            if (req.url === '/api/auth/login' && req.method === 'POST') {
                return Promise.resolve({
                    body: JSON.stringify({
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: getSampleOIDCProviders(),
                        multiVOEnabled: true,
                        voList: getSampleVOs(),
                        isLoggedIn: false,
                        status: "success",
                        rucioAuthHost: "https://rucio-auth-server",
                    } as LoginViewModel)
                });
            } else if (req.url === 'https://rucio-auth-server/auth/x509' && req.method === 'GET') {
                expect(req.headers.get('X-Rucio-VO')).toBe('atl')
                expect(req.headers.get('X-Rucio-AppID')).toBe('rucio-webui')
                expect(req.headers.get('X-Rucio-Allow-Return-Multiple-Accounts')).toBe('true')
                return Promise.resolve(
                    {
                        status: 206,
                        headers: {
                            'X-Rucio-Auth-Accounts': 'ddmlab,root,test'
                        },
                    })
            } else if (req.url === '/api/auth/x509' && req.method === 'POST') {
                const body: AuthViewModel = await req.json()
                expect(body).toHaveProperty('rucioAuthToken')
                expect(body.rucioAuthToken).toBe('rucio-asdnjkdf')
                return Promise.resolve({
                    status: 200,
                })
            }
        })

        await act(() => {
            render(<Login />)
        })
        
        const x509Button = screen.getByRole('button', { name: /x509/ })
        expect(x509Button).toBeInTheDocument()

        await act(() => { fireEvent.click(x509Button) })
        expect(fetchMock).toBeCalledTimes(2)

        // TODO check if modal is displayed and if it contains the correct accounts (ddmlab,root,test)
    
    })
})