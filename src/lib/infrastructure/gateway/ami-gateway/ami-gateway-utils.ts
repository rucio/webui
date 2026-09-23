import { AMITagDetails, AMITagInfoDTO } from '@/lib/core/dto/ami-dto';

type AMIField = { '@name': string; $?: string };
type AMIRowset = { '@type': string; row?: { field?: AMIField[] }[] };
type AMIResponse = { AMIMessage?: { rowset?: AMIRowset[]; error?: { $?: string }[] } };

const FIELD_MAP: Record<string, keyof AMITagDetails> = {
    productionStep: 'productionStep',
    baseRelease: 'baseRelease',
    transformationName: 'transformation',
    description: 'description',
    created: 'created',
    createdBy: 'createdBy',
};

export function amiErrorDTO(tag: string, code: number, message: string): AMITagInfoDTO {
    return {
        status: 'error',
        tag,
        found: false,
        errorCode: code,
        errorMessage: message,
        errorName: 'AMIGatewayError',
        errorType: 'gateway_endpoint_error',
    };
}

/**
 * Converts an AMIXmlToJson response into a DTO.
 * An unknown tag comes back with BOTH an error message and an empty field
 * list, so the field list is checked before the error.
 */
export function parseAmiTagInfoResponse(tag: string, json: unknown): AMITagInfoDTO {
    const message = (json as AMIResponse | null)?.AMIMessage;
    if (!message) return amiErrorDTO(tag, 502, 'Unexpected AMI response');

    const row = message.rowset?.find(rowset => rowset['@type'] === 'amiTagInfo')?.row?.[0];
    if (!row) return amiErrorDTO(tag, 502, message.error?.[0]?.$ ?? 'AMI response has no tag info');

    const fields = row.field ?? [];
    const dto: AMITagInfoDTO = { status: 'success', tag, found: fields.length > 0 };
    for (const field of fields) {
        const key = FIELD_MAP[field['@name']];
        if (key && field.$) dto[key] = field.$;
    }
    return dto;
}
