import { OIDCProvider, VO } from "../entity/auth-models";
import LoginConfigOutputPort from "../port/primary/login-config-output-port";

/**
 * Response Model for {@link LoginConfigOutputPort}
 * @property x509Enabled: true if x509 login is enabled
 * @property oidcEnabled: true if oidc login is enabled
 * @property oidcProviders: List of oidc providers
 * @property multiVOEnabled: true if multi vo login is enabled
 * @property voList: List of VOs
 */
export type LoginConfigResponse = {
    x509Enabled: boolean;
    oidcEnabled: boolean;
    oidcProviders: OIDCProvider[];
    multiVOEnabled: boolean;
    voList: VO[];
    rucioAuthHost: string;
}

/**
 * Error Model for {@link LoginConfigOutputPort}
 * @property {string} type - Type of error:
 * 'InvalidConfig': If the configuration file on server side is invalid
 * 'ConfigNotFound': If the configuration file or configuration variables on server side is not found
 * 'UnknownError': If the error is not one of the above
 * @property {string} message - Error message
 */
export type LoginConfigError = {
    type: 'InvalidConfig' | 'ConfigNotFound' | 'UnknownError';
    message: string;
}