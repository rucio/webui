import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { DIDType, Request, RequestState, RequestStats, RequestType } from "../entity/rucio";

/**
 * The Data Transfer Object for the ListTransferStatistics which contains the stream
 */
export interface ListTransferStatisticsDTO extends BaseStreamableDTO {}

/**
 * The Data Transfer Object for the Statistics of a single Transfer Group
 */
export interface TransferStatisticsDTO extends BaseDTO, RequestStats {}

/**
 * The Data Transfer Object for the ListTransfer which contains the stream
 */
export interface ListTransfersDTO extends BaseStreamableDTO {}

/**
 * The Data Transfer Object for a single Transfer
 */
export interface TransferDTO extends BaseDTO, Request {}

export function getEmptyTransferStatsDTO(): TransferStatisticsDTO {
    return {
        status: 'error',
        account: '',
        source_rse: '',
        dest_rse: '',
        source_rse_id: '',
        dest_rse_id: '',
        state: RequestState.FAILED,
        activity: '',
        counter: 0,
        bytes: 0,
    }
}

export function getEmptyTransferDTO(): TransferDTO {
    return {
        status: 'error',
        id: '',
        account: '',
        request_type: RequestType.TRANSFER,
        scope: '',
        name: '',
        did_type: DIDType.UNKNOWN,
        source_rse_id: '',
        dest_rse_id: '',
        source_rse: '',
        dest_rse: '',
        state: RequestState.FAILED,
        activity: '',
        attributes: '',
        priority: 0,
        bytes: 0,
        requested_at: '',
        transfertool: '',
    }
}