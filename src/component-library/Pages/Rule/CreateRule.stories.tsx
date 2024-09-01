import { StoryFn, Meta } from '@storybook/react';
import {
    fixtureListDIDViewModel as fixtureListDIDsViewModel,
    fixtureRSEAccountUsageLimitViewModel,
    mockUseComDOM,
} from 'test/fixtures/table-fixtures';

import { CreateRule as CR } from './CreateRule';
import { CreateRulesViewModel, TypedDIDValidationQuery, TypedDIDValidationResponse } from '@/lib/infrastructure/data/view-model/create-rule';
import { TCreateRuleFeatureRequestParams } from '@/pages/api/feature/create-rule';

export default {
    title: 'Components/Pages/Rule',
    component: CR,
} as Meta<typeof CR>;

const Template: StoryFn<typeof CR> = args => <CR {...args} />;

export const CreateRule = Template.bind({});
CreateRule.args = {
    onSubmit: (query: TCreateRuleFeatureRequestParams): Promise<CreateRulesViewModel> => {
        return Promise.resolve({
            status: 'success',
            rules: [
                {
                    RuleID: '123123143243',
                    DID: 'scope:dataset1',
                },
                {
                    RuleID: '127849dsgs',
                    DID: 'scope:dataset2',
                },
            ],
        });
    },
    didListComDOM: mockUseComDOM(Array.from({ length: 100 }, () => fixtureListDIDsViewModel())),
    didValidation: (query: TypedDIDValidationQuery) => {
        // if the DID contains the string "error", it will be added to the error list
        var localErrorDIDs: TypedDIDValidationResponse = { ErrorList: [] };
        query.DIDList.map((DID: string, index: number) => {
            if (DID.includes('error')) {
                localErrorDIDs.ErrorList.push({ DID: DID, ErrorCodes: [421], Message: 'This DID is invalid' });
            }
        });
        // if the error list is empty, the promise will resolve, otherwise it will reject
        if (localErrorDIDs.ErrorList.length === 0) {
            return Promise.resolve(localErrorDIDs);
        } else {
            return Promise.reject(localErrorDIDs);
        }
    },
    rseListComDOM: mockUseComDOM(Array.from({ length: 100 }, () => fixtureRSEAccountUsageLimitViewModel())),
};
