import { isIP } from 'net';
import { ListFileReplicasOptions } from '@/lib/core/dto/replica-dto';

/**
 * Reads the optional `rucio replica list file` options from the query string, and the end user's IP.
 * Unset options are left out so Rucio applies its defaults. The domain is passed through as is and
 * validated by the use case.
 */
export function parseFileReplicasOptions(request: Request, params: Record<string, string | string[]>): ListFileReplicasOptions {
    const options: ListFileReplicasOptions = {};

    const schemes = ([] as string[])
        .concat(params.schemes ?? [])
        .flatMap(value => value.split(','))
        .map(scheme => scheme.trim())
        .filter(Boolean);
    if (schemes.length > 0) options.schemes = schemes;

    if (typeof params.domain === 'string' && params.domain) {
        options.domain = params.domain as ListFileReplicasOptions['domain'];
    }
    if (typeof params.rseExpression === 'string' && params.rseExpression.trim()) {
        options.rseExpression = params.rseExpression;
    }
    if (params.allStates === 'true' || params.allStates === 'false') {
        options.allStates = params.allStates === 'true';
    }

    // Next.js sets x-forwarded-for from the socket, or keeps the chain from a proxy in front of it.
    // The first entry is the browser.
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (clientIp && isIP(clientIp) !== 0) options.clientIp = clientIp;

    return options;
}
