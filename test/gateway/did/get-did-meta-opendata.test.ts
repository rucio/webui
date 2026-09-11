jest.mock('@/lib/infrastructure/ioc/container-config', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

import GetDIDMetaEndpoint from '@/lib/infrastructure/gateway/did-gateway/endpoints/get-did-meta-endpoint';

const endpoint = Object.create(GetDIDMetaEndpoint.prototype) as GetDIDMetaEndpoint;

const baseDIDMetadata = {
    scope: 'mock',
    name: 'dataset',
    account: 'root',
    did_type: 'DATASET',
    type: 'DATASET',
    open: false,
    monotonic: false,
    hidden: false,
    obsolete: false,
    complete: true,
    is_new: false,
    availability: 'AVAILABLE',
    suppressed: false,
    bytes: 0,
    length: 0,
    md5: null,
    adler32: null,
    guid: null,
    expired_at: null,
    deleted_at: null,
    accessed_at: null,
    access_cnt: null,
    created_at: '2026-09-09T00:00:00Z',
    updated_at: '2026-09-09T00:00:00Z',
};

describe('GetDIDMetaEndpoint OpenData metadata', () => {
    it('defaults is_opendata to false when the server omits it', () => {
        const dto = endpoint.createDTO(baseDIDMetadata);

        expect(dto.is_opendata).toBe(false);
    });

    it('preserves is_opendata=true returned by the server', () => {
        const dto = endpoint.createDTO({
            ...baseDIDMetadata,
            is_opendata: true,
        });

        expect(dto.is_opendata).toBe(true);
    });

    it('preserves is_opendata=false returned by the server', () => {
        const dto = endpoint.createDTO({
            ...baseDIDMetadata,
            is_opendata: false,
        });

        expect(dto.is_opendata).toBe(false);
    });
});
