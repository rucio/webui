export const createDefaultFTSUrl = (host: string, id: string): string => {
    // Replace port 8446 with 8449
    const dashboardHost = host.slice(0, -1) + '9/ftsmon/#/job';
    return `${dashboardHost}/${id}`;
};
