import { render } from '@testing-library/react'
import { RuleDef } from '../../components/RuleDef'
import { BrowserRouter } from 'react-router-dom'

test('renders Rule Definition page', () => {
    render(
        <BrowserRouter>
            <RuleDef />
        </BrowserRouter>,
    )
})
