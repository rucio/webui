import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { DID, DIDKeyValuePair, DIDMeta, DIDRules, DIDShort } from '@/lib/core/entity/rucio';

/**
 * Data Transfer Object for ListDIDsEndpoint
 */
export interface ListDIDDTO extends BaseStreamableDTO {}

/**
 * Represents the individual data items in the stream of ListDIDsEndpoint
 */
export interface DIDShortDTO extends DIDShort, BaseDTO {}

/**
 * Data Transfer Object for GetDIDEndpoint
 */
export interface DIDExtendedDTO extends DID, BaseDTO {
    status: 'success' | 'error';
    errorMessage?: string;
    account: string;
    open: boolean;
    monotonic: boolean;
    expired_at: string;
    bytes: number;
    length: number;
}

/**
 * Data Transfer Object for ListDIDParentsEndpoint
 * Represents the parent of a DID
 */
export interface DIDDTO extends DID, BaseDTO {}

/**
 * Data Transfer Object for DIDMeta Endpoint
 */
export interface DIDMetaDTO extends BaseDTO, DIDMeta {}

/**
 * Data Transfer Object for DIDKeyValuePairs Endpoint
 */
export interface DIDKeyValuePairsDTO extends BaseDTO {
    data: DIDKeyValuePair[];
}

/**
 * Data Transfer Object for ListDIDRulesEndpoint
 */
export interface ListDIDRulesDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for individual stream elements of ListDIDRulesEndpoint
 */
export interface DIDRulesDTO extends Omit<DIDRules, 'subscription'>, BaseDTO {
    subscription_id?: string;
}

/**
 * Data Transfer Object for ListDIDRulesEndpoint
 */
export interface ListDIDRulesDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for individual stream elements of ListDIDRulesEndpoint
 */
export interface DIDRulesDTO extends Omit<DIDRules, 'subscription'>, BaseDTO {
    subscription_id?: string;
}

/**
 * Data Transfer Object for CreateDidSampleEndpoint
 */
export interface CreateDIDSampleDTO extends BaseDTO {
    created: boolean;
}

/**
 * Data Transfer Object for AddDIDEndpoint
 */
export interface AddDIDDTO extends BaseDTO {
    created: boolean;
}

/**
 * Data Transfer Object for AttachDIDEndpoint
 */
export interface AttachDIDDTO extends BaseDTO {
    created: boolean;
}

/**
 * Data Transfer Object for SetDIDStatus (open/closed) endpoint
 */
export interface SetDIDStatusDTO extends BaseDTO {
    scope: string;
    name: string;
    open: boolean;
}
