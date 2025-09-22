import type { BaseDTO } from '@/lib/sdk/dto';
import type { OIDCProvider, VO } from '@/lib/core/entity/auth-models';

export interface LoginConfigDTO extends BaseDTO {
    userpassEnabled: boolean;
    x509Enabled: boolean;
    oidcEnabled: boolean;
    multiVOEnabled: boolean;
    voList: VO[];
    oidcProviders: OIDCProvider[];
    rucioAuthHost: string;
}
