import { RSE } from "../entity/rucio";
import StreamInputPort from "../port/primary/stream-input-port";
import type StreamOutputPort from "../port/primary/stream-output-port";

export default class StreamUseCase implements StreamInputPort<RSE> {
    bufferedData: RSE[];
    readable: boolean;
    presenter: StreamOutputPort<any>;
    constructor(presenter: StreamOutputPort<any>) {
        this.presenter = presenter;
        this.bufferedData = [];
        this.readable = false;
    }

    prepareData(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    writeToStream(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    read(size?: number | undefined): string | Buffer {
        throw new Error("Method not implemented.");
    }
    setEncoding(encoding: BufferEncoding): this {
        throw new Error("Method not implemented.");
    }
    pause(): this {
        throw new Error("Method not implemented.");
    }
    resume(): this {
        throw new Error("Method not implemented.");
    }
    isPaused(): boolean {
        throw new Error("Method not implemented.");
    }
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean | undefined; } | undefined): T {
        throw new Error("Method not implemented.");
    }
    unpipe(destination?: NodeJS.WritableStream | undefined): this {
        throw new Error("Method not implemented.");
    }
    unshift(chunk: string | Uint8Array, encoding?: BufferEncoding | undefined): void {
        throw new Error("Method not implemented.");
    }
    wrap(oldStream: NodeJS.ReadableStream): this {
        throw new Error("Method not implemented.");
    }
    [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer> {
        throw new Error("Method not implemented.");
    }
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event?: string | symbol | undefined): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    rawListeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    emit(eventName: string | symbol, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    listenerCount(eventName: string | symbol): number {
        throw new Error("Method not implemented.");
    }
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }

}