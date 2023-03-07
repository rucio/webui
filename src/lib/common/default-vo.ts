import { VO } from "../core/entity/auth-models";

/**
 * Default VO to be shared with both server and client side logic. DO NOT INSERT SERVER SIDE LOGIC HERE.
 */
const DefaultVO: VO = {
    name: 'Default',
    shortName: 'def',
    logoUrl: '',
    oidcEnabled: false,
    oidcProviders: [],
}

export default DefaultVO;