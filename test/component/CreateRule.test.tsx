/**
 * @jest-environment jsdom
 */

import { CreateRule } from "@/component-library/components/Pages/CreateRule/CreateRule";
import {
    CreateRuleQuery, DIDSearchQuery,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
    RSESearchQuery
} from '@/lib/infrastructure/data/view-model/createRule'
import { render, act, screen, cleanup, within, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation')

let user: any // user input
let F: any  // fixtures

const onSubmit = (query: CreateRuleQuery) => {
    return Promise.resolve({
        success: true,
    })
}

const didSearch = (query: DIDSearchQuery) => {
    return Promise.resolve({
        DIDList: [
            { DID: "First_DID", DIDType: "Dataset" as const },
            { DID: "Second_DID", DIDType: "Dataset" as const },
            { DID: "Third_DID", DIDType: "File" as const },
            { DID: query.DIDSearchString, DIDType: "Collection" as const } // just add the search string to the list
        ]
    })
}

const didValidation = (query: TypedDIDValidationQuery) => { 
    // if the DID contains the string "error", it will be added to the error list
    var localErrorDIDs: TypedDIDValidationResponse = { ErrorList: [] }
    query.DIDList.map((DID: string, index: number) => {
        if (DID.includes("error")) {
            localErrorDIDs.ErrorList.push({ DID: DID, ErrorCodes: [421], Message: "This DID is invalid" })
        }
    })
    // if the error list is empty, the promise will resolve, otherwise it will reject
    if (localErrorDIDs.ErrorList.length === 0) {
        return Promise.resolve(localErrorDIDs)
    }
    else {
        return Promise.reject(localErrorDIDs)
    }
}

const rseSearch = (query: RSESearchQuery) => {
    return Promise.resolve({
        RSEList: [
            { RSEName: query.RSEExpression, RSEID: "RSE0", RemainingQuota: 0, TotalQuota: 0},
            { RSEName: "RSE1", RSEID: "RSE1", RemainingQuota: 100, TotalQuota: 1000 },
            { RSEName: "RSE2", RSEID: "RSE2", RemainingQuota: 200, TotalQuota: 2000 },
            { RSEName: "RSE3", RSEID: "RSE3", RemainingQuota: 300, TotalQuota: 3000 },
            { RSEName: "RSE4", RSEID: "RSE4", RemainingQuota: 400, TotalQuota: 4000 },
            { RSEName: "RSE5", RSEID: "RSE5", RemainingQuota: 0, TotalQuota: 5000 },
            { RSEName: "RSE6", RSEID: "RSE6", RemainingQuota: 600, TotalQuota: 6000 },
            { RSEName: "RSE7", RSEID: "RSE7", RemainingQuota: 0, TotalQuota: 7000 },
            { RSEName: "RSE8", RSEID: "RSE8", RemainingQuota: 800, TotalQuota: 8000 },
            { RSEName: "RSE9", RSEID: "RSE9", RemainingQuota: 900, TotalQuota: 9000 },
            { RSEName: "RSE10", RSEID: "RSE10", RemainingQuota: 1000, TotalQuota: 10000 },
        ]
    })
}

describe("Login Page Test", () => {

    beforeEach(async () => {
        await act(async () => render(
            <CreateRule
                onSubmit={onSubmit}
                didSearch={didSearch}
                didValidation={didValidation}
                rseSearch={rseSearch}
            />
        ))
        F = {} as any
        F.root = within(screen.getByTestId("create-rule-root"))
        F.page0 = within(screen.getByTestId("rule-page-0"))
        F.page1 = within(screen.getByTestId("rule-page-1"))
        F.page2 = within(screen.getByTestId("rule-page-2"))
        F.page3 = within(screen.getByTestId("rule-page-3"))
        F.timeline = within(screen.getByTestId("timeline"))

        user = userEvent.setup()
    })


    afterEach(() => {
        cleanup()
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it("Checks initial render of CreateRule Page (Page 0)", async () => {


        // assert first DID step is blue in progressbar, second is gray
        expect(F.timeline.getByText("1").parentElement?.className).toContain("bg-blue-600")
        expect(F.timeline.getByText("2").parentElement?.className).toContain("bg-gray-100")


        // assert "Next" button is disabled
        const nextbutton = F.page0.getByRole("button", { name: /Next/ })
        expect(nextbutton).toBeDisabled()

        // assert "Search" button is enabled
        const searchbutton = F.page0.getByRole("button", { name: /Search/ })
        expect(searchbutton).toBeEnabled()

        // assert "DID Search Pattern" selected in tabs
        const tabslist = within(F.page0.getByTestId(/selectDIDMethod/))
        expect(tabslist.getByText(/DID Search Pattern/).className).toContain("text-blue-500")
        expect(tabslist.getByText(/List of DIDs/).className).toContain("text-gray-600")

        // assert "DID Search Pattern" input is empty and has placeholder
        expect(F.page0.getByLabelText(/DID Search Pattern/)).toHaveValue("")

        // assert table has no rows
        expect(F.page0.queryAllByRole("row")).toHaveLength(0)
    })

    it("Checks Quick Full Passthrough", async () => {
        // Grabbing elements
        const DIDName = "george"
        const RSENameTyped = "edward"
        const RSENamesChosen = ["RSE1", "RSE2", "RSE3"]

        const didSearchBox = F.page0.getByLabelText(/DID Search Pattern/)
        const searchbutton = F.page0.getByRole("button", { name: /Search/ })
        const nextbutton0 = F.page0.getByRole("button", { name: /Next/ })

        const rseSearchBox = F.page1.getByLabelText(/RSE Expression/)
        const nextbutton1 = F.page1.getByRole("button", { name: /Next/ })

        // const advancedbutton = F.page2.getByRole("button", { name: /Advanced/ })
        // const asynccheckbox = F.page2.getByRole("checkbox", { name: /Asynchronous/ })
        const nextbutton2 = F.page2.getByRole("button", { name: /Next/ })

        const prevbutton3 = F.page3.getByRole("button", { name: /Previous/ })


        // Page 0
        await user.type(didSearchBox, DIDName)

        await user.click(searchbutton)
        expect(F.page0.queryAllByRole("row")).toHaveLength(4)

        const didToClick = F.page0.getByText(DIDName).parentElement.parentElement
        expect(didToClick.className).toContain("hover:bg-gray-200")

        expect(nextbutton0).toBeDisabled()

        await user.click(didToClick)
        expect(didToClick.className).toContain("bg-blue-200")
        expect(nextbutton0).toBeEnabled()

        await user.click(nextbutton0)

        // Page 1
        expect(F.timeline.getByText("1").parentElement?.className).toContain("bg-green-600")
        expect(F.timeline.getByText("2").parentElement?.className).toContain("bg-blue-600")
        expect(F.timeline.getByText("3").parentElement?.className).toContain("bg-gray-100")
        expect(nextbutton1).toBeDisabled()

        // press enter this time in stead of clicking search
        await user.type(rseSearchBox, `${RSENameTyped}{Enter}`)
        
        const rseToHover = F.page1.getByText(RSENameTyped).parentElement.parentElement
        expect(rseToHover.className).toContain("hover:cursor-not-allowed")

        // iterate over all RSEs and click them
        for (let i = 0; i < RSENamesChosen.length; i++) {
            const rseToClick = F.page1.getByText(RSENamesChosen[i]).parentElement.parentElement
            expect(rseToClick.className).toContain("hover:bg-gray-200")
            await user.click(rseToClick)
            expect(rseToClick.className).toContain("bg-blue-200")
        }

        expect(nextbutton1).toBeEnabled()
        await user.click(nextbutton1)

        // Page 2
        expect(nextbutton2).toBeEnabled()
        await user.click(nextbutton2)

        // Page 3
        expect(prevbutton3).toBeEnabled()  // todo test the backwards jumping capability

        expect(F.page3.getByText(DIDName)).toBeInTheDocument()

        // iterate over all RSEs and check that they exist on the page
        for (let i = 0; i < RSENamesChosen.length; i++) {
            const rseToCheck = F.page3.getByText(RSENamesChosen[i])
            expect(rseToCheck).toBeInTheDocument()
        }

        // todo check all the options
    })
})