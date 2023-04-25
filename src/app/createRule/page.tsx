'use client';
import { CreateRule as CreateRuleStory } from "@/component-library/components/Pages/CreateRule/CreateRule";
import { DIDDTO, RSEAccountUsageLimitDTO } from "@/lib/core/data/rucio-dto";
import {
    CreateRuleQuery, DIDSearchQuery,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
    RSESearchQuery
} from '@/lib/infrastructure/data/view-model/createRule'
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


    const DIDSearchComDOM = useComDOM<DIDDTO>(
        'http://localhost:3000/api/listdids',
        [],
        false,
        Infinity,
        200,
        true
    )

    const RSEComDOM = useComDOM<RSEAccountUsageLimitDTO>(
        'http://localhost:3000/api/rseaccountusage',
        [],
        false,
        Infinity,
        200,
        true
    )


    return (
        <CreateRuleStory
            onSubmit={onSubmit}
            didSearch={async (didSearchQuery: DIDSearchQuery) => await DIDSearchComDOM.start()}
            didResponse={
                {
                    data: DIDSearchComDOM.query.data,
                    fetchStatus: DIDSearchComDOM.query.fetchStatus
                }
            }
            didValidation={didValidation}
            rseSearch={async (rseSearchQuery: RSESearchQuery) => await RSEComDOM.start()}
            rseResponse={{
                data: RSEComDOM.query.data,
                fetchStatus: RSEComDOM.query.fetchStatus
            }}
        />
    )
}