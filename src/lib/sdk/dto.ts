import { Transform, PassThrough } from 'stream';


/**
 * A data transfer object (DTO) that can be used to represent the response of an API endpoint.
 */
export type BaseDTO = {
    /**
     * A string literal type that indicates the status of the API response. It can be either `'success'` or `'error'`.
     */
    status: 'success' | 'error';
    /**
     * An optional string that provides additional information about the API response.
     */
    message?: string;
}

/**
 * A data transfer object (DTO) that extends the `BaseDTO` interface and adds a `stream` property that can be used to represent a streamable response from an API endpoint.
 */
export type BaseStreamableDTO = BaseDTO & {
    /**
     * An optional property that can be used to represent a streamable response from an API endpoint. It can be either a `Transform` stream, a `PassThrough` stream, or `null`.
     */
    stream?: Transform | PassThrough | null;
}