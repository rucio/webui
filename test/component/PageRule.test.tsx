/**
 * @jest-environment jsdom
 */

import { render, act, screen, cleanup, fireEvent, getByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageRule as PageRuleStory } from "@/component-library/components/Pages/PageRule/PageRule";
import { createRandomRulePageLockEntry, createRuleMeta, mockUseComDOM } from "test/fixtures/table-fixtures";
var format = require("date-format")

const ruleMeta = createRuleMeta()

describe("PageRule Story Test", () => {
    it("Check Subpage Movement", async () => {
        await act(async () => render(
            <PageRuleStory
                ruleMeta={ruleMeta}
                ruleLocks={mockUseComDOM(Array.from({length: 100}, (v,k) => createRandomRulePageLockEntry()))}
            />
        ))
        const user = userEvent.setup()
        const selectedTabExpect = () => expect(screen.getByRole("tab", { selected: true }))
        // check if the metadata tab is active
        selectedTabExpect().toHaveTextContent("Metadata")
        // assert metadata is visible
        expect(screen.queryByRole("tabpanel", { name: "Metadata" })).toBeVisible()
        // click on locks tab
        await user.click(screen.getByRole("tab", { name: "Locks"}))
        selectedTabExpect().toHaveTextContent("Locks")
        expect(screen.queryByRole("tabpanel", { name: "Locks" })).toBeVisible()

        // assert header is properly done
        expect(
            screen.getByRole("heading", { name: /For rule/})
        ).toHaveTextContent(
            `${ruleMeta.scope}:${ruleMeta.name}`
        )
        // click on header
        await user.click(screen.getByRole("heading", { name: /For rule/}))
        selectedTabExpect().not.toHaveFocus()
        // tab to focus the `locks` tab
        await user.tab()
        selectedTabExpect().toHaveFocus()
        // arrow right to focus the `metadata` tab (test cycling!)
        await user.keyboard("{arrowright}")
        selectedTabExpect().toHaveTextContent("Metadata")
        // arrow right to focus `locks`
        await user.keyboard("{arrowright}")
        selectedTabExpect().toHaveTextContent("Locks")
        // tab again to focus `filter DID` input
        await user.tab()
        expect(screen.getByPlaceholderText(/Filter DID/)).toHaveFocus()
        // NB: we cant test further tabbing, because the testing library doesnt
        // support responsive design: this means that the next tab will lead to
        // the `Magnifying Glass` button which would be hidden otherwise.

        // back to `locks` tab
        await user.tab({shift: true})
        // arrow left to focus the `metadata` tab
        await user.keyboard("{arrowleft}")
        selectedTabExpect().toHaveTextContent("Metadata")
    })
})