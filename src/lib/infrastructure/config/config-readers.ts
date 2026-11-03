import type { ConfigReader, DDMDashboardSettings, LoginSettings, SiteHeaderSettings } from '@/lib/core/entity/app-config';
import type { VO } from '@/lib/core/entity/auth-models';
import { getServerEnv } from './env.server';

/**
 * Adapters from the validated server configuration to the settings the use cases ask for.
 * They are passed to use case constructors by the IoC wiring and read the configuration on each call.
 */

export const loginSettings: ConfigReader<LoginSettings> = () => {
    const env = getServerEnv();
    return {
        x509Enabled: env.X509_ENABLED,
        userpassEnabled: env.ENABLE_USERPASS_LOGIN,
        oidcEnabled: env.OIDC_ENABLED,
        oidcProviders: env.oidcProviders,
        multiVOEnabled: env.MULTIVO_ENABLED,
        voList: env.voList,
        rucioAuthHost: env.RUCIO_AUTH_HOST,
    };
};

export const siteHeaderSettings: ConfigReader<SiteHeaderSettings> = () => {
    const env = getServerEnv();
    return { projectUrl: env.PROJECT_URL, rucioAuthHost: env.RUCIO_AUTH_HOST };
};

export const ddmDashboardSettings: ConfigReader<DDMDashboardSettings> = () => {
    const env = getServerEnv();
    return { enabled: env.FEATURE_DDM_DASHBOARD, baseUrl: env.DDM_DASHBOARD_BASE_URL };
};

export const voList: ConfigReader<VO[]> = () => getServerEnv().voList;

export const amiBaseUrl: ConfigReader<string> = () => getServerEnv().AMI_BASE_URL;

export const pandaBaseUrl: ConfigReader<string> = () => getServerEnv().PANDA_BASE_URL;
