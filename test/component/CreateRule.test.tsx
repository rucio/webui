/**
 * @jest-environment jsdom
 */

import { CreateRule } from '@/component-library/Pages/Rule/CreateRule';
import {
    DIDSearchQuery,
    TypedDIDValidationQuery,
    TypedDIDValidationResponse,
    RSESearchQuery,
    CreateRulesViewModel,
} from '@/lib/infrastructure/data/view-model/create-rule';
import { TCreateRuleFeatureRequestParams } from '@/pages/api/feature/create-rule';
import { render, act, screen, cleanup, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation');

let user: any; // user input
let F: any; // fixtures

const onSubmit = (query: TCreateRuleFeatureRequestParams): Promise<CreateRulesViewModel> => {
    return Promise.resolve({
        status: 'success',
        rules: [],
    });
};

const didSearch = (query: DIDSearchQuery) => {
    return Promise.resolve({
        DIDList: [
            { DID: 'First_DID', DIDType: 'Dataset' as const },
            { DID: 'Second_DID', DIDType: 'Dataset' as const },
            { DID: 'Third_DID', DIDType: 'File' as const },
            { DID: query.DIDSearchString, DIDType: 'Collection' as const }, // just add the search string to the list
        ],
    });
};

const didValidation = (query: TypedDIDValidationQuery) => {
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
};

const rseSearch = (query: RSESearchQuery) => {
    return Promise.resolve({
        RSEList: [
            { RSEName: query.RSEExpression, RSEID: 'RSE0', RemainingQuota: 0, TotalQuota: 0 },
            { RSEName: 'RSE1', RSEID: 'RSE1', RemainingQuota: 100, TotalQuota: 1000 },
            { RSEName: 'RSE2', RSEID: 'RSE2', RemainingQuota: 200, TotalQuota: 2000 },
            { RSEName: 'RSE3', RSEID: 'RSE3', RemainingQuota: 300, TotalQuota: 3000 },
            { RSEName: 'RSE4', RSEID: 'RSE4', RemainingQuota: 400, TotalQuota: 4000 },
            { RSEName: 'RSE5', RSEID: 'RSE5', RemainingQuota: 0, TotalQuota: 5000 },
            { RSEName: 'RSE6', RSEID: 'RSE6', RemainingQuota: 600, TotalQuota: 6000 },
            { RSEName: 'RSE7', RSEID: 'RSE7', RemainingQuota: 0, TotalQuota: 7000 },
            { RSEName: 'RSE8', RSEID: 'RSE8', RemainingQuota: 800, TotalQuota: 8000 },
            { RSEName: 'RSE9', RSEID: 'RSE9', RemainingQuota: 900, TotalQuota: 9000 },
            { RSEName: 'RSE10', RSEID: 'RSE10', RemainingQuota: 1000, TotalQuota: 10000 },
        ],
    });
};

describe('CreateRule Test', () => {
    it('test will always pass', () => {
        expect(true).toBe(true);
    });
});
