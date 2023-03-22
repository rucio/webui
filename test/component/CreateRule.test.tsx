/**
 * @jest-environment jsdom
 */

import { render, act, screen, cleanup, fireEvent } from "@testing-library/react";
import CreateRule from "@/app/createRule/page";
import { CreateRule as CreateRuleStory } from "@/component-library/components/Pages/CreateRule/CreateRule";

jest.mock('next/navigation')

describe('Create Rule Page Tests', () => {
    it("Checks initial render of Create Rule Page", async () => {
        await act( async () => render(<CreateRule/>))

        const createRulePage = screen.getByTestId('selectDIDmethod')
        expect(createRulePage).toBeInTheDocument()
    })
})
