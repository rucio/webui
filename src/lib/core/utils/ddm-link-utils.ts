export const createDDMDashboardUrl = (baseUrl: string, scope: string, name: string, rse: string): string => {
    const dynamic = [
        `var-dst_endpoint=${encodeURIComponent(rse)}`,
        `var-enr_filters=data.name%7C%3D%7C${encodeURIComponent(name)}`,
        `var-enr_filters=data.scope%7C%3D%7C${encodeURIComponent(scope)}`,
    ].join('&');

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${dynamic}`;
};
