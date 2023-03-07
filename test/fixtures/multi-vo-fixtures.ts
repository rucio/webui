import { VO } from "@/lib/core/entity/auth-models";
import { getSampleOIDCProviders } from "./oidc-provider-config";

export const getSampleVOs = (): VO[] => {
    const vos: VO[] = [];
    const atlas: VO = {
        name: "ATLAS",
        shortName: "atl",
        logoUrl: "https://atlas.ch/logo.png",
        oidcEnabled: true,
        oidcProviders: [getSampleOIDCProviders()[0]],
    };
    const cms: VO = {
        name: "CMS",
        shortName: "cms",
        logoUrl: "https://cms.ch/logo.png",
        oidcEnabled: false,
        oidcProviders: [],
    };
    vos.push(atlas);
    vos.push(cms);
    return vos;
}

export const getDefaultVO = (): VO => {

    return {
        name: "Default",
        shortName: "def",
        logoUrl: "https://atlas.ch/logo.png",
        oidcEnabled: false,
        oidcProviders: [],
    };
}