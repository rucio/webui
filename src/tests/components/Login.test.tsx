import { act, fireEvent, render, screen } from '@testing-library/react'
import Login from '../../components/Login'
import { BrowserRouter } from 'react-router-dom'
import { ServiceProvider } from '../../components/GlobalHooks'
import { ReactElement } from 'react'
import { env } from '../../util'

window.scrollTo = jest.fn()

const renderComponent: ReactElement = (
    <ServiceProvider>
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    </ServiceProvider>
)

const multi_vo = env('multi_vo_enabled')?.toLowerCase() === 'true'

const itif = (condition: boolean) => (condition ? it : it.skip)

describe('Login page render', () => {
    test('Titles', () => {
        render(renderComponent)
        const loginPrimaryText = screen.getByText('Rucio Login')
        expect(loginPrimaryText).toBeInTheDocument()

        const loginSecondaryText = screen.getByText('Welcome to Rucio!')
        expect(loginSecondaryText).toBeInTheDocument()
    })

    itif(multi_vo)('Multi-vo Tabs Enabled', () => {
        render(renderComponent)
        const voTab1 = screen.getByTestId('Tab0')
        expect(voTab1).toBeInTheDocument()
        const voTab2 = screen.getByTestId('Tab1')
        expect(voTab2).toBeInTheDocument()
        const voTab3 = screen.getByTestId('Tab2')
        expect(voTab3).toBeInTheDocument()

        expect(voTab1.getAttribute('class')).toEqual('is-active')
        expect(voTab2.getAttribute('class')).toEqual(null)
        expect(voTab3.getAttribute('class')).toEqual(null)

        const voTab2Target = screen.getByText('Operations')
        expect(() => act(() => voTab2Target.click())).not.toThrow()

        expect(voTab1.getAttribute('class')).toEqual(null)
        expect(voTab2.getAttribute('class')).toEqual('is-active')
        expect(voTab3.getAttribute('class')).toEqual(null)

        const voTab3Target = screen.getByText('Dteam')
        expect(() => act(() => voTab3Target.click())).not.toThrow()

        expect(voTab1.getAttribute('class')).toEqual(null)
        expect(voTab2.getAttribute('class')).toEqual(null)
        expect(voTab3.getAttribute('class')).toEqual('is-active')

        const voTab1Target = screen.getByText('ATLAS')
        expect(() => act(() => voTab1Target.click())).not.toThrow()

        expect(voTab1.getAttribute('class')).toEqual('is-active')
        expect(voTab2.getAttribute('class')).toEqual(null)
        expect(voTab3.getAttribute('class')).toEqual(null)
    })

    test('Login Options', () => {
        render(renderComponent)
        const x509PassAuthText = screen.getByText('x509 Certificate')
        expect(x509PassAuthText).toBeInTheDocument()

        const userPassAuthText = screen.getByText('Username / Password')
        expect(userPassAuthText).toBeInTheDocument()
    })
})

describe('Auth workflow', () => {
    test('Userpass', () => {
        render(renderComponent)
        const userPassButton = screen.getByText('Username / Password')

        act(() => {
            userPassButton.click()
        })

        const userPassUsernameInput =
            screen.getByPlaceholderText('Enter Username')
        expect(userPassUsernameInput).toBeInTheDocument()
        expect(userPassUsernameInput.innerHTML.length).toEqual(0)

        const userPassPasswordInput =
            screen.getByPlaceholderText('Enter Password')
        expect(userPassPasswordInput).toBeInTheDocument()
        expect(userPassPasswordInput.innerHTML.length).toEqual(0)

        const userPassSignInButton = screen.getByText('Sign In')
        expect(userPassSignInButton).toBeInTheDocument()
        expect(userPassSignInButton.getAttribute('type')).toEqual('button')
        expect(userPassSignInButton.getAttribute('aria-disabled')).toEqual(
            'true',
        )

        fireEvent.change(userPassUsernameInput, { target: { value: 'ddmlab' } })
        fireEvent.change(userPassPasswordInput, { target: { value: 'secret' } })

        const userPassSignInButtonEnabled = screen.getByText('Sign In')
        expect(userPassSignInButtonEnabled).toBeInTheDocument()
        expect(userPassSignInButtonEnabled.getAttribute('type')).toEqual(
            'submit',
        )
        expect(
            userPassSignInButtonEnabled.getAttribute('aria-disabled'),
        ).toEqual('false')

        expect(() =>
            act(() => userPassSignInButtonEnabled.click()),
        ).not.toThrow()
    })
})
