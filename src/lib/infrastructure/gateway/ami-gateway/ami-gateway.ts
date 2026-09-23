import { injectable } from 'inversify';
import AMIGatewayOutputPort from '@/lib/core/port/secondary/ami-gateway-output-port';
import { AMITagInfoDTO } from '@/lib/core/dto/ami-dto';
import { createAmiApiUrl } from '@/lib/core/utils/ami-tag-utils';
import { amiErrorDTO, parseAmiTagInfoResponse } from './ami-gateway-utils';

/**
 * Talks to the ATLAS Metadata Interface (not a Rucio server), using the same
 * command endpoint as pyAMI's "atlas-v2" endpoint. Tag lookups need no auth.
 */
@injectable()
export default class AMIGateway implements AMIGatewayOutputPort {
    static readonly TIMEOUT_MS = 5000;

    async getTagInfo(baseUrl: string, tag: string): Promise<AMITagInfoDTO> {
        const body = new URLSearchParams({
            Command: `AMIGetAMITagInfo -amiTag="${tag}"`,
            Converter: 'AMIXmlToJson.xsl',
        });
        try {
            const response = await fetch(createAmiApiUrl(baseUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Accept: 'application/json',
                },
                body: body.toString(),
                signal: AbortSignal.timeout(AMIGateway.TIMEOUT_MS),
            });
            if (!response.ok) {
                return amiErrorDTO(tag, response.status, `AMI responded with HTTP ${response.status}`);
            }
            return parseAmiTagInfoResponse(tag, await response.json());
        } catch (error) {
            return amiErrorDTO(tag, 503, error instanceof Error ? error.message : 'AMI request failed');
        }
    }
}
