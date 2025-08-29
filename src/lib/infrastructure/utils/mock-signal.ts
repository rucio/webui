import { Signal } from '@/lib/sdk/web';
import { Writable } from 'stream';

export class MockSignal<T = any> extends Writable implements Signal<T> {
    data?: T;
    statusCode?: number;

    json(data: T): void {
        this.data = data;
    }

    status(code: number): this {
        this.statusCode = code;
        return this;
    }
}
