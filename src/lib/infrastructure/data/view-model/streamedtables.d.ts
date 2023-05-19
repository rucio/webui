import { FetchStatus, ColumnDef } from "@tanstack/react-query"

export interface TableData<T> {
    data: Array<T>
    fetchStatus: FetchStatus
    pageSize: number
}

// a columndef can be extended by an additional meta property
// this meta property can be used to store additional information,
// e.g. a style class for the column
export type StyleMetaColumnDef<T> = ColumnDef<T> & { meta: { style: string, filter?: boolean} }