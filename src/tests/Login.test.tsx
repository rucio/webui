import { render, screen } from '@testing-library/react'
import Login from '../components/Login'
import { BrowserRouter } from 'react-router-dom'

test('Check textual content, no user action', () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>,
    )
    const loginPrimaryText = screen.getByText(/Rucio Login/i)
    expect(loginPrimaryText).toBeInTheDocument()

    const loginSecondaryText = screen.getByText(/Welcome to Rucio!/i)
    expect(loginSecondaryText).toBeInTheDocument()

    const x509PassAuthText = screen.getByText(/x509 Certificate/i)
    expect(x509PassAuthText).toBeInTheDocument()

    const OAuthText = screen.getByText(/OIDC OAuth/i)
    expect(OAuthText).toBeInTheDocument()

    const userPassAuthText = screen.getByText(/Username\/Password/i)
    expect(userPassAuthText).toBeInTheDocument()
})

test('Check textual content, with user action', () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>,
    )
    const userPassButton = screen.findAllByLabelText('Username/Password')
    expect(userPassButton).toBeInTheDocument()
})
