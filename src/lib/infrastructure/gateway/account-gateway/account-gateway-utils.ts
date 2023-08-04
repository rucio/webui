import { AccountRSEUsageDTO } from "@/lib/core/dto/account-dto";

/**
 * Represents the Rucio response for {@link ListAccountRSEUsageEndpoint}
 */
export type TRucioAccountRSEUsage = {
    rse_id: string;
    rse: string;
    bytes: number;
    files: number;
    bytes_limit: number;
    bytes_remaining: number;
}

/**
 * Converts the {@link TRucioAccountRSEUsage} object returned by Rucio Server to {@link AccountRSEUsageDTO} object
 * @param data The {@link TRucioAccountRSEUsage} object returned by Rucio Server
 * @param account The account for which the usage is being retrieved
 * @returns equivalent {@link AccountRSEUsageDTO} object
 */
export function convertToAccountRSEUsageDTO(data: TRucioAccountRSEUsage, account: string): AccountRSEUsageDTO {
    const dto: AccountRSEUsageDTO = {
        status: 'success',
        account: account,
        rse_id: data.rse_id,
        rse: data.rse,
        used_bytes: data.bytes,
        used_files: data.files,
        quota_bytes: data.bytes_limit,
    }
    return dto
}