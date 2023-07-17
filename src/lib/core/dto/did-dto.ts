import { BaseDTO, BaseHttpErrorTypes, BaseStreamableDTO } from '@/lib/sdk/dto'
import { DID, DIDMeta } from '@/lib/core/entity/rucio'
/**
 * Data Transfer Object for ListDIDsEndpoint
 */
export interface ListDIDDTO extends BaseStreamableDTO {
    error?:
        | 'Invalid Auth Token'
        | 'Invalid key in filter'
        | 'Not acceptable'
        | 'Wrong did type'
        | 'Unknown Error'
}

/**
 * Represents the individual data items in the stream
 */
export type ListDIDsStreamData = string

/**
 * Data Transfer Object for GetDIDEndpoint
 */
export interface DIDDTO extends DID {
    status: 'success' | 'error'
    error:
        | 'Invalid Auth Token'
        | 'Data Identifier Not Found'
        | 'Invalid Parameters'
        | 'Scope Not Found'
        | 'Unknown Error'
        | null
    message?: string
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
