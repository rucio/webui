import { Transform, PassThrough, Readable } from 'stream';

/**
 * A data transfer object (DTO) that can be used to represent the response of an API endpoint.
 */
export type BaseDTO = {
    /**
     * A string literal type that indicates the status of the API response. It can be either `'success'` or `'error'`.
     */
    status: 'success' | 'error';

    /**
     * An optional number that indicates the error code. Usually contains an HTTP status code.
     */
    errorCode?: number;

    /**
     * An optional string that provides additional information about the API response. Usually contains the error message.
     */
    errorMessage?: string;
    /**
     * An optional string that provides the name of the error that occurred.
     */
    errorName?: string;

    /**
     * An optional string that provides the type of the error that occurred. Usually contains the name and src of the error
     */
    errorType?: 'gateway_endpoint_error' | string;
};

/**
 * A data transfer object (DTO) that extends the `BaseDTO` interface and adds a `stream` property that can be used to represent a streamable response from an API endpoint.
 */
export type BaseStreamableDTO = BaseDTO & {
    /**
     * An optional property that can be used to represent a streamable response from an API endpoint. It can be either a `Transform` stream, a `PassThrough` stream, or `null`.
     */
    stream?: Transform | PassThrough | Readable | null;
};
