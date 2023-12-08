import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { DID, DIDLong } from "../entity/rucio";

export interface TCreateRuleWithSamplesSummaryRequest {
    withSamples: true;
    sampleFileCount: number;
}

export interface TCreateRuleWithoutSamplesSummaryRequest {
    withSamples: false;
}

export type CreateRuleSummaryRequest = {
    selectedDIDs: DIDLong[]
    selectedRSEs: RSEAccountUsageLimitViewModel[];
    askApproval: boolean;
    account: string;
    copies: number; // number of copies vs sample file count?
} & (TCreateRuleWithSamplesSummaryRequest | TCreateRuleWithoutSamplesSummaryRequest);

export interface CreateRuleSummaryResponse extends BaseResponseModel {
    // dids: DIDSummary[];
    // rses: RSESummary[];
    // messages: string[]; 
}

export interface CreateRuleSummaryError extends BaseErrorResponseModel {}