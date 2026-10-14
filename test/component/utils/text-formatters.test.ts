import { formatDate, formatDateTime, formatFileSize, formatSeconds } from '@/component-library/features/utils/text-formatters';

const DEFAULT_VALUE = 'N/A';

describe('Text Formatters', () => {
    it('formatDateTime', () => {
        [null, undefined, 'aaa', '0-16-202', '10-0-2026', new Date('1234567')].forEach(el => expect(formatDateTime(el)).toBe(DEFAULT_VALUE));
        expect(formatDateTime(String(Date.UTC(2026, 0, 1)))).toBe(DEFAULT_VALUE);
        expect(formatDateTime(new Date(1234567))).toBe('1970/01/01 00:20:34 UTC');
        expect(formatDateTime(new Date(Date.UTC(2026, 0, 1)))).toBe('2026/01/01 00:00:00 UTC');
        expect(formatDateTime(String(new Date(Date.UTC(2026, 0, 1))))).toBe('2026/01/01 00:00:00 UTC');
        expect(formatDateTime(new Date(Date.UTC(2025, 10, 31, 15, 35, 45)))).toBe('2025/12/01 15:35:45 UTC');
    });

    it('formatDate', () => {
        [null, undefined, 'aaa', 1234567, '', '0-16-2026'].forEach(el => expect(formatDate(String(el))).toBe(DEFAULT_VALUE));
        expect(formatDate(new Date(1234567).toISOString())).toBe('1970/01/01');
        expect(formatDate(new Date('2026-01-01').toISOString())).toBe('2026/01/01');
        expect(formatDate(new Date('2026-01-01T15:35:45').toISOString())).toBe('2026/01/01');
        expect(formatDate(new Date(Date.UTC(2025, 10, 31, 15, 35, 45)).toISOString())).toBe('2025/12/01');
    });

    it('formatFileSize', () => {
        ['ijhsdi', undefined, { name: 'sth' }, [1, 2]].forEach(el => expect(formatFileSize(Number(el))).toBe(DEFAULT_VALUE));
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(-1)).toContain('-');
        expect(formatFileSize(1000)).toBe('1 KB');
        expect(formatFileSize(2 * Math.pow(10, 12))).toBe('2 TB');
        expect(formatFileSize(2 * Math.pow(2, 10 * 4))).not.toBe('2TB');
    });

    it('formatSeconds', () => {
        expect(formatSeconds(0)).toBeUndefined();
        expect(formatSeconds(35)).toBe('35 seconds');
        expect(formatSeconds(119)).toBe('1 minute');
        expect(formatSeconds(10800)).toBe('3 hours');
        expect(formatSeconds(86400)).toBe('1 day');
        expect(formatSeconds(-1)).toBeUndefined();
    });
});
