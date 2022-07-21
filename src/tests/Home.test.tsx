import { render, screen } from '@testing-library/react'
import Home from '../components/Home'
import { BrowserRouter } from 'react-router-dom'

test('renders react app', () => {
    render(
        <BrowserRouter>
            <Home />
        </BrowserRouter>,
    )
    const welcomeElement = screen.getByText(/Welcome/i)
    expect(welcomeElement).toBeInTheDocument()
})
