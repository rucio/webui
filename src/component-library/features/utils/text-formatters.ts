export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return 'NaN';
    }
    // TODO: use locale from some context
    return date.toLocaleDateString('en-UK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const formatFileSize = (bytes: number): string => {
    if (isNaN(bytes) || bytes < 0) return 'NaN';
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};