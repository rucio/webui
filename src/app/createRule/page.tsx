'use client';
import { CreateRule as CreateRuleStory } from "@/component-library/Pages/Rule/CreateRule";
import { RSEAccountUsageLimit } from "@/lib/core/entity/rucio";
import { DIDLong } from "@/lib/core/entity/rucio"
import {
    CreateRuleQuery,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
} from '@/lib/infrastructure/data/view-model/create-rule'
import { HTTPRequest } from "@/lib/sdk/http";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";

export default function CreateRule() {

    const onSubmit = (query: CreateRuleQuery) => {
        return Promise.resolve({
            success: true,
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


    const DIDSearchComDOM = useComDOM<DIDLong>(
        'create-rule-page-did-query',
        [],
        false,
        Infinity,
        50,
        true
    )

    const RSEComDOM = useComDOM<RSEAccountUsageLimit>(
        'create-rule-page-rse-query',
        [],
        false,
        Infinity,
        50,
        true
    )

    return (
        <CreateRuleStory
            onSubmit={onSubmit}
            didValidation={didValidation}
            didListComDOM={DIDSearchComDOM}
            rseListComDOM={RSEComDOM}
        />
    )
}