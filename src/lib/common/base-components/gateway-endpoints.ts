import { Transform, TransformCallback } from 'stream';
import{ HTTPRequest, prepareRequestArgs} from '@/lib/common/stream/http';
import { Response } from 'node-fetch';
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway';
import type StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port';
import appContainer from '@/lib/infrastructure/config/ioc/container-config';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { BaseDTO, BaseStreamableDTO } from './dto';
import fetch from 'node-fetch';
import { handleAuthErrors } from '@/lib/infrastructure/auth/auth-utils';

/**
 * An abstract class that extends the `Transform` stream class and provides a base implementation for streamable API endpoints.
 * @template TDTO The type of the data transfer object (DTO) that represents the API response.
 * @template TStreamData The type of the data that is streamed in the API response.
 */
export abstract class BaseStreamableEndpoint<TDTO extends BaseStreamableDTO, TStreamData> extends Transform {
    /**
     * A boolean value that indicates whether the stream should be formatted as NDJSON (newline-delimited JSON) or not.
     */
    protected streamAsNDJSON: boolean;
    /**
     * A boolean value that indicates whether the endpoint has been initialized or not.
     */
    protected initialized: boolean = false;
    /**
     * An optional HTTP request object that represents the request that triggered the API endpoint.
     */
    protected request: HTTPRequest | undefined;
    /**
     * An output port that provides methods for streaming data to a client.
     */
    protected streamingGateway: StreamGatewayOutputPort;
    /**
     * An output port that provides methods for retrieving environment configuration values.
     */
    protected envConfigGateway: EnvConfigGatewayOutputPort;
    /**
     * A string that represents the base URL of the Rucio server.
     */
    protected rucioHost: string = 'http://rucio-host.com';


    /**
     * Creates a new instance of the `BaseStreamableEndpoint` class.
     * @param streamAsNDJSON A boolean value that indicates whether the stream should be formatted as NDJSON (newline-delimited JSON) or not.
     */
    constructor(streamAsNDJSON: boolean = true) {
        super({ objectMode: true });
        this.streamAsNDJSON = streamAsNDJSON;
        this.streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM);
        this.envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
    }

    /**
     * Initializes the endpoint by retrieving environment configuration values.
     * This function MUST be overriden by subclasses to perform additional initialization steps.
     * The overriden function MUST call `super.initialize()` before returning.
     * The overriden function MUST set this.intialized to `true` after performing all initialization steps.
     */
    async initialize(): Promise<void> {
        this.rucioHost = await this.envConfigGateway.rucioHost();
    }
    
    /**
     * Fetches the API response from the server.
     * @returns A promise that resolves to the API response as a data transfer object (DTO).
     */
    async fetch (): Promise<TDTO | undefined> {
        if (!this.initialized) {
            try {
                await this.initialize();
            } catch (error) {
                this.initialized = false;
            }
        }
        if (!this.request) {
            throw new Error(`Request not initialized for ${this.constructor.name}`);
        }
        const response = await this.streamingGateway.getJSONChunks(this.request, this.streamAsNDJSON);
        if (response instanceof Response) {
            const authError = await handleAuthErrors(response);
            if (authError) {
                throw authError;
            }
            const error = await this.reportErrors(response);
            if (error) {
                throw error;
            }
            return;
        }
        response.pipe(this);
    }

     /**
     * Reports any errors that occurred during the API request.
     * The implementation must check the response status code and return a suitable data transfer object (DTO) if an error occurred.
     * @param response The response object returned by the API.
     * @returns A promise that resolves to a data transfer object (DTO) containing the error, or `undefined` if no error occurred.
     */
    abstract reportErrors(response: Response): Promise<TDTO | undefined>;

    /**
     * Creates a data transfer object (DTO) from the streamed data returned by the API.
     * @param response The response data returned by the API as a buffer. This response will contain one individual object in the stream.
     * @returns The DTO that represents the API response.
     */
    abstract createDTO(response: Buffer): TStreamData;

    /**
     * Transforms the streamed data and pushes it to the client.
     * @param chunk The chunk of data that is being streamed.
     * @param encoding The encoding of the chunk (ignored in object mode).
     * @param callback A callback function that is called when the transformation is complete.
     */
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            const dto = this.createDTO(chunk);
            this.push(dto);
            callback();
        } catch (error) {
            this.emit('error', error);
            callback();
        }
    }
}

/**
 * An abstract class that provides a base implementation for a Gateway's API endpoint.
 * @template TDTO The type of the data transfer object (DTO) that represents the API response.
 */
export abstract class BaseEndpoint<TDTO extends BaseDTO> {
    /**
     * A boolean value that indicates whether the endpoint has been initialized or not.
     * This must be explicitly set in the intiialized() function of the subclass.
     */
    protected initialized: boolean = false;
    protected request: HTTPRequest | undefined;
    protected rucioHost: string = 'http://rucio-host.com';
    protected envConfigGateway: EnvConfigGatewayOutputPort;

    constructor(
    ) {
        this.envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
    }

    /**
     * Initializes the endpoint by setting the Rucio host URL.
     * This function MUST be overriden by subclasses to perform additional initialization steps.
     * The overriden function MUST call `super.initialize()` before returning.
     * The overriden function MUST set this.intialized to `true` after performing all initialization steps.
     * @returns A promise that resolves when the endpoint has been initialized.
     */
    async initialize(): Promise<void> {
        this.rucioHost = await this.envConfigGateway.rucioHost();
    }

    /**
     * Reports any errors that occurred during the API request.
     * @param statusCode The HTTP status code returned by the API.
     * @param response The response object returned by the API.
     * @returns A promise that resolves to the API response as a data transfer object (DTO), or `undefined` if an error occurred.
     */
    abstract reportErrors(statusCode: number, response: Response): Promise<TDTO | undefined>;
    
    /**
     * Creates a data transfer object (DTO) from the API response.
     * @param data The response.json() object returned by the API.
     * @returns The DTO that represents the API response.
     */
    abstract createDTO(data: Object): TDTO;

    /**
     * Sends an HTTP request to the API and returns the response as a data transfer object (DTO).
     * @returns A promise that resolves to the API response as a DTO.
     */
    async fetch(): Promise<TDTO> {
        if (!this.initialized) {
            try {
                await this.initialize();
            } catch (error) {
                this.initialized = false;
            }
        }
        if (!this.request) {
            throw new Error(`Request not initialized for ${this.constructor.name}`);
        }

        const preparedRequest = prepareRequestArgs(this.request);

        const response: Response = await fetch(
            preparedRequest.url,
            preparedRequest.requestArgs
        )
        if(!response.ok) {
            const authError = await handleAuthErrors(response);
            if (authError) {
                return authError as TDTO;
            }

            const error = await this.reportErrors(response.status, response);
            if (error) {
                return error;
            }
            return {
                status: 'error',
                message: `An error occurred while fetching ${this.request.url}`,
            } as TDTO;
        } else {
            const data = await response.json();
            return this.createDTO(data);
        }
    }
}