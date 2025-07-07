const DEFAULT_VALUE = 'NaN';

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return DEFAULT_VALUE;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

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

export const formatSeconds = (seconds: number): string => {
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
        return DEFAULT_VALUE;
    }
};
