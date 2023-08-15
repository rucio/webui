import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListAccountRSEUsageError, ListAccountRSEUsageRequest, ListAccountRSEUsageResponse } from "../../usecase-models/list-account-rse-usage-usecase-models";

/**
 * @interface ListAccountRSEUsageInputPort represents the ListAccountRSEUsage usecase.
 */
export interface ListAccountRSEUsageInputPort extends BaseAuthenticatedInputPort<ListAccountRSEUsageRequest> {}

/**
 * @interface ListAccountRSEUsageOutputPort represents the ListAccountRSEUsage streamable presenter.
 */
export interface ListAccountRSEUsageOutputPort extends BaseStreamingOutputPort<ListAccountRSEUsageResponse, ListAccountRSEUsageError, RSEAccountUsageLimitViewModel>{}