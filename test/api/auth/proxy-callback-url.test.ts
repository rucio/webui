import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { proxy } from '@/proxy';

/**
 * A DID name may contain characters that are escaped into its single [name]
 * path segment, most notably "/" as %2F.  The login redirect has to carry that
 * segment through untouched or the post-login target gains a bogus path
 * segment and 404s.  See #794.
 *
 * `next-auth/*` is globally aliased to a shared mock via moduleNameMapper (see
 * jest.api.config.js); a null token drives proxy() down the initiateLogin path.
 */
describe('proxy() login redirect callbackUrl', () => {
    beforeEach(() => {
        (getToken as jest.Mock).mockResolvedValue(null);
    });

    async function callbackUrlFor(url: string): Promise<string | null> {
        const response = await proxy(new NextRequest(url));
        return new URL(response.headers.get('location')!).searchParams.get('callbackUrl');
    }

    it('keeps an encoded slash inside a DID name escaped', async () => {
        expect(await callbackUrlFor('https://webui.example/did/ddmadmin/foo%2Fbar')).toBe('/did/ddmadmin/foo%2Fbar');
    });

    it('does not let an "&" in a DID name truncate the parameter', async () => {
        expect(await callbackUrlFor('https://webui.example/did/ddmadmin/a&b')).toBe('/did/ddmadmin/a&b');
    });
});
