import { DateISO } from "@/lib/core/entity/rucio"

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