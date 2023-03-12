import { Transform } from 'node:stream';
import 'node:stream/promises'
import 'https';
import fetch from 'node-fetch';

export async function run() {
    const abortController = new AbortController();
    const signal = abortController.signal;
}

export default class JSONStream<T> {
    url: string

    constructor(url: string, data: T[]) {
        this.url = url;
    }

    async getDataStream(): Promise<NodeJS.ReadableStream> {
        const res = await fetch(this.url, {
            method: 'GET',
        })
        const stream = res.body;
        return Promise.resolve(stream);
    }
    
}