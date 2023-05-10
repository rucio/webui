import { FetchStatus } from "@tanstack/react-query"

export interface TableData<T> {
    data: Array<T>
    fetchStatus: FetchStatus
    pageSize: number
}