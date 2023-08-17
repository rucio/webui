import { DIDRulesViewModel } from "@/lib/infrastructure/data/view-model/did";
import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListDIDRulesResponse, ListDIDRulesRequest, ListDIDRulesError } from "../../usecase-models/list-did-rules-usecase-models";

/**
 * @interface ListDIDRrulesInputPort that abstracts the usecase.
 */
export interface ListDIDRulesInputPort extends BaseAuthenticatedInputPort<ListDIDRulesRequest> {}


/**
 * @interface ListDIDRulesOutputPort that abtrsacts the presenter
 */
export interface ListDIDRulesOutputPort extends BaseStreamingOutputPort<ListDIDRulesResponse, ListDIDRulesError, DIDRulesViewModel> {}
