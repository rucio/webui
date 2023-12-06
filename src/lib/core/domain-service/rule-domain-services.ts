import { BytesToStringifiedJSONTransform } from "@/lib/sdk/stream-transformers";
import { DID, DIDLong, DIDType } from "../entity/rucio";

/**
 * @interface TDIDSummaryRow represents the DID Summary Row for DID Summary Table used to Create New Rules.
 * The bytes and requested_bytes are -1 if the DID is a derived DID, as these values cannot be determined during summary generation.
 * @property copies - The number of replicas of the DID to be created
 * @property requested_bytes - The requested size on any RSE where the rule is to be created
 */
export type TDIDSummaryRow = DIDLong & {
    copies: number;
    requested_bytes: number | 'cannot be determined as DID has not been sampled';
}

/**
 * Creates a DID Summary Row for the DID Summary Table used to Create New Rules. bytes and requested_bytes are set to -1 if the DID is a derived DID.
 * @param did The DID on which the rule is to be created
 * @param copies The number of replicas of the DID to be created
 * @param files The length of the DID
 * @param size The size of the DID
 * @param requested_size The requested size on any RSE where the rule is to be created
 * @returns A DID Summary Row for the DID Summary Table used to Create New Rules.
 */
export const createDIDSummaryRow = (did: DIDLong, copies: number): TDIDSummaryRow => {
    let bytes = -1;
    let requested_bytes = -1;
    
    if(did.did_type !== DIDType.DERIVED) {
        bytes = did.bytes;
        requested_bytes = did.bytes * copies;
    }

    return {
        ...did,
        length: length,
        copies: copies,
        bytes: bytes,
        requested_bytes: requested_bytes,
    }
}
