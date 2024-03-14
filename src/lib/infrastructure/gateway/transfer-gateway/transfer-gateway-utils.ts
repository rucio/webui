import { TransferDTO, TransferStatisticsDTO } from "@/lib/core/dto/transfer-dto";
import { DIDType, RequestState, RequestType } from "@/lib/core/entity/rucio";
import { tSConstructSignatureDeclaration } from "@babel/types";

/**
 * Represents the data returned by Rucio Server for a TransferStatistics.
 */
export type TRucioTransferStatistics = {
    source_rse: string;
    dest_rse: string;
    source_rse_id: string;
    dest_rse_id: string;
    account: string;
    activity: string;
    state: string;
    counter: number;
    bytes: number;
}

export type TRucioTransfer = {
    id: string;
    request_type: string;
    scope: string,
    name: string;
    did_type: string;
    dest_rse_id: string;
    source_rse_id: string;
    attributes: string;
    state: string;
    external_id: string;
    retry_count: number;
    err_msg: string;
    previous_attempt_id: string;
    rule_id: string;
    activity: string;
    bytes: number;
    md5: string;
    adler32: string;
    dest_url: string;
    submitted_at: string;
    started_at: string;
    transferred_at: string;
    estimated_at: string;
    submitted_id: string;
    estimated_stated_at: string;
    estimated_transferred_at: string;
    staging_started_at: string;
    staging_finished_at: string;
    account: string;
    requested_at: string;
    priority: number;
    transfertool: string;
    source_rse: string;
    dest_rse: string;
}

/**
 * @param ts The TransferStatistics of type {@link TRucioTransferStatistics}
 */
export function convertToTransferStatistics(ts: TRucioTransferStatistics): TransferStatisticsDTO {
    const dto: TransferStatisticsDTO = {
        status: 'success',
        account: ts.account,
        source_rse: ts.source_rse,
        dest_rse: ts.dest_rse,
        source_rse_id: ts.source_rse_id,
        dest_rse_id: ts.dest_rse_id,
        state: <RequestState>(ts.state),
        activity: ts.activity,
        counter: ts.counter,
        bytes: ts.bytes,
    }
    return dto
}

/**
 * @param t The Transfer of type {@link TRucioTransfer}
 */
export function convertToTransfer(t: TRucioTransfer): TransferDTO {
    const dto: TransferDTO = {
        status: 'success',
        id: t.id,
        request_type: <RequestType>(t.request_type),
        scope: t.scope,
        name: t.name,
        did_type: <DIDType>(t.did_type),
        state: <RequestState>(t.state),
        account: t.account,
        source_rse: t.source_rse,
        dest_rse: t.dest_rse,
        source_rse_id: t.source_rse_id,
        dest_rse_id: t.dest_rse_id,
        attributes: t.attributes,
        activity: t.activity,
        bytes: t.bytes,
        requested_at: t.requested_at,
        priority: t.priority,
        transfertool: t.transfertool,
    }
    return dto
}