import { RequestStats, RequestStatsPerPair } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface TransferStatsViewModel extends BaseViewModel, RequestStats {}
