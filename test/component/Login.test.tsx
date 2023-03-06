/**
 * @jest-environment jsdom
 */

import Login from "@/app/auth/login/page";
import { Login as LoginStory } from "@/component-library/components/Pages/Login/Login";
import { render, act, screen, cleanup, fireEvent } from "@testing-library/react";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login"
import { useSearchParams } from "next/navigation";
import { getSampleOIDCProviders } from "test/fixtures/oidc-provider-config";
import { getSampleVOs } from "test/fixtures/multi-vo-fixtures";
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";

jest.mock('next/navigation')

describe("Login Page Test", () => {
    beforeEach(() => {
        useSearchParams.mockReturnValue(
            {
                get: jest.fn(() => null)
            }
        )
        fetchMock.doMock();
    });

    afterEach(() => {
        cleanup()
        fetchMock.mockClear()
        fetchMock.dontMock()
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it("Checks initial render of Login Page", async () => {
        const oidcProviders = getSampleOIDCProviders()
        const voList = getSampleVOs()
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
            {
                x509Enabled: true,
                oidcEnabled: true,
                oidcProviders: oidcProviders,
                multiVOEnabled: true,
                voList: voList,
                isLoggedIn: false,
                status: "success"
            } as LoginViewModel)));
        
        await act( async () => render(<Login/>))

        // Check OIDC buttons are present but NOT rendered
        oidcProviders.map((provider) => {
            const OIDCButton = screen.getByText(provider.name)
            expect(OIDCButton).toBeInTheDocument()
        })
        const oidcParent = screen.getByTestId('oidc-buttons')
        expect(oidcParent.className).not.toContain('collapse')

        // Check VO tabs are rendered
        voList.map((vo) => {
            const VOTab = screen.getByText(vo.name)
            expect(VOTab).toBeInTheDocument()
        })

        // Check x509 button is rendered
        const x509Button = screen.getByRole('button', {name: /x509/})
        expect(x509Button).toBeInTheDocument()
    
        // Check userpass button is rendered
        const userpassButton = screen.getByRole('button', {name: /Userpass/})
        expect(userpassButton).toBeInTheDocument()

        // check userpass form is collapsed/uncollapsed on click
        const loginFormParent = screen.getByTestId('userpass-form')
        expect(loginFormParent.className).toContain('collapse')
        fireEvent.click(userpassButton)
        expect(loginFormParent.className).not.toContain('collapse')
        fireEvent.click(userpassButton)
        expect(loginFormParent.className).toContain('collapse')

        // Check no error message is rendered
        const errorMessage = screen.queryByTestId('login-page-error')
        expect(errorMessage).not.toBeInTheDocument()

    })
    
    it("should not render OIDC buttons if OIDC is disabled", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: true,
                        oidcEnabled: false,
                        oidcProviders: getSampleOIDCProviders(),
                        multiVOEnabled: true,
                        voList: getSampleVOs(),
                        isLoggedIn: false,
                        status: "error"
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))

        // Check OIDC buttons: 2 pieces and collapsed
        const oidcParent = screen.getByTestId('oidc-buttons')
        expect(oidcParent.className).toContain('collapse')
        
    })

    it("should show error message if login fails", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: true,
                        oidcEnabled: false,
                        oidcProviders: getSampleOIDCProviders(),
                        multiVOEnabled: true,
                        voList: getSampleVOs(),
                        isLoggedIn: false,
                        status: "error",
                        message: "Some Random Error Message"
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))
        const alert = screen.getByTestId('login-page-error')
        expect(alert).toBeInTheDocument()
        expect(alert.textContent).toContain("Some Random Error Message")
        
    })

    it("should show error message if login fails", async () => {
        const loginViewModel: LoginViewModel = {
            x509Enabled: true,
            oidcEnabled: false,
            oidcProviders: getSampleOIDCProviders(),
            multiVOEnabled: true,
            voList: getSampleVOs(),
            isLoggedIn: false,
            status: "success",
        }

        const authViewModel: AuthViewModel = {
            status: "error",
            message: "Invalid Credentials",
            rucioAccount: "",
            rucioAuthType: "",
            rucioAuthToken: "",
            rucioIdentity: "",
        }

        await act( async () => render(<LoginStory
            loginViewModel={loginViewModel}
            authViewModel={authViewModel}
            userPassSubmitHandler = {() => {}}
            oidcSubmitHandler = {() => {}}
            x509SubmitHandler = {() => {}}
        />))
        const userPassButton = screen.getByRole('button', {name: /Userpass/})
        fireEvent.click(userPassButton)
        const loginButton = screen.getByRole('button', {name: /Login/})
        fireEvent.click(loginButton)
        const alert = screen.getByTestId('login-page-error')
        expect(alert).toBeInTheDocument()
        expect(alert.textContent).toContain("Invalid Credentials")
    })
   
})