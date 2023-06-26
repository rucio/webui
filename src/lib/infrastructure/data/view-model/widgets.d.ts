export type Ongoingrules = {
    rulename: string;
    replicating: number;
    ok: number;
    stuck: number;
}

export type Usedquota = {
    rse: string;
    used: number;
    quota: number;
    total: number
    exceedPermission: boolean;
}