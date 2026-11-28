import type { OIDCProvider, VO } from './auth-models';

/**
 * Reads a configuration value when called. The IoC layer wires it to the validated server
 * configuration, so use cases depend on plain values instead of on how they are loaded.
 */
export type ConfigReader<T> = () => T;

export type LoginSettings = {
    x509Enabled: boolean;
    userpassEnabled: boolean;
    oidcEnabled: boolean;
    oidcProviders: OIDCProvider[];
    multiVOEnabled: boolean;
    voList: VO[];
    rucioAuthHost: string;
};

export type SiteHeaderSettings = {
    projectUrl?: string;
    rucioAuthHost: string;
};

export type DDMDashboardSettings = {
    enabled: boolean;
    baseUrl?: string;
};
