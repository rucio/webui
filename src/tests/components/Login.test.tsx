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
        const loginSecondaryText = screen.getByText('Welcome to Rucio!')
    })

    itif(multi_vo)('Multi-vo Tabs Enabled', () => {
        render(renderComponent)
        
        const atlasTab = screen.getByText('ATLAS')
        const opsTab = screen.getByText('Operations')
        const dtmTab = screen.getByText('Dteam')

        expect(atlasTab.parentElement?.getAttribute('class')).toEqual('is-active')
        expect(opsTab.parentElement?.getAttribute('class')).toEqual(null)
        expect(dtmTab.parentElement?.getAttribute('class')).toEqual(null)

        expect(() => act(() => opsTab.click())).not.toThrow()

        expect(atlasTab.parentElement?.getAttribute('class')).toEqual(null)
        expect(opsTab.parentElement?.getAttribute('class')).toEqual('is-active')
        expect(dtmTab.parentElement?.getAttribute('class')).toEqual(null)

        expect(() => act(() => dtmTab.click())).not.toThrow()

        expect(atlasTab.parentElement?.getAttribute('class')).toEqual(null)
        expect(opsTab.parentElement?.getAttribute('class')).toEqual(null)
        expect(dtmTab.parentElement?.getAttribute('class')).toEqual('is-active')

        expect(() => act(() => atlasTab.click())).not.toThrow()

        expect(atlasTab.parentElement?.getAttribute('class')).toEqual('is-active')
        expect(opsTab.parentElement?.getAttribute('class')).toEqual(null)
        expect(dtmTab.parentElement?.getAttribute('class')).toEqual(null)
    })

    test('Login Options', () => {
        render(renderComponent)
        const x509PassAuthText = screen.getByText('x509 Certificate')
        const userPassAuthText = screen.getByText('Username / Password')
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
        expect(userPassUsernameInput.innerHTML.length).toEqual(0)

        const userPassPasswordInput =
            screen.getByPlaceholderText('Enter Password')
        expect(userPassPasswordInput.innerHTML.length).toEqual(0)

        const userPassSignInButton = screen.getByText('Sign In')
        expect(userPassSignInButton.getAttribute('type')).toEqual('button')
        expect(userPassSignInButton.getAttribute('aria-disabled')).toEqual(
            'true',
        )

        fireEvent.change(userPassUsernameInput, { target: { value: 'ddmlab' } })
        fireEvent.change(userPassPasswordInput, { target: { value: 'secret' } })

        const userPassSignInButtonEnabled = screen.getByText('Sign In')
        expect(userPassSignInButtonEnabled.getAttribute('type')).toEqual(
            'submit',
        )
        expect(
            userPassSignInButtonEnabled.getAttribute('aria-disabled'),
        ).toEqual('false')

    })
})
