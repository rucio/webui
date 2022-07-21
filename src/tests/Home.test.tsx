import { render, screen } from '@testing-library/react'
import Home from '../components/Home'
import { BrowserRouter } from 'react-router-dom'

test('renders react app', () => {
    render(
        <BrowserRouter>
            <Home />
        </BrowserRouter>,
    )
    const linkElement = screen.getByText(/Rucio Login/i)
    expect(linkElement).toBeInTheDocument()
})
