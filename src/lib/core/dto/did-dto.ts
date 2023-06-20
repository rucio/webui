import { BaseStreamableDTO } from '@/lib/common/base-components/dto'
import { DID } from '@/lib/core/entity/rucio'
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
    account: string
    open: boolean
    monotonic: boolean
    expired_at: string
    bytes: number
    length: number
}
