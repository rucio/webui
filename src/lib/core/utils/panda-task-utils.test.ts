import { DEFAULT_PANDA_BASE_URL, createPandaTaskUrl, isPandaTaskId, normalizePandaBaseUrl } from '@/lib/core/utils/panda-task-utils';

describe('panda-task-utils', () => {
    it.each(['1', '34870879', '999999999999'])('accepts task id %s', id => expect(isPandaTaskId(id)).toBe(true));
    it.each(['', 'abc', '-1', '12a', ' 123', '1234567890123'])('rejects task id %p', id => expect(isPandaTaskId(id)).toBe(false));

    it('normalizes the base URL', () => {
        expect(normalizePandaBaseUrl(undefined)).toBe(DEFAULT_PANDA_BASE_URL);
        expect(normalizePandaBaseUrl('  ')).toBe(DEFAULT_PANDA_BASE_URL);
        expect(normalizePandaBaseUrl(' https://panda.example.org// ')).toBe('https://panda.example.org');
    });

    it('builds the BigPanDA task link', () => {
        expect(createPandaTaskUrl('https://bigpanda.cern.ch/', '34870879')).toBe('https://bigpanda.cern.ch/task/?jeditaskid=34870879');
    });
});
