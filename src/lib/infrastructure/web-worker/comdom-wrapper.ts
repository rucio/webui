import { Remote, wrap } from "comlink"

/**
 * @description Represents the status of the ComDOM web worker
 */

export enum ComDOMStatus {
    NOT_STARTED = 'NOT_STARTED',
    RUNNING = 'running',
    PREPARING_BATCH = 'preparing_batch',
    ERROR = 'error',
    DONE = 'done',
    UNKNOWN = "UNKNOWN"
}

/**
 * @description Represents the batch of data returned by the ComDOM web worker
 */
export type BatchResponse<TData> = {
    /** @description The batch id */
    id: number
    /** @description The batch of data */
    data: TData[]
    /** @description True if there is another batch available, false otherwise */
    next: boolean
}

/**
 * @description Represents the ComDOM web worker
 */
export interface ComDOM<TData> {
    new(url: string, start_fetching: boolean, verbose: boolean): ComDOM<TData>
    run: () => Promise<any>
    getNextBatch: () => Promise<BatchResponse<TData> | null>
    isDone: () => Promise<boolean>
    isBatchAvailable: () => Promise<boolean>
    status: () => Promise<string>
}

/**
 * @description
 * This is a wrapper around the ComDOM script in the public directory. The ComDOM script is a Comlink web worker that fetches data in the background.
 * It also provides functions to iterate through the data asynchronously.
 * The ComDOMWrapper is a wrapper around the ComDOM script that provides a more convenient interface to the web worker via React hooks and components.
 */
export interface IComDOMWrapper<TData> {
    /**
     * @description Initializes the ComDOM web worker
     */
    init(): Promise<void>
    /**
     * @description Starts the ComDOM web worker
     * @returns Promise<boolean> true if worker was successfully started, Promise is rejected otherwise
     * */
    start: () => Promise<boolean>
    /**
     * @description Terminates the ComDOM web worker
     * @returns true if worker was successfully terminated, false otherwise
     **/
    destroy() : boolean
    /**
     * @description Returns the next batch of data from the ComDOM web worker
     * @returns Promise<BatchResponse<TData> | null>. If the ComDOM web worker is done, it will be terminated and null will be returned.
     * If the ComDOM web worker is not done, the promise will be rejected if next batch is not yet available.
     */
    next: () => Promise<BatchResponse<TData> | null>
    /**
     * @description Returns the status of the ComDOM web worker
     */
    getComDOMStatus(): Promise<ComDOMStatus>
}


/**
 * @description This class is the implementation of the {@link IComDOMWrapper} interface
 */
export default class ComDOMWrapper<TData> implements IComDOMWrapper<TData> {
    private url: string
    private worker: Worker | null = null
    private verbose: boolean
    private wrappedComDOM: Remote<ComDOM<TData>> | null = null
    private comDOM: Remote<ComDOM<TData>> | undefined
    private startFetchingOnWorkerCreation: boolean

    constructor(url: URL, start_fetching: boolean = false, verbose: boolean = false) {
        this.url = url.toString()
        this.verbose = verbose
        this.startFetchingOnWorkerCreation = start_fetching
    }
   
    log(...args: any[]) {
        if (this.verbose) {
            console.log('ComDOM Wrapper:',new Date().toTimeString() , ...args)
        }
    }

    async init() {
        if(this.worker === null || this.wrappedComDOM === null){
            this.worker = new Worker('/comdom.js')
            this.wrappedComDOM = wrap<ComDOM<TData>>(this.worker)
        }
        this.log('Initializing ComDOM')
        try {
            this.comDOM = await new this.wrappedComDOM(this.url, this.startFetchingOnWorkerCreation, this.verbose)
        } catch (error) {
            this.log('Error initializing ComDOM', error)
            
            Promise.reject(error)
        }
        this.log('ComDOM initialized')
    }
    
    async start(): Promise<boolean> {
        if (!this.comDOM || this.comDOM === undefined) {
            await this.init()
        }
        try {
            await this.comDOM?.run()
            return Promise.resolve(true)
        } catch (error) {
            Promise.reject(error)
        }
        return Promise.resolve(false)
    }

    
    destroy(): boolean {
        try {
            this.comDOM = undefined
            this.worker?.terminate()
            this.worker = null
            return true
        } catch (error) {
            console.error('Error terminating background thread', error)
            return false
        }
    }

    async getComDOMStatus(): Promise<ComDOMStatus> {
        try {
            const status = await this.comDOM?.status()
            switch (status) {
                case 'not_started':
                    return Promise.resolve(ComDOMStatus.NOT_STARTED)
                case 'running':
                    return Promise.resolve(ComDOMStatus.RUNNING)
                case 'preparing_batch':
                    return Promise.resolve(ComDOMStatus.PREPARING_BATCH)
                case 'error':
                    return Promise.resolve(ComDOMStatus.ERROR)
                case 'done':
                    return Promise.resolve(ComDOMStatus.DONE)
                default:
                    return Promise.resolve(ComDOMStatus.UNKNOWN)
            }
        } catch (error) {
            Promise.reject(error)
        }
        return Promise.resolve(ComDOMStatus.UNKNOWN)
    }

    
    async next(): Promise<BatchResponse<TData> | null> {
       
        if( !this.comDOM || this.comDOM === undefined) {
            await this.init()
        }
        let isNewBatchAvailable = null
        let comDOMStatus = ComDOMStatus.UNKNOWN 
        try {
            isNewBatchAvailable = await this.comDOM?.isBatchAvailable()
        } catch (error) {
            this.log('Error getting batch availability', error)
            return Promise.reject(error)
        }

        try {
             comDOMStatus = await this.getComDOMStatus()
        } catch (error) {
            this.log('Error getting ComDOM status', error)
            return Promise.reject(error)
        }

        if(isNewBatchAvailable) {
            if (this.comDOM === undefined) {
                return Promise.reject('ComDOM is undefined')
            }
            return this.comDOM.getNextBatch()
        }
        if (comDOMStatus == ComDOMStatus.DONE) {
            this.destroy()
            return null
        } else {
            return Promise.reject('No new batch available yet! Try again later.')
        }
    }
}