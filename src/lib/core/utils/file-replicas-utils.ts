import { ListFileReplicasOptions } from '@/lib/core/dto/replica-dto';
import { BaseDTO } from '@/lib/sdk/dto';

/**
 * Typed error discriminator shared by the features that call `POST /replicas/list`.
 */
export type FileReplicasErrorType = 'unauthorized' | 'invalid_rse_expression' | 'invalid_domain' | 'invalid_scheme' | 'server_busy' | 'unknown';

export type FileReplicasErrorDetails = {
    code: number;
    name: string;
    message: string;
    errorType: FileReplicasErrorType;
};

const DOMAINS: string[] = ['wan', 'lan', 'all'];
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*$/i;

/**
 * Validates the options Rucio would otherwise silently ignore: an unknown domain returns no PFNs at all.
 * @returns the error to present, or undefined when the options are valid
 */
export function validateFileReplicasOptions(options: Pick<ListFileReplicasOptions, 'domain' | 'schemes'>): FileReplicasErrorDetails | undefined {
    const { domain, schemes } = options;
    if (domain !== undefined && !DOMAINS.includes(domain)) {
        return {
            code: 400,
            name: 'Invalid Domain',
            message: `Domain must be one of ${DOMAINS.join(', ')}`,
            errorType: 'invalid_domain',
        };
    }
    const invalidScheme = (schemes ?? []).find(scheme => !SCHEME_PATTERN.test(scheme));
    if (invalidScheme !== undefined) {
        return {
            code: 400,
            name: 'Invalid Scheme',
            message: `'${invalidScheme}' is not a protocol scheme such as root or davs`,
            errorType: 'invalid_scheme',
        };
    }
    return undefined;
}

/**
 * Normalises validated options before they are sent to Rucio: lower case schemes, trimmed RSE expression.
 */
export function normalizeFileReplicasOptions(options: ListFileReplicasOptions): ListFileReplicasOptions {
    return {
        schemes: options.schemes?.map(scheme => scheme.toLowerCase()),
        domain: options.domain,
        rseExpression: options.rseExpression?.trim() || undefined,
        allStates: options.allStates,
        clientIp: options.clientIp,
    };
}

/**
 * Maps a gateway error from `POST /replicas/list` to a typed error.
 */
export function toFileReplicasError(error: BaseDTO): FileReplicasErrorDetails {
    const base = {
        message: error.errorMessage ? error.errorMessage : 'Gateway Error',
        name: error.errorClass ?? 'Gateway Error',
    };
    if (error.errorCode === 401) {
        return { ...base, code: 401, errorType: 'unauthorized' };
    }
    // Rucio answers 500 for an invalid or empty RSE expression, but it is a bad request from the user
    if (error.errorClass === 'InvalidRSEExpression') {
        return { ...base, code: 400, errorType: 'invalid_rse_expression' };
    }
    if (error.errorCode === 503) {
        return { ...base, code: 503, errorType: 'server_busy' };
    }
    return { ...base, code: error.errorCode ?? 500, errorType: 'unknown' };
}
