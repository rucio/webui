import { DIDLong, RSEAccountUsage } from './rucio';

/**
 * @interface TDIDSummaryRow represents the DID Summary Row for DID Summary Table used to Create New Rules.
 * The bytes and requested_bytes are -1 if the DID is a derived DID, as these values cannot be determined during summary generation.
 * @property copies - The number of replicas of the DID to be created
 * @property requested_bytes - The requested size on any RSE where the rule is to be created
 */
export type TDIDSummaryRow = DIDLong & {
    copies: number;
    requested_bytes: number | 'cannot be determined as DID has not been sampled';
};

/**
 * @interface TRSESummaryRow represents the RSE Summary Row for RSE Summary Table used to Create New Rules.
 * @property bytes_remaining - The bytes remaining in the RSE for the account
 * @property has_quota - Whether the account has a quota on the RSE
 * @property total_expected_usage - The total expected usage of the account on the RSE after the rule is created
 */
export interface TRSESummaryRow extends RSEAccountUsage {
    bytes_remaining: number;
    has_quota: boolean;
    total_expected_usage: number;
}

/**
 * @interface TAccountRSEUsageAndLimit represents the remaining bytes and limit of an account.
 */
type TAccountRSEUsageAndLimit = {
    limit: number | undefined;
    bytesRemaining: number | undefined;
};

/**
 * @interface TAccountRSEUsageAndLimits represents the remaining bytes and limit of an account on an RSE.
 */
export type TAccountRSEUsageAndLimits = Record<string, TAccountRSEUsageAndLimit>;
