import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from './Login'
import { BrowserRouter } from 'react-router-dom'

test('renders react app', () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>,
    )
    const linkElement = screen.getByText(/Rucio Login/i)
    expect(linkElement).toBeInTheDocument()
})
