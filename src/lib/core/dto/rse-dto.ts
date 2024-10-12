import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { RSE, RSEAttribute, RSEDetails, RSEProtocol, RSEType } from '@/lib/core/entity/rucio';

/**
 * The Data Transfer Object for the ListRSEsEndpoint which contains the stream
 */
export interface ListRSEsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET RSE Endpoint
 */
export interface RSEDetailsDTO extends BaseDTO, RSEDetails {}

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
