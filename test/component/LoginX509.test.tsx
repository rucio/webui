import { useSearchParams } from "next/navigation";
import Login from "@/app/auth/login/page";
import { act, render, screen, cleanup, fireEvent } from "@testing-library/react";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { getSampleVOs } from "test/fixtures/multi-vo-fixtures";
import { getSampleOIDCProviders } from "test/fixtures/oidc-provider-config";
jest.mock('next/navigation')

describe('Login Component Tests for x509 Login workflow', () => {
    beforeEach(() => {
        useSearchParams.mockReturnValue(
            {
                get: jest.fn(() => null)
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
    it('should send well formed request to RUCIO_AUTH_HOST/auth/x509 endpoint', async () => {
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
                        'X-Rucio-Auth-Token-Expires': '2021-09-01T00:00:00Z'
                    },
                    body: JSON.stringify({
                        rucioAuthToken: 'rucio-asdnjkdf'
                    })
                })
            }
        })
        
        await act(() => {
            render(<Login />)
        })

        const x509Button = screen.getByRole('button', {name: /x509/})
        expect(x509Button).toBeInTheDocument()

        fireEvent.click(x509Button)
        expect(fetchMock).toBeCalledTimes(2)

    })
})