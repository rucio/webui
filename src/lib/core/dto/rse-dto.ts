import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { RSE, RSEAttribute, RSEDetails, RSEProtocol, RSEType } from '@/lib/core/entity/rucio';
import { undefined } from 'zod';

/**
 * The Data Transfer Object for the ListRSEsEndpoint which contains the stream
 */
export interface ListRSEsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET RSE Endpoint
 */
export interface RSEDetailsDTO extends BaseDTO, RSEDetails {}

export const getEmptyRSEDetailsDTO = (): RSEDetailsDTO => {
    return {
        availability_delete: false,
        availability_read: false,
        availability_write: false,
        deterministic: false,
        id: '',
        name: '',
        protocols: [],
        rse_type: RSEType.UNKNOWN,
        staging_area: false,
        status: 'error',
        volatile: false,
    };
};

/**
 * Data Transfer Object for GET RSE Protocols Endpoint
 */
export interface RSEProtocolDTO extends BaseDTO {
    protocols: RSEProtocol[];
}

/**
 * Data Transfer Object for GET RSE Attributes Endpoint
 */
export interface RSEAttributeDTO extends BaseDTO {
    attributes: RSEAttribute[];
}

export interface RSEUsageDTO extends BaseDTO {
    rse_id: string;
    rse: string;
    source: string;
    used: number;
    total: number;
    files: number;
    updated_at: string;
}
