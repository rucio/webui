import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto'
import { DID, DIDMeta } from '@/lib/core/entity/rucio'

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
export interface DIDDTO extends DID, BaseDTO {
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
 * Data Transfer Object for DIDMeta Endpoint
 */
export interface DIDMetaDTO extends BaseDTO, DIDMeta {}
