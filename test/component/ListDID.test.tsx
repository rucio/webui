/**
 * @jest-environment jsdom
 */

import { render, act, screen, cleanup, fireEvent } from "@testing-library/react";
import { ListDID as ListDIDStory } from "@/component-library/components/Pages/ListDID/ListDID";
import { DIDMeta } from "@/lib/core/entity/rucio";
var format = require("date-format")

describe("ListDID Story Test", () => {
    it("Checks empty render of the story", async () => {
        await act(async () => render(
            <ListDIDStory
                didSearch={jest.fn(x => console.log(x))}
                didResponse={{ data: [], fetchStatus: "idle" }}
                didMetaQuery={jest.fn(x => console.log(x))}
                didMetaQueryResponse={{} as DIDMeta}
            />
        ))
        // check if DID Search Pattern Input exists
        const searchPatternInput = screen.getByLabelText("DID Search Pattern")
        expect(searchPatternInput).toHaveValue("")
        // check if query is set to Containers and Datasets
        const containersButton = screen.getByLabelText("Containers")
        const filesButton = screen.getByLabelText("Files (Warning: large query)")
        expect(containersButton).toBeChecked()
        expect(filesButton).not.toBeChecked()
        // Check that `No DID selected` is shown instead of the DIDMetaView, etc
        const noDIDSelectedDiv = screen.getByText("No DID selected").closest("div")
        expect(noDIDSelectedDiv).toHaveClass("block")
        const goDIDViewButton = screen.getByText("Go To DID Page").closest("button")
        expect(goDIDViewButton?.parentElement).toHaveClass("hidden")
        // Check that the DID Table Search is empty
        const didFilterInputs = screen.getAllByPlaceholderText("Filter Results")
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
        const mockDIDMeta = {
            "name": "dataset-YSytZjXJMdiCsSiiUwXx",
            "scope": "Lawrence.Myers",
            "account": "Lawrence_Myers",
            "did_type": "Dataset",
            "created_at": new Date(2021, 3),
            "updated_at": new Date(2022, 10),
            "availability": "Deleted",
            "obsolete": false,
            "hidden": true,
            "suppressed": true,
            "purge_replicas": true,
            "monotonic": true,
            "is_open": true,
            "adler32": null,
            "guid": null,
            "md5": null,
            "filesize": null
        } as DIDMeta
        await act(async () => render(
            <ListDIDStory
                didSearch={jest.fn(x => console.log(x))}
                didResponse={{
                    data: [
                        { "scope": "user.LindaMiller", "name": "dataset-ojTcChlQGtvpWBAnUcNn", "did_type": "Container", "bytes": 57855156, "length": 35878152 },
                        { "scope": "user.TravisRoberts", "name": "file-DfIbGGDiGWyJhrvRYwtw", "did_type": "Container", "bytes": 42245800, "length": 45289199 },
                        { "scope": "user.DonnaBennett", "name": "dataset-RiwBaeaxTMYxOHEzAgdG", "did_type": "Container", "bytes": 51337255, "length": 87665604 },
                        { "scope": "user.DonnaFrazier", "name": "container-gkcouVjJHfbirKsFeruw", "did_type": "File", "bytes": 10559288, "length": 94198083 },
                        { "scope": "user.NatashaBaker", "name": "dataset-BFesxCNVirxzoXAZZfIo", "did_type": "File", "bytes": 53858564, "length": 53898582 },
                    ], fetchStatus: "idle"
                }}
                didMetaQuery={jest.fn(x => console.log(x))}
                didMetaQueryResponse={mockDIDMeta}
            />
        ))
        const tableRows = screen.getAllByRole("row", { name: "DID Table Row" })
        expect(tableRows).toHaveLength(5)
        expect(tableRows[0]).toBeInTheDocument()
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
        expect(didCreationRow).toHaveTextContent(format("yyyy-MM-dd", mockDIDMeta.created_at))
        const didObsoleteRow = screen.getByRole("row", { name: "DID Obsolete" })
        expect(didObsoleteRow).toHaveTextContent(mockDIDMeta.obsolete ? "True" : "False")
    })
})