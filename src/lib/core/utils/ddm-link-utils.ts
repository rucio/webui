export const createDDMDashboardUrl = (baseUrl: string, scope: string, name: string, rse: string): string => {
    const params = new URLSearchParams({ 'var-scope': scope, 'var-name': name, 'var-rse': rse });
    return `${baseUrl}?${params.toString()}`;
};
