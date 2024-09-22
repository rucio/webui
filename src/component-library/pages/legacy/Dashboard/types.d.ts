/*
 * Widget Generics
 * These types are used to type a generic widget -> think of them as table column defs.
 */
export type ChartBasicDataset = {
    label: string;
    data: any[];
    backgroundColor?: string; // Hex
};

export type ChartData<T extends ChartBasicDataset> = {
    labels: string[];
    datasets: T[];
};
