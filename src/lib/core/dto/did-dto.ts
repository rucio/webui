import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto'
import { DID, DIDMeta } from '@/lib/core/entity/rucio'
import { DIDKeyValuePair, DIDRules } from '@/lib/infrastructure/data/view-model/page-did'

/**
 * Data Transfer Object for ListDIDsEndpoint
 */
export interface ListDIDDTO extends BaseStreamableDTO {}

/**
 * Represents the individual data items in the stream
 */
export type ListDIDsStreamData = string

/**
 * Data Transfer Object for GetDIDEndpoint
 */
export interface DIDExtendedDTO extends DID, BaseDTO {
    status: 'success' | 'error'
    errorMessage?: string
    account: string
    open: boolean
    monotonic: boolean
    expired_at: string
    bytes: number
    length: number
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
    data: DIDKeyValuePair[]
}

/**
 * Data Transfer Object for ListDIDRulesEndpoint 
 */
export interface ListDIDRulesDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for individual stream elements of ListDIDRulesEndpoint
 */
export interface DIDRulesDTO extends Omit<DIDRules, 'subscription'>, BaseDTO {
    subscription_id?: string
}

/**
 * Data Transfer Object for ListDIDRulesEndpoint 
 */
export interface ListDIDRulesDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for individual stream elements of ListDIDRulesEndpoint
 */
export interface DIDRulesDTO extends Omit<DIDRules, 'subscription'>, BaseDTO {
    subscription_id?: string
}