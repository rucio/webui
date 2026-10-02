import { NextRequest } from 'next/server';

// jsdom doesn't ship Response.json, which NextResponse.json relies on.
if (typeof (global.Response as { json?: unknown }).json !== 'function') {
    (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = function jsonPolyfill(
        data: unknown,
        init?: ResponseInit,
    ): Response {
        return new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json' } });
    };
}

// Signed-in session for the success-path tests; executeAuthenticatedController,
// the controller, use case and presenter all run for real.
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => {
    const user = { rucioIdentity: 'root', rucioAccount: 'root', isLoggedIn: true };
    return {
        __esModule: true,
        ...jest.requireActual('@/lib/infrastructure/auth/nextauth-session-utils'),
        getSession: jest.fn(async () => ({ user })),
        withAuthenticatedSession: jest.fn(async (handler: (user: unknown, token: string) => Promise<unknown>) => handler(user, 'test-token')),
    };
});

import { GET } from '@/app/api/feature/get-ami-tag-info/route';

const req = (query: string) => new NextRequest(`http://localhost/api/feature/get-ami-tag-info${query}`);

describe('GET /api/feature/get-ami-tag-info', () => {
    afterEach(() => {
        delete process.env.FEATURE_DIDS_AMI_TAGS;
    });

    it('returns 404 when dids.ami_tags is off (default)', async () => {
        const res = await GET(req('?tags=f1723'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it.each(['', '?tags=', '?tags=AOD', '?tags=f1723,V1'])('returns 400 for %p when enabled', async query => {
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const res = await GET(req(query));
        expect(res.status).toBe(400);
    });

    it('returns 404, not 500, when the flag is on at runtime but the feature was not loaded at startup', async () => {
        // container-config was imported with the flag unset, so the controller is unbound
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const res = await GET(req('?tags=f1723'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it('returns 400 for more than 10 tags when enabled', async () => {
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const tags = Array.from({ length: 11 }, (_, i) => `f${1000 + i}`).join(',');
        expect((await GET(req(`?tags=${tags}`))).status).toBe(400);
    });
});

describe('GET /api/feature/get-ami-tag-info (feature loaded)', () => {
    // Shapes captured from https://atlas-ami.cern.ch/AMI2/FrontEnd (trimmed)
    const KNOWN = {
        AMIMessage: {
            rowset: [
                {
                    '@type': 'amiTagInfo',
                    row: [
                        {
                            field: [
                                { '@name': 'productionStep', $: 'merge' },
                                { '@name': 'baseRelease', $: 'Athena_24.0.128' },
                                { '@name': 'transformationName', $: 'AODMerge_tf.py' },
                            ],
                        },
                    ],
                },
            ],
        },
    };
    const UNKNOWN = {
        AMIMessage: {
            error: [{ $: 'GetAMITagInfo :The tag f99999999 is not defined' }],
            rowset: [{ '@type': 'amiTagInfo', row: [{ field: [] }] }],
        },
    };

    let loadedGET: typeof GET;

    beforeAll(() => {
        // The IoC feature is only bound when the flag is on at startup
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        jest.isolateModules(() => {
            loadedGET = require('@/app/api/feature/get-ami-tag-info/route').GET;
        });
    });

    afterAll(() => {
        delete process.env.FEATURE_DIDS_AMI_TAGS;
    });

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.doMock();
    });

    it('returns 200 with a link and AMI details for each tag', async () => {
        fetchMock.mockResponse(async request => {
            const command = new URLSearchParams(await request.text()).get('Command') ?? '';
            return JSON.stringify(command.includes('"m2281"') ? KNOWN : UNKNOWN);
        });

        const res = await loadedGET(req('?tags=m2281,f99999999'));

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({
            status: 'success',
            tags: [
                {
                    tag: 'm2281',
                    url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=m2281',
                    found: true,
                    productionStep: 'merge',
                    baseRelease: 'Athena_24.0.128',
                    transformation: 'AODMerge_tf.py',
                },
                { tag: 'f99999999', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f99999999', found: false },
            ],
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[0][0]).toBe('https://atlas-ami.cern.ch/AMI2/FrontEnd');
    });

    it('still returns 200 with links when AMI is unreachable', async () => {
        fetchMock.mockReject(new Error('getaddrinfo ENOTFOUND atlas-ami.cern.ch'));

        const res = await loadedGET(req('?tags=f1723'));

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({
            status: 'success',
            tags: [{ tag: 'f1723', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f1723', found: null }],
        });
    });
});
