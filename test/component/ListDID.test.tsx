/**
 * @jest-environment jsdom
 */

import { render, act, screen, cleanup, fireEvent } from "@testing-library/react";
import { ListDID as ListDIDStory } from "@/component-library/Pages/DID/ListDID";
import { DIDMeta } from "@/lib/core/entity/rucio";
import { fixtureDIDViewModel, fixtureDIDMetaViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { DIDMetaViewModel } from "@/lib/infrastructure/data/view-model/did";
var format = require("date-format")

describe("ListDID Story Test", () => {
    it("Checks empty render of the story", async () => {
        await act(async () => render(
            <ListDIDStory
                comdom={mockUseComDOM(Array.from({length: 0}, () => fixtureDIDViewModel()))}
                didQuery={jest.fn(x => console.log(x))}
                didMetaQuery={jest.fn(x => console.log(x))}
                didMetaQueryResponse={{} as DIDMetaViewModel}
            />
        ))
        // check if DID Search Pattern Input exists
        const searchPatternInput = screen.getByLabelText("DID Search Pattern")
        expect(searchPatternInput).toHaveValue("")
        // check if query is set to Containers and Datasets
        const datasetButton= screen.getByLabelText("Dataset")
        expect(datasetButton).toBeChecked()
        const filesButton = screen.getByLabelText("File")
        expect(filesButton).not.toBeChecked()
        // Check that `No DID selected` is shown instead of the DIDMetaView, etc
        const noDIDSelectedDiv = screen.getByText("No DID selected").closest("div")
        expect(noDIDSelectedDiv).toHaveClass("block")
        const goDIDViewButton = screen.getByText("Go To DID Page").closest("button")
        expect(goDIDViewButton?.parentElement).toHaveClass("hidden")
        // Check that the DID Table Search is empty
        const didFilterInputs = screen.getAllByPlaceholderText("Filter DID")
        didFilterInputs.map((didFilterInput) => { expect(didFilterInput).toHaveValue("") })
        // Check that we are on page 1 of 0 (I know, technically this is a bug)
        const paginationNav = screen.getByRole("navigation", { name: "Table Pagination" })
        expect(paginationNav).toBeInTheDocument()
        const totalPageCountSpan = screen.getByRole("generic", { name: "Total Page Count" })
        expect(totalPageCountSpan).toHaveTextContent("0")
        const currentPageInput = screen.getByRole("spinbutton", { name: "Current Page Number" }) // refers to the input element (with restricted values)
        expect(currentPageInput).toHaveValue(1)
        // check pagination buttons
        const firstPageButton = screen.getByRole("button", { name: "First Page" })
        expect(firstPageButton).toBeDisabled()
        const previousPageButton = screen.getByRole("button", { name: "Previous Page" })
        expect(previousPageButton).toBeDisabled()
        const nextPageButton = screen.getByRole("button", { name: "Next Page" })
        expect(nextPageButton).toBeDisabled()
        const lastPageButton = screen.getByRole("button", { name: "Last Page" })
        expect(lastPageButton).toBeDisabled()
    })
    it("Checks render with data and user input", async () => {
        /*
            PROBLEM:
            we make use of `aria-label` to identify the table rows, but the
            `aria-label` is only for *interactive* elements so we can't use it
            on the table rows, which are not interactive
            SOLUTION:
            remove `aria-label` from the table rows, grab table rows differently.
        */
        const mockDIDMeta = fixtureDIDMetaViewModel()
        await act(async () => render(
            <ListDIDStory
                comdom={mockUseComDOM(Array.from({length: 100}, () => fixtureDIDViewModel()))}
                didMetaQuery={jest.fn(x => console.log(x))}
                didMetaQueryResponse={mockDIDMeta}
            />
        ))
        const tableRows = screen.getAllByRole("row", {selected: false})
        // check that metaview is still invisible
        const noDIDSelectedDiv = screen.getByText("No DID selected").closest("div")
        expect(noDIDSelectedDiv).toHaveClass("block")
        // click the first row
        fireEvent.click(tableRows[0])
        expect(noDIDSelectedDiv).not.toHaveClass("block")
        const metaDataDiv = screen.getByRole("generic", { name: "DID Metadata Quick Summary" })
        expect(metaDataDiv).toHaveClass("flex")
        const goDIDViewButton = screen.getByRole("generic", { name: "Go To DID Page" })
        expect(goDIDViewButton).toHaveClass("block")
        const didCreationRow = screen.getByRole("row", { name: "Date of DID Creation" })
        expect(didCreationRow).toHaveTextContent(format("yyyy-MM-dd", new Date(mockDIDMeta.created_at)))
        const didObsoleteRow = screen.getByRole("row", { name: "DID Obsolete" })
        expect(didObsoleteRow).toHaveTextContent(mockDIDMeta.obsolete ? "True" : "False")
    })
})