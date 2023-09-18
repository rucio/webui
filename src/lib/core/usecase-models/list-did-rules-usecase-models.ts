import { DIDRules } from "@/lib/infrastructure/data/view-model/page-did";
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";

export interface ListDIDRulesRequest {
    sessionAccount: string
    name: string;
    scope: string;
}


export interface ListDIDRulesResponse extends BaseResponseModel, DIDRules {
    subscription_id?: string; // used in post-processing pipeline element to fetch subscription details
    subscription_name?: string; // used in post-processing pipeline element to fetch subscription details
    subscription_account? : string // used in post-processing pipeline element to fetch subscription details
}


export interface ListDIDRulesError extends BaseErrorResponseModel {}