import { DateISO } from "@/lib/core/entity/rucio"
import { BaseViewModel } from "@/lib/sdk/view-models"
import { RSE, RSEAccountUsageLimit } from "@/lib/core/entity/rucio"

export type RSEProtocol = {
    rseid: string,
    scheme: string,
    hostname: string,
    port: number,
    prefix: string,
    impl: string,
    priorities_lan: {
        read: number,
        write: number,
        delete: number
    },
    priorities_wan: {
        read: number,
        write: number,
        delete: number,
        tpc: number,
        tpcwrite: number,
        tpcread: number,
    },
    updated_at: DateISO,
    created_at: DateISO,
}

export type RSEAttribute = {
    key: string,
    value: string| DateISO | number | boolean | null,
}

export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEProtocolViewModel extends RSEProtocol, BaseViewModel {}

export interface RSEAttributeViewModel extends RSEAttribute, BaseViewModel {}

export interface RSEAccountUsageLimitViewModel extends RSEAccountUsageLimit, BaseViewModel {}