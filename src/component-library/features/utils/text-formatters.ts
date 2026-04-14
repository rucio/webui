const DEFAULT_VALUE = 'N/A';

export const formatDateTime = (input: Date | string | undefined | null): string => {
    if (input === null || input === undefined) return 'N/A';
    const date = input instanceof Date ? input : new Date(input as string);
    if (isNaN(date.getTime())) return 'N/A';

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

export const formatFileSize = (bytes: number): string => {
    if (isNaN(bytes)) return DEFAULT_VALUE;
    if (bytes === 0) return '0 Bytes';

    const sign = bytes < 0 ? '-' : ''; // Check if the number is negative
    bytes = Math.abs(bytes); // Use the absolute value of the bytes

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${sign}${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
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
