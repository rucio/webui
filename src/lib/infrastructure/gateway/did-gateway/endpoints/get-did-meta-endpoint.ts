import { HTTPRequest } from "@/lib/sdk/http";
import { DIDMetaDTO } from "@/lib/core/dto/did-dto";
import { DIDAvailability, DIDType } from "@/lib/core/entity/rucio";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { Response } from "node-fetch";

export default class GetDIDMetaEndpoint extends BaseEndpoint<DIDMetaDTO> {
    constructor(
        private rucioAuthToken: string,
        private scope: string,
        private name: string,
    ) {
        super()
    }

    async initialize(): Promise<void> {
        await super.initialize()
        this.url = `${this.rucioHost}/dids/${this.scope}/${this.name}/meta`
        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }
    
    reportErrors(statusCode: number, response: Response): Promise<DIDMetaDTO | undefined> {
        return Promise.resolve(undefined);
    }
    
    
    createDTO(data: any): DIDMetaDTO {
        data = data as {
            scope: string;
            name: string;
            account: string;
            did_type: string;
            is_open: boolean;
            monotonic: boolean;
            hidden: boolean;
            obsolete: boolean;
            complete: null | any;
            is_new: boolean;
            availability: string;
            suppressed: boolean;
            bytes: null | number;
            length: null | number;
            md5: null | string;
            adler32: null | string;
            expired_at: null | string;
            purge_replicas: boolean;
            deleted_at: null | string;
            events: null | any;
            guid: null | string;
            project: null | any;
            datatype: null | any;
            run_number: null | any;
            stream_name: null | any;
            prod_step: null | any;
            version: null | any;
            campaign: null | any;
            task_id: null | any;
            panda_id: null | any;
            lumiblocknr: null | any;
            provenance: null | any;
            phys_group: null | any;
            transient: boolean;
            accessed_at: null | any;
            closed_at: null | any;
            eol_at: null | any;
            is_archive: null | any;
            constituent: null | any;
            access_cnt: null | any;
            created_at: string;
            updated_at: string;
        }

        let didType: DIDType = DIDType.UNKNOWN
        switch (data.did_type.toLowerCase()) {
            case 'collection':
                didType = DIDType.COLLECTION
                break;
            case 'container':
                didType = DIDType.CONTAINER
                break;
            case 'dataset':
                didType = DIDType.DATASET
                break;
            case 'file':
                didType = DIDType.FILE
                break;
            case 'all':
                didType = DIDType.ALL
                break;
            default:
                didType = DIDType.UNKNOWN
                break;
        }

        let didAvailability: DIDAvailability = DIDAvailability.UNKNOWN
        switch (data.availability.toLowerCase()) {
            case 'available':
                didAvailability = DIDAvailability.AVAILABLE
                break;
            case 'deleted':
                didAvailability = DIDAvailability.DELETED
                break;
            case 'lost':
                didAvailability = DIDAvailability.LOST
                break;
            default:
                didAvailability = DIDAvailability.UNKNOWN
                break;
        }
        
        const dto: DIDMetaDTO = {
            status: 'success',
            name: data.name,
            scope: data.scope,
            account: data.account,
            did_type: didType,
            created_at: data.created_at,
            updated_at: data.updated_at,
            availability: didAvailability,
            obsolete: data.obsolete,
            hidden: data.hidden,
            suppressed: data.suppressed,
            purge_replicas: data.purge_replicas,
            monotonic: data.monotonic,
            // only for collections
            is_open: data.is_open,
            // only for files
            adler32: data.adler32,
            md5: data.md5,
            guid: data.guid,
            bytes: data.bytes,
        }
        return dto
    }
    
}