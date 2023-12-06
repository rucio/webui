import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { DID } from "../entity/rucio";
import { TRSESummaryRow } from "../entity/rule-summary";

export interface TCreateRuleWithSamplesSummaryRequest {
    withSamples: true;
    account: string;
    sampleFileCount: number;
    scope: string;
    selectedDIDs: DID[];
    copies: number;

}

export interface TCreateRuleWithoutSamplesSummaryRequest {
    withSamples: false;
    account: string;
    selectedDIDs: DID[];
    copies: number;
}

export type CreateRuleSummaryRequest = {
    summarySelectedRSEs: TRSESummaryRow[];
    askApproval: boolean;
} & (TCreateRuleWithSamplesSummaryRequest | TCreateRuleWithoutSamplesSummaryRequest);

type DIDSummary = {

}

type RSESummary = {

}

export interface CreateRuleSummaryResponse extends BaseResponseModel {
    dids: DIDSummary[];
    rses: RSESummary[];
    messages: string[]; 
}

export interface CreateRuleSummaryError extends BaseErrorResponseModel {}