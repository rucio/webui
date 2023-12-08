import { TCreateRuleRequest, TypedDIDValidationQuery, TypedDIDValidationResponse } from "@/lib/infrastructure/data/view-model/create-rule";
import { Meta, StoryObj } from "@storybook/react";
import { fixtureDIDLongViewModel, fixtureListDIDViewModel, fixtureRSEAccountUsageLimitViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { CreateRule  as CR} from "../Pages/Rule/CreateRule.stories";

export default {
    title: 'Demos/03_CreateRule',
    component: CR,
} as Meta<typeof CR>;

type Story  = StoryObj<typeof CR>

export const CreateRule: Story = {
    args: {
        onSubmit: (query: TCreateRuleRequest) => {
            return Promise.resolve({
                success: true,
            })
        },
        didListComDOM: mockUseComDOM(Array.from({ length: 100 }, () => fixtureListDIDViewModel())),
        didValidation: (query: TypedDIDValidationQuery) => {
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
        },
        rseListComDOM: mockUseComDOM(Array.from({ length: 100 }, () => fixtureRSEAccountUsageLimitViewModel())),
    
    }
}

