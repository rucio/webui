import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from './Login'

test('renders react app', () => {
    render(<Login />)
    const linkElement = screen.getByText(/Rucio Login/i)
    expect(linkElement).toBeInTheDocument()
})
