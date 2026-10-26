const DEFAULT_VALUE = 'N/A';

export const formatDateTime = (input: Date | string | undefined | null): string => {
    if (input === null || input === undefined) return DEFAULT_VALUE;
    const date = input instanceof Date ? input : new Date(input as string);
    if (isNaN(date.getTime())) return DEFAULT_VALUE;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;
};

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return DEFAULT_VALUE;
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
};

/**
 * Formats a size in base 10 (1 TB = 10^12 bytes), matching the Rucio CLI's sizefmt
 * so the WebUI and `rucio` output show the same numbers.
 */
export const formatFileSize = (bytes: number): string => {
    if (isNaN(bytes)) return DEFAULT_VALUE;
    if (bytes === 0) return '0 Bytes';

    const sign = bytes < 0 ? '-' : '';
    bytes = Math.abs(bytes);

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // Clamp so sub-byte values stay in Bytes and anything past YB stays in YB
    const i = Math.min(Math.max(Math.floor(Math.log10(bytes) / 3), 0), sizes.length - 1);

    return `${sign}${parseFloat((bytes / Math.pow(1000, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatSeconds = (seconds: number): string | undefined => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (seconds > 0) {
        return `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
    } else {
        return undefined;
    }
};
