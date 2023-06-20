import { BaseDTO } from "@/lib/sdk/dto";
import { OIDCProvider, VO } from "@/lib/core/entity/auth-models";

export interface LoginConfigDTO extends BaseDTO {
    x509Enabled: boolean
    oidcEnabled: boolean
    multiVOEnabled: boolean
    voList: VO[]
    oidcProviders: OIDCProvider[]
    rucioAuthHost: string
}