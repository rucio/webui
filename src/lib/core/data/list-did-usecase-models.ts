import { DID } from "../entity/rucio";

export type ListDIDRequest = {
    query: string;
}

export type ListDIDResponse = DID[]

export type ListDIDError = {
    error: string;
    message: string;
}