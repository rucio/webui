'use client';
import { CreateRule as CreateRuleStory } from "@/component-library/Pages/Rule/CreateRule";
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { DIDLongViewModel } from "@/lib/infrastructure/data/view-model/did";
import {
    TCreateRuleRequest,
    TFetchCreateRuleSummaryRequest,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
} from '@/lib/infrastructure/data/view-model/create-rule'
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { RuleSummaryViewModel } from "@/lib/infrastructure/data/view-model/rule";
import { BatchResponse } from "@/lib/infrastructure/web-worker/comdom-wrapper";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { useEffect, useState } from "react";
import { AccountInfo } from "@/lib/core/entity/rucio";

export default function CreateRule() {

    const [accountInfo, setAccountInfo] = useState<AccountInfo>()

    const onSubmit = (query: TCreateRuleRequest) => {
        return Promise.resolve({
            success: true,
        })
    }

    const fetchSummary = (
        query: TFetchCreateRuleSummaryRequest,
        setSummaryViewModel: (viewModel: RuleSummaryViewModel) => void,
        setActivePage: (int: number) => void,
        setError: (error: string) => void,
        ) => {
        const url: URL = new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/create-rule-summary`)
        fetch(url.toString(), {
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json'
            } as HeadersInit),
            body: JSON.stringify(query)
        }).then((response) => {
            if(response.ok) {
                return response.json()
            } else {
                setError(`Error fetching summary. HTTP Status Code: ${response.status}`)
            }
        }).then((data: RuleSummaryViewModel) => {
            setSummaryViewModel(data)
            setActivePage(3)
        }).catch((error) => {
            setError(`Error fetching summary. Error: ${error}`)
        })
        return query
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


    const DIDSearchComDOM = useComDOM<ListDIDsViewModel>(
        'create-rule-page-did-query',
        [],
        false,
        Infinity,
        50,
        true
    )

    const processRSEAccountUsageLimitViewModelBatchResponse = (batch: BatchResponse<RSEAccountUsageLimitViewModel>) => {
        batch.data.forEach((rseAccountUsageLimitViewModel: RSEAccountUsageLimitViewModel) => {
            if(rseAccountUsageLimitViewModel.status === 'success') {
                if(rseAccountUsageLimitViewModel.bytes_limit === -1) {
                    rseAccountUsageLimitViewModel.bytes_limit = Infinity
                }
            }
        })
        return batch
    }

    const RSEComDOM = useComDOM<RSEAccountUsageLimitViewModel>(
        'create-rule-page-rse-query',
        [],
        false,
        Infinity,
        50,
        true,
        processRSEAccountUsageLimitViewModelBatchResponse
    )

    useEffect(() => {
    })
    return (
        <CreateRuleStory
            accountInfo={accountInfo}
            onSubmit={onSubmit}
            fetchSummary={fetchSummary}
            didValidation={didValidation}
            didListComDOM={DIDSearchComDOM}
            rseListComDOM={RSEComDOM}
        />
    )
}