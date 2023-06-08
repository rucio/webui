import { DID } from "../../entity/rucio";
import { PassThrough } from 'stream';

export interface ListDIDDTO {
    status: 'success' | 'error';
    error?: 'Invalid Auth Token' | 'Invalid key in filter' | 'Not acceptable' |  'Wrong did type' | 'Unknown Error';
    stream: PassThrough | null;
}

export interface DIDDTO extends DID{
    status: 'success' | 'error';
    error: 'Invalid Auth Token' | 'Data Identifier Not Found' |  'Invalid Parameters' | 'Scope Not Found' |'Unknown Error' | null;
    account: string;
    open: boolean;
    monotonic: boolean;
    expired_at: string;
}