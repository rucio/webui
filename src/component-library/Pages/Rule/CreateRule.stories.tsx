import { StoryFn, Meta } from '@storybook/react'
import { fixtureDIDLongViewModel, fixtureRSEAccountUsageLimitViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures'

import { CreateRule as CR } from './CreateRule'
import {
    TCreateRuleRequest,
    TFetchCreateRuleSummaryRequest,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
} from '@/lib/infrastructure/data/view-model/create-rule'
import { RuleSummaryViewModel } from '@/lib/infrastructure/data/view-model/rule'

export default {
    title: 'Components/Pages/Rule',
    component: CR,
} as Meta<typeof CR>

const Template: StoryFn<typeof CR> = args => <CR {...args} />

export const CreateRule = Template.bind({})
CreateRule.args = {
    onSubmit: (query: TCreateRuleRequest) => {
        return Promise.resolve({
            success: true,
        })
    },
    fetchSummary: (
        query: TFetchCreateRuleSummaryRequest, 
        setSummaryViewModel: (viewModel: RuleSummaryViewModel) => void, 
        setActivePage: (int: number) => void,
        setError: (error: string) => void,
    ) => {
        setSummaryViewModel({
            ...query,
            status: 'success',
            DIDList: query.DIDViewModels.map((did) => `${did.scope}:${did.name}`),
            RSEList: query.RSEViewModels.map((rse) => rse.rse),
        })
        setActivePage(3)
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

