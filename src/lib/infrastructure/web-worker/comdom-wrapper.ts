import { Remote, wrap } from "comlink"

/**
 * @description Represents the status of the ComDOM web worker
 * @enum {string}
 * @property {string} NOT_CREATED - The ComDOM web worker has not been created yet
 * @property {string} STOPPED - The ComDOM web worker has been created but not started
 * @property {string} RUNNING - The ComDOM web worker is running
 * @property {string} PREPARING_BATCH - The ComDOM web worker is preparing the next batch of data
 * @property {string} ERROR - The ComDOM web worker has encountered an error
 * @property {string} DONE - The ComDOM web worker has finished fetching all data
 * @property {string} UNKNOWN - The ComDOM web worker has an unknown status
 */

export enum ComDOMStatus {
    NOT_CREATED = 'not_created',
    STOPPED = 'stopped',
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
 * @description Represents the headers of a HTTP request
 */
export type HTTPRequest = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: URL | string
    headers: Headers | { [key: string]: string } | null
    body: { [key: string]: string } | null
}

/**
 * @description Represents the ComDOM web worker
 */
export interface ComDOM<TData> {
    new(verbose: boolean): ComDOM<TData>
    run: (request: HTTPRequest) => Promise<any>
    getNextBatch: () => Promise<BatchResponse<TData> | null>
    isDone: () => Promise<boolean>
    isBatchAvailable: () => Promise<boolean>
    getStatus: () => Promise<ComDOMStatus>
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
    start: (request: HTTPRequest) => Promise<boolean>
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
    private worker: Worker | null = null
    private verbose: boolean
    private wrappedComDOM: Remote<ComDOM<TData>> | null = null
    private comDOM: Remote<ComDOM<TData>> | undefined

    constructor(verbose: boolean = false) {
        this.verbose = verbose
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
            this.comDOM = await new this.wrappedComDOM(this.verbose)
        } catch (error) {
            this.log('Error initializing ComDOM', error)
            
            Promise.reject(error)
        }
        this.log('ComDOM initialized')
    }
    
    async start(request: HTTPRequest): Promise<boolean> {
        if (!this.comDOM || this.comDOM === undefined) {
            this.log('ComDOM not initialized. Initializing ComDOM...')
            await this.init()
        }
        try {
            if(this.comDOM === undefined){
                Promise.reject('Failed to start web worker. ComDOM worker did not initialize')
                return Promise.resolve(false)
            }
            this.log('Starting Fetching of data via ComDOM Web Worker')
            
            if ( request.url instanceof URL){
                request.url = request.url.toString()
            }

            if ( request.headers instanceof Headers){
                request.headers = Object.fromEntries(request.headers.entries())
            }
            
            this.comDOM.run(request)
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
            if (this.worker === null || this.wrappedComDOM === null || this.comDOM === null || this.comDOM === undefined){
                return Promise.resolve(ComDOMStatus.NOT_CREATED)
            }
            const status = await this.comDOM.getStatus()
            switch (status) {
                case 'stopped':
                    return Promise.resolve(ComDOMStatus.STOPPED)
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
        if(this.comDOM === undefined || this.comDOM === null){
            return Promise.reject('ComDOM Web Worker is not initialized')
        }
        let isNewBatchAvailable = null
        let comDOMStatus = null
        try {
            isNewBatchAvailable = await this.comDOM.isBatchAvailable()
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
            // TODO check if this is the right way to terminate the worker
            // this.destroy()
            return null
        } else {
            return Promise.reject('No new batch available yet! Try again later.')
        }
    }
}