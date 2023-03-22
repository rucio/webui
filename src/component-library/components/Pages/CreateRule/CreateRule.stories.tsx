import { OIDCProvider, VO } from '@/lib/core/entity/auth-models'
import { StoryFn, Meta } from '@storybook/react'

import { CreateRule } from './CreateRule'
import {
    CreateRuleQuery, DIDSearchQuery,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
    RSESearchQuery
} from '@/lib/infrastructure/data/view-model/createRule'

export default {
    title: 'Components/Pages/CreateRule',
    component: CreateRule,
} as Meta<typeof CreateRule>

const Template: StoryFn<typeof CreateRule> = args => <CreateRule {...args} />

export const CreateRulePage = Template.bind({})
CreateRulePage.args = {
    onSubmit: (query: CreateRuleQuery) => {
        return Promise.resolve({
            success: true,
        })
    },
    didSearch: (query: DIDSearchQuery) => {
        return Promise.resolve({
            DIDList: [
                { DID: "First_DID", DIDType: "Dataset" },
                { DID: "Second_DID", DIDType: "Dataset" },
                { DID: "Third_DID", DIDType: "File" },
                { DID: query.DIDSearchString, DIDType: "Collection" } // just add the search string to the list
            ]

        })
    },
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
    rseSearch: (query: RSESearchQuery) => {
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
    },
}
