import Login from "@/app/auth/login/page";
import { render, act, screen } from "@testing-library/react";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login"
import { useRouter, useSearchParams } from "next/navigation";

// const mockuserpassSubmit = async (username: string, password: string) => {
//     if(username === "test" && password === "test"){
//         const redirect: string = redirectURL
//         router.push(redirect)
//     }
//     else {
//         console.log("Invalid username or password")
//     }
// };


jest.mock('next/navigation')

describe("Login Page Test", () => {
    beforeEach(() => {
        useSearchParams.mockReturnValue(
            {
                get: jest.fn(() => null)
            }
        )
    });
    it("All", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2", "OIDC Provider 3"],
                        multiVOEnabled: true,
                        voList: ["VO 1", "VO 2", "VO 3"],
                        isLoggedIn: false,
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))

        // Check OIDC buttons: 3 pieces and not collapsed
        const OIDCButtons = screen.getAllByText(/OIDC/)
        expect(OIDCButtons.length).toBe(3)
        expect(
            OIDCButtons[0].parentNode?.parentNode?.className?.split(" ").includes("collapsed")
        ).toBe(false)
    })
    it("Only Two OIDC", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2"],
                        multiVOEnabled: true,
                        voList: ["VO 1", "VO 2", "VO 3"],
                        isLoggedIn: false,
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))

        // Check OIDC buttons: 2 pieces and collapsed
        const OIDCButtons = screen.getAllByText(/OIDC/)
        expect(OIDCButtons.length).toBe(2)
        expect(
            OIDCButtons[0].parentNode?.parentNode?.className?.split(" ").includes("collapsed")
        ).toBe(false)
    })
    it("Collapsed OIDC", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: true,
                        oidcEnabled: false,
                        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2"],
                        multiVOEnabled: true,
                        voList: ["VO 1", "VO 2", "VO 3"],
                        isLoggedIn: false,
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))

        // Check OIDC buttons: 2 pieces and collapsed
        const OIDCButtons = screen.getAllByText(/OIDC/)
        expect(
            OIDCButtons[0].parentNode?.parentNode?.className?.split(" ").includes("collapse")
        ).toBe(true)
    })
    it("Only Userpass", async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/login/, (req) => Promise.resolve(JSON.stringify(
                    {
                        x509Enabled: false,
                        oidcEnabled: false,
                        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2"],
                        multiVOEnabled: false,
                        voList: ["VO 1", "VO 2", "VO 3"],
                        isLoggedIn: false,
                    } as LoginViewModel)));
        await act( async () => render(<Login/>))

        const OIDCButtons = screen.getAllByText(/OIDC/)
        expect(
            OIDCButtons[0].parentNode?.parentNode?.className?.split(" ").includes("collapse")
        ).toBe(true)
        const x509Buttons = screen.getAllByText(/x509/)
        expect(
            x509Buttons[0].parentNode?.className?.split(" ").includes("collapse")
        ).toBe(true)
        const VOButtons = screen.getAllByText(/VO/)
        expect(
            VOButtons[0].parentNode?.parentNode?.parentNode?.className?.split(" ").includes("collapse")
        ).toBe(true)
    })
})