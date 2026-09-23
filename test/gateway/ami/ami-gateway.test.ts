import AMIGateway from '@/lib/infrastructure/gateway/ami-gateway/ami-gateway';
import { parseAmiTagInfoResponse } from '@/lib/infrastructure/gateway/ami-gateway/ami-gateway-utils';

// Captured from https://atlas-ami.cern.ch/AMI2/FrontEnd on 2026-09-23 (trimmed)
const M2281_RESPONSE = {
    AMIMessage: {
        rowset: [
            { '@type': 'amiTag', row: [{ field: [{ '@name': 'amiTag', $: 'm2281' }] }] },
            {
                '@type': 'amiTagInfo',
                row: [
                    {
                        field: [
                            { '@name': 'productionStep', $: 'merge' },
                            { '@name': 'tagType', $: 'm' },
                            { '@name': 'tagNumber', $: '2281' },
                            { '@name': 'baseRelease', $: 'Athena_24.0.128' },
                            { '@name': 'transformationName', $: 'AODMerge_tf.py' },
                            { '@name': 'description', $: 'm2272 with 24.0.128 for first 2026 run' },
                            { '@name': 'created', $: '2026-02-09 18:04:58' },
                            { '@name': 'createdBy', $: 'dta' },
                            { '@name': 'phconfig', $: "{'autoConfiguration': ['everything']}" },
                        ],
                    },
                ],
            },
        ],
    },
};

// Unknown tag: AMI sets error AND returns an empty field list
const UNKNOWN_RESPONSE = {
    AMIMessage: {
        error: [{ $: 'GetAMITagInfo :The tag f99999999 is not defined' }],
        rowset: [
            { '@type': 'amiTag', row: [{ field: [{ '@name': 'amiTag', $: 'f99999999' }] }] },
            { '@type': 'amiTagInfo', row: [{ field: [] }] },
        ],
    },
};

describe('parseAmiTagInfoResponse', () => {
    it('maps whitelisted fields for a known tag', () => {
        expect(parseAmiTagInfoResponse('m2281', M2281_RESPONSE)).toEqual({
            status: 'success',
            tag: 'm2281',
            found: true,
            productionStep: 'merge',
            baseRelease: 'Athena_24.0.128',
            transformation: 'AODMerge_tf.py',
            description: 'm2272 with 24.0.128 for first 2026 run',
            created: '2026-02-09 18:04:58',
            createdBy: 'dta',
        });
    });

    it('treats an empty field list as not found even though AMI sets an error', () => {
        expect(parseAmiTagInfoResponse('f99999999', UNKNOWN_RESPONSE)).toEqual({ status: 'success', tag: 'f99999999', found: false });
    });

    it('returns an error DTO for an AMI error without a tag info rowset', () => {
        const dto = parseAmiTagInfoResponse('f1723', { AMIMessage: { error: [{ $: 'boom' }] } });
        expect(dto.status).toBe('error');
        expect(dto.errorMessage).toBe('boom');
    });

    it('returns an error DTO for an unexpected shape', () => {
        expect(parseAmiTagInfoResponse('f1723', { foo: 1 }).status).toBe('error');
        expect(parseAmiTagInfoResponse('f1723', null).status).toBe('error');
    });
});

describe('AMIGateway', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.doMock();
    });
    afterEach(() => fetchMock.dontMock());

    it('POSTs the AMIGetAMITagInfo command as a form to /AMI2/FrontEnd', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(M2281_RESPONSE), { status: 200, headers: { 'Content-Type': 'application/json' } });
        const dto = await new AMIGateway().getTagInfo('https://atlas-ami.cern.ch/', 'm2281');

        expect(dto.found).toBe(true);
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://atlas-ami.cern.ch/AMI2/FrontEnd');
        expect(init?.method).toBe('POST');
        const body = new URLSearchParams(init?.body as string);
        expect(body.get('Command')).toBe('AMIGetAMITagInfo -amiTag="m2281"');
        expect(body.get('Converter')).toBe('AMIXmlToJson.xsl');
        expect((init?.headers as Record<string, string>)['Content-Type']).toContain('application/x-www-form-urlencoded');
    });

    it('returns an error DTO on a non-2xx response', async () => {
        fetchMock.mockResponseOnce('nope', { status: 503 });
        const dto = await new AMIGateway().getTagInfo('https://atlas-ami.cern.ch', 'f1723');
        expect(dto).toMatchObject({ status: 'error', tag: 'f1723', found: false, errorCode: 503 });
    });

    it('returns an error DTO on invalid JSON', async () => {
        fetchMock.mockResponseOnce('<html>', { status: 200 });
        expect((await new AMIGateway().getTagInfo('https://atlas-ami.cern.ch', 'f1723')).status).toBe('error');
    });

    it('returns an error DTO when fetch rejects (network error / timeout)', async () => {
        fetchMock.mockRejectOnce(new Error('The operation was aborted due to timeout'));
        const dto = await new AMIGateway().getTagInfo('https://atlas-ami.cern.ch', 'f1723');
        expect(dto).toMatchObject({ status: 'error', errorMessage: 'The operation was aborted due to timeout' });
    });
});
