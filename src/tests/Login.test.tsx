import { act, fireEvent, render, screen } from '@testing-library/react'
import Login from '../components/Login'
import { BrowserRouter } from 'react-router-dom'
import { ServiceProvider } from '../components/GlobalHooks'
import { ReactElement } from 'react'

const renderComponent: ReactElement = (
    <ServiceProvider>
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    </ServiceProvider>
)

test('Login page render', () => {
    render(renderComponent)
    const loginPrimaryText = screen.getByText('Rucio Login')
    expect(loginPrimaryText).toBeInTheDocument()

    const loginSecondaryText = screen.getByText('Welcome to Rucio!')
    expect(loginSecondaryText).toBeInTheDocument()

    const x509PassAuthText = screen.getByText('x509 Certificate')
    expect(x509PassAuthText).toBeInTheDocument()

    const OAuthText = screen.getByText('OIDC OAuth')
    expect(OAuthText).toBeInTheDocument()

    const userPassAuthText = screen.getByText('Username / Password')
    expect(userPassAuthText).toBeInTheDocument()
})

test('x509 auth flow', () => {
    render(renderComponent)
    const x509Button = screen.getByText('x509 Certificate')
    expect(x509Button.getAttribute('type')).toEqual('submit')

    act(() => {
        x509Button.click()
    })

    expect(() => act(() => x509Button.click())).not.toThrow()
})

test('OIDC auth flow', () => {
    render(renderComponent)
    const OIDCButton = screen.getByText('OIDC OAuth')
    expect(OIDCButton.getAttribute('type')).toEqual('submit')

    act(() => {
        OIDCButton.click()
    })

    expect(() => act(() => OIDCButton.click())).not.toThrow()
})

test('Userpass auth flow', () => {
    render(renderComponent)
    const userPassButton = screen.getByText('Username / Password')

    act(() => {
        userPassButton.click()
    })

    const userPassUsernameInput = screen.getByPlaceholderText('Enter Username')
    expect(userPassUsernameInput).toBeInTheDocument()
    expect(userPassUsernameInput.innerHTML.length).toEqual(0)

    const userPassPasswordInput = screen.getByPlaceholderText('Enter Password')
    expect(userPassPasswordInput).toBeInTheDocument()
    expect(userPassPasswordInput.innerHTML.length).toEqual(0)

    const userPassSignInButton = screen.getByText('Sign In')
    expect(userPassSignInButton).toBeInTheDocument()
    expect(userPassSignInButton.getAttribute('type')).toEqual('button')
    expect(userPassSignInButton.getAttribute('aria-disabled')).toEqual('true')

    fireEvent.change(userPassUsernameInput, { target: { value: 'ddmlab' } })
    fireEvent.change(userPassPasswordInput, { target: { value: 'secret' } })

    expect(userPassSignInButton.getAttribute('type')).toEqual('submit')
    expect(userPassSignInButton.getAttribute('aria-disabled')).toEqual('false')

    expect(() => act(() => userPassSignInButton.click())).not.toThrow()
})
