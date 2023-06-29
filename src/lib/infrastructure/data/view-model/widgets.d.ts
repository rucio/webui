/*
* Widget Generics
* These types are used to type a generic widget -> think of them as table column defs.
*/
export type ChartBasicDataset = {
    label: string,
    data: any[],
    backgroundColor?: string, // Hex
}

export type ChartData<T extends ChartBasicDataset> = {
    labels: string[],
    datasets: T[],
}

/*
* Widget Types
* These types are used to type a specific widget -> they correspond to a table row
*/

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