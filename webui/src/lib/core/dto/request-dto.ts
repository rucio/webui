import { BaseDTO } from '@/lib/sdk/dto';

export interface RequestDTO extends BaseDTO {
    data?: {
        source_rse_id: string;
        previous_attempt_id: string | null;
        started_at: string | null;
        staging_started_at: string | null;
        updated_at: string;
        attributes: {
            activity: string;
            source_replica_expression: string | null;
            lifetime: number | null;
            ds_scope: string | null;
            ds_name: string | null;
            bytes: number;
            md5: string;
            adler32: string;
            priority: number;
            allow_tape_source: boolean;
        };
        rule_id: string;
        transferred_at: string | null;
        staging_finished_at: string | null;
        request_type: string;
        state: string;
        activity: string;
        estimated_at: string | null;
        account: string;
        id: string;
        external_id: string;
        bytes: number;
        submitter_id: string | null;
        requested_at: string | null;
        scope: string;
        external_host: string;
        md5: string;
        last_processed_by: string | null;
        priority: number;
        name: string;
        retry_count: number;
        adler32: string;
        estimated_started_at: string | null;
        last_processed_at: string | null;
        did_type: string;
        err_msg: string | null;
        dest_url: string;
        estimated_transferred_at: string | null;
        transfertool: string;
        dest_rse_id: string;
        submitted_at: string;
        created_at: string;
        source_rse: string;
        dest_rse: string;
    };
}
