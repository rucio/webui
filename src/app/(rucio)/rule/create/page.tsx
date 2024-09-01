'use client';
import { CreateRule as CreateRuleStory } from '@/component-library/Pages/Rule/CreateRule';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import {
    CreateRulesViewModel,
    generateEmptyCreateRulesViewModel,
    TypedDIDValidationQuery,
    TypedDIDValidationResponse,
} from '@/lib/infrastructure/data/view-model/create-rule';
import useComDOM from '@/lib/infrastructure/hooks/useComDOM';
import { RuleSummaryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BatchResponse } from '@/lib/infrastructure/web-worker/comdom-wrapper';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { useEffect, useState } from 'react';
import { AccountInfo } from '@/lib/core/entity/rucio';
import { generateEmptyAccountInfoViewModel } from '@/lib/infrastructure/data/view-model/account';
import { TCreateRuleFeatureRequestParams } from '@/pages/api/feature/create-rule';

export default function CreateRule() {
    const onSubmit = async (query: TCreateRuleFeatureRequestParams) => {
        let viewModel: CreateRulesViewModel = generateEmptyCreateRulesViewModel();
        viewModel.status = 'pending';

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/create-rule`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: JSON.stringify(query),
            });

            if (response.ok) {
                const data: CreateRulesViewModel = await response.json();
                viewModel = data;
            } else {
                throw new Error(`Error creating rule. HTTP Status Code: ${response.status}`);
            }
        } catch (error: any) {
            viewModel.status = 'error';
            viewModel.message = error.message;
        }

        return viewModel;
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

    const DIDSearchComDOM = useComDOM<ListDIDsViewModel>('create-rule-page-did-query', [], false, Infinity, 50, true);

    const processRSEAccountUsageLimitViewModelBatchResponse = (batch: BatchResponse<RSEAccountUsageLimitViewModel>) => {
        // The feature replaces Infinity with -1 for the bytes_limit and bytes_remaining fields
        // This is done because Infinity is not a valid JSON value
        // This code replaces -1 with Infinity for the bytes_limit and bytes_remaining fields
        batch.data.forEach((rseAccountUsageLimitViewModel: RSEAccountUsageLimitViewModel) => {
            if (rseAccountUsageLimitViewModel.status === 'success') {
                if (rseAccountUsageLimitViewModel.bytes_limit === -1) {
                    rseAccountUsageLimitViewModel.bytes_limit = Infinity;
                }
                if (rseAccountUsageLimitViewModel.bytes_remaining === -1) {
                    rseAccountUsageLimitViewModel.bytes_remaining = Infinity;
                }
            }
        });
        return batch;
    };

    const RSEComDOM = useComDOM<RSEAccountUsageLimitViewModel>(
        'create-rule-page-rse-query',
        [],
        false,
        Infinity,
        50,
        true,
        processRSEAccountUsageLimitViewModelBatchResponse,
    );

    const [accountInfo, setAccountInfo] = useState<AccountInfo>(generateEmptyAccountInfoViewModel());
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/account-info`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Error fetching account info. Are you logged in? HTTP Status Code: ${response.status}`);
                }
            })
            .then((data: AccountInfo) => {
                setAccountInfo(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <CreateRuleStory
            accountInfo={accountInfo}
            onSubmit={onSubmit}
            didValidation={didValidation}
            didListComDOM={DIDSearchComDOM}
            rseListComDOM={RSEComDOM}
        />
    );
}
