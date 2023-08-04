import { StoryFn, Meta } from '@storybook/react'
import { fixtureDIDLongViewModel, fixtureRSEAccountUsageLimitViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures'

import { CreateRule as CR } from './CreateRule'
import {
    CreateRuleQuery,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
} from '@/lib/infrastructure/data/view-model/create-rule'

export default {
    title: 'Components/Pages/Rule',
    component: CR,
} as Meta<typeof CR>

const Template: StoryFn<typeof CR> = args => <CR {...args} />

export const CreateRule = Template.bind({})
CreateRule.args = {
    onSubmit: (query: CreateRuleQuery) => {
        return Promise.resolve({
            success: true,
        })
    },
    didListComDOM: mockUseComDOM(Array.from({ length: 100 }, () => fixtureDIDLongViewModel())),
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
