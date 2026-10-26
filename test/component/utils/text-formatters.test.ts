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
        expect(formatDate(new Date('2026-01-01T15:35:45Z').toISOString())).toBe('2026/01/01');
        expect(formatDate(new Date(Date.UTC(2025, 10, 31, 15, 35, 45)).toISOString())).toBe('2025/12/01');
    });

    it('formatFileSize', () => {
        ['ijhsdi', undefined, { name: 'sth' }, [1, 2]].forEach(el => expect(formatFileSize(Number(el))).toBe(DEFAULT_VALUE));
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(512)).toBe('512 Bytes');
        expect(formatFileSize(-1)).toBe('-1 Bytes');
        expect(formatFileSize(-200e9)).toBe('-200 GB');
    });

    it('formatFileSize uses base 10 like the Rucio CLI', () => {
        expect(formatFileSize(1000)).toBe('1 KB');
        expect(formatFileSize(1_500_000_000)).toBe('1.5 GB');
        expect(formatFileSize(1e12)).toBe('1 TB');
        expect(formatFileSize(2e12)).toBe('2 TB');
        // 2 TiB is 2.2 TB in base 10, not 2 TB
        expect(formatFileSize(2 * Math.pow(2, 40))).toBe('2.2 TB');
        [1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24].forEach((bytes, i) =>
            expect(formatFileSize(bytes)).toBe(`1 ${['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i]}`),
        );
    });

    it('formatFileSize clamps values outside the unit range', () => {
        expect(formatFileSize(0.5)).toBe('0.5 Bytes');
        expect(formatFileSize(1e27)).toBe('1000 YB');
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
