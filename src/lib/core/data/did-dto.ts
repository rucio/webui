import { DID } from "../entity/rucio";
import { PassThrough } from 'stream';

export default interface DIDDTO {
    status: 'success' | 'error';
    error?: 'Invalid Auth Token' | 'Invalid key in filter' | 'Not acceptable' |  'Wrong did type' | 'Unknown Error';
    stream: PassThrough | null;
}