import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders react app', () => {
    render(<App />)
    const linkElement = screen.getByText(/Rucio Login/i)
    expect(linkElement).toBeInTheDocument()
})
