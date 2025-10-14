import { Transform, TransformCallback } from 'stream';
import { HTTPRequest, prepareRequestArgs } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import type StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { BaseDTO, BaseStreamableDTO } from './dto';
import fetch from 'node-fetch';
import { BaseHttpErrorTypes } from './http';
import { PassThrough } from 'node:stream';

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
     * @returns A DTO if an error occurred, undefined if request was successful and retrned a stream.
     */
    async fetch(): Promise<TDTO | undefined> {
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

        const { type, content } = await this.streamingGateway.getJSONChunks(this.request, this.streamAsNDJSON);
        if (type == 'response') {
            const response = content as Response;
            const commonErrors = await handleCommonGatewayEndpointErrors(response.status, response);
            if (commonErrors) {
                return commonErrors as TDTO;
            }

            const error = await this.reportErrors(response.status, response);
            if (error) {
                return error;
            }
            return;
        }
        const stream = content as PassThrough;
        stream.pipe(this);
    }

    /**
     * Reports any errors that occurred during the API request except HTTP status codes 400, 401, 406 and 500, which are automatically
     * handled by the `handleCommonGatewayEndpointErrors` function.
     * The implementation must check the response status code and return a suitable data transfer object (DTO) if an error occurred.
     * The HTTP status codes 400, 401, and 500 are handled by the `handleCommonGatewayEndpointErrors` function.
     * @param statusCode The HTTP status code returned by the API.
     * @param response The response object returned by the API.
     * @returns A promise that resolves to a data transfer object (DTO) containing the error, or `undefined` if no error occurred.
     */
    abstract reportErrors(statusCode: number, response: Response): Promise<TDTO | undefined>;

    /**
     * Creates a data transfer object (DTO) from the streamed data returned by the API.
     * @param response The response data returned by the API as a buffer. This response will contain one individual object in the stream.
     * @returns The DTO that represents the API response or a list of dto's that will be streamed down the pipeline as individual objects.
     */
    abstract createDTO(response: Buffer): TStreamData | TStreamData[];

    /**
     * Transforms the streamed data and pushes it to the client.
     * @param chunk The chunk of data that is being streamed.
     * @param encoding The encoding of the chunk (ignored in object mode).
     * @param callback A callback function that is called when the transformation is complete.
     */
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            const dto = this.createDTO(chunk);
            if (Array.isArray(dto)) {
                dto.forEach(d => this.push(d));
                callback();
                return;
            }
            this.push(dto);
            callback();
        } catch (error) {
            const dto: TDTO = {
                status: 'error',
                errorType: 'gateway_endpoint_error',
                errorMessage: `${error}}`,
            } as TDTO;
            callback(null, dto);
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
    protected rucioHost: string = 'https://rucio-host.com';
    protected parsedBodyAsText: boolean = false;
    protected url: string = '';

    protected envConfigGateway: EnvConfigGatewayOutputPort;

    constructor(parseBodyAsText: boolean = false) {
        this.envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
        this.parsedBodyAsText = parseBodyAsText;
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
     * @returns A promise that resolves to the API response as a data transfer object (DTO) containing the error,
     * or `undefined` if the error could not be identified clearly.
     */
    abstract reportErrors(statusCode: number, response: Response): Promise<TDTO | undefined>;

    /**
     * Creates a data transfer object (DTO) from the API response.
     * @param data The response.json() object returned by the API, or a string if parsedBodyAsText is true.
     * @returns The DTO that represents the API response.
     */
    abstract createDTO(data: object | string): TDTO;

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

        const response: Response = await fetch(preparedRequest.url, preparedRequest.requestArgs);
        if (!response.ok) {
            const commonErrors = await handleCommonGatewayEndpointErrors(response.status, response);
            if (commonErrors) {
                return commonErrors as TDTO;
            }

            const error = await this.reportErrors(response.status, response);
            if (error) {
                return error;
            }
            return {
                status: 'error',
                errorMessage: `An error occurred while fetching ${this.request.url}`,
            } as TDTO;
        } else {
            try {
                if (!this.parsedBodyAsText) {
                    const data = await response.text();
                    // TODO: Handle better: replace Infinity with -1
                    const infinityPatch = data.replace(/Infinity/g, '-1');
                    const json = JSON.parse(infinityPatch);
                    return this.createDTO(json);
                } else {
                    const text = await response.text();
                    return this.createDTO(text);
                }
            } catch (error) {
                return {
                    status: 'error',
                    errorMessage: `An error occurred while fetching and parsing response from ${this.request.url}. Error: ${error}}`,
                } as TDTO;
            }
        }
    }
}

/**
 * Reports any common errors that occurred during the Gateway request.
 * Handles HTTP status codes 400, 401, 406 and 500.
 * @param statusCode The HTTP status code returned by the API.
 * @param response The response object returned by the API.
 * @returns A promise that resolves to the API response as a data transfer object (DTO) containing the error,
 * or `undefined` if the error could not be identified clearly.
 */
async function handleCommonGatewayEndpointErrors<TDTO extends BaseDTO>(statusCode: number, response: Response): Promise<TDTO | undefined> {
    const dto: TDTO = {
        status: 'error',
        errorName: BaseHttpErrorTypes.UNKNOWN_ERROR.errorName,
        errorCode: statusCode,
        errorType: 'gateway_endpoint_error',
        errorMessage: `An error occurred while fetching ${response.url}`,
    } as TDTO;

    switch (statusCode) {
        case 400:
            dto.errorName = BaseHttpErrorTypes.BAD_REQUEST.errorName;
            dto.errorMessage = `The request had invalid syntax.`;
            break;
        case 401:
            dto.errorName = BaseHttpErrorTypes.INVALID_AUTH_TOKEN.errorName;
            dto.errorMessage = `The provided authentication token is invalid or has expired.`;
            break;
        case 404:
            dto.errorName = BaseHttpErrorTypes.NOT_FOUND.errorName;
            dto.errorMessage = `The requested resource was not found at ${response.url}.`;
            break;
        case 406:
            dto.errorName = BaseHttpErrorTypes.NOT_ACCEPTABLE.errorName;
            dto.errorMessage = `Not Acceptable.`;
            break;
        default:
            dto.errorName = BaseHttpErrorTypes.UNKNOWN_ERROR.errorName;
            dto.errorMessage = `An unknown server side error occurred while fetching ${response.url}.`;
            break;
    }

    try {
        const jsonResponse = await response.json();
        dto.errorMessage = jsonResponse.ExceptionMessage;
    } catch (error) {}

    return dto;
}

/**
 *
 * @param response The HTTPResponse object returned by the API.
 * @returns undefined if no error details could be extracted from the response, or a json object containing the error details.
 */
export async function extractErrorMessage(response: Response): Promise<any | undefined> {
    try {
        const error = await response.json();
        return error;
    } catch (error: any) {
        return undefined;
    }
}
